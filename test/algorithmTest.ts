import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */




//
describe("getBucketRange()", () => {
  // Helper function to create flashcards for testing
  function createFlashcard(front: string, back: string): Flashcard {
    return new Flashcard(front, back, "", []);
  }

  it("returns undefined for empty array", () => {
    const emptyArray: Array<Set<Flashcard>> = [];
    const result = getBucketRange(emptyArray);
    assert.strictEqual(result, undefined);
  });

  it("returns undefined when all buckets are empty", () => {
    const buckets: Array<Set<Flashcard>> = [new Set(), new Set(), new Set()];
    const result = getBucketRange(buckets);
    assert.strictEqual(result, undefined);
  });

  it("handles single bucket with cards", () => {
    const card = createFlashcard("hello", "hola");
    const buckets: Array<Set<Flashcard>> = [new Set([card])];
    
    const result = getBucketRange(buckets);
    
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 0 });
  });

  it("handles multiple contiguous buckets with cards", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    const card3 = createFlashcard("cat", "gato");
    
    const buckets: Array<Set<Flashcard>> = [
      new Set([card1]),
      new Set([card2]),
      new Set([card3])
    ];
    
    const result = getBucketRange(buckets);
    
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
  });

  it("handles buckets with empty buckets in between", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("cat", "gato");
    
    const buckets: Array<Set<Flashcard>> = [
      new Set([card1]),
      new Set(),
      new Set([card2])
    ];
    
    const result = getBucketRange(buckets);
    
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
  });

  it("handles only highest bucket with cards", () => {
    const card = createFlashcard("hello", "hola");
    const buckets: Array<Set<Flashcard>> = [
      new Set(),
      new Set(),
      new Set(),
      new Set([card])
    ];
    
    const result = getBucketRange(buckets);
    
    assert.deepStrictEqual(result, { minBucket: 3, maxBucket: 3 });
  });

  it("handles only lowest bucket with cards", () => {
    const card = createFlashcard("hello", "hola");
    const buckets: Array<Set<Flashcard>> = [
      new Set([card]),
      new Set(),
      new Set(),
      new Set()
    ];
    
    const result = getBucketRange(buckets);
    
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 0 });
  });

  it("handles large array with cards at extremes", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    
    const buckets: Array<Set<Flashcard>> = [];
    for (let i = 0; i < 10; i++) {
      buckets.push(new Set());
    }
    buckets[0] = new Set([card1]);
    buckets[9] = new Set([card2]);
    
    const result = getBucketRange(buckets);
    
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 9 });
  });
});



describe("practice()", () => {
  // Helper function to create flashcards for testing
  function createFlashcard(front: string, back: string): Flashcard {
    return new Flashcard(front, back, "", []);
  }

  it("returns empty set for empty buckets array", () => {
    const emptyArray: Array<Set<Flashcard>> = [];
    const result = practice(emptyArray, 0);
    assert.strictEqual(result.size, 0);
  });

  it("returns empty set when no buckets are scheduled", () => {
    // Day 3 should only practice buckets 0 and 2, but there are none
    const buckets: Array<Set<Flashcard>> = [
      new Set(), // Bucket 0 empty
      new Set([createFlashcard("hello", "hola")]), // Bucket 1 has card
      new Set(), // Bucket 2 empty
    ];
    
    const result = practice(buckets, 3);
    
    assert.strictEqual(result.size, 0);
  });

  it("schedules bucket 0 for every day", () => {
    const card = createFlashcard("hello", "hola");
    const buckets: Array<Set<Flashcard>> = [new Set([card])];
    
    // Test several different days
    for (const day of [0, 1, 2, 5, 10, 15]) {
      const result = practice(buckets, day);
      assert.strictEqual(result.size, 1);
      assert(result.has(card));
    }
  });

  it("schedules bucket 1 every two days", () => {
    const card = createFlashcard("hello", "hola");
    const buckets: Array<Set<Flashcard>> = [
      new Set(),
      new Set([card]),
    ];
    
    // Days 0, 2, 4, etc. should have the card
    for (const day of [0, 2, 4, 6, 10]) {
      const result = practice(buckets, day);
      assert.strictEqual(result.size, 1);
      assert(result.has(card));
    }
    
    // Days 1, 3, 5, etc. should not have the card
    for (const day of [1, 3, 5, 7, 11]) {
      const result = practice(buckets, day);
      assert.strictEqual(result.size, 0);
    }
  });

  it("schedules bucket 2 every four days", () => {
    const card = createFlashcard("hello", "hola");
    const buckets: Array<Set<Flashcard>> = [
      new Set(),
      new Set(),
      new Set([card]),
    ];
    
    // Days 0, 4, 8, etc. should have the card
    for (const day of [0, 4, 8, 12]) {
      const result = practice(buckets, day);
      assert.strictEqual(result.size, 1);
      assert(result.has(card));
    }
    
    // Other days should not have the card
    for (const day of [1, 2, 3, 5, 6, 7, 9, 10, 11]) {
      const result = practice(buckets, day);
      assert.strictEqual(result.size, 0);
    }
  });

  it("schedules cards from multiple buckets", () => {
    const card0 = createFlashcard("zero", "cero");
    const card1 = createFlashcard("one", "uno");
    const card2 = createFlashcard("two", "dos");
    const card3 = createFlashcard("three", "tres");
    
    const buckets: Array<Set<Flashcard>> = [
      new Set([card0]), // Bucket 0: every day
      new Set([card1]), // Bucket 1: every 2 days
      new Set([card2]), // Bucket 2: every 4 days
      new Set([card3]), // Bucket 3: every 8 days
    ];
    
    // Day 0: all buckets
    let result = practice(buckets, 0);
    assert.strictEqual(result.size, 4);
    assert(result.has(card0));
    assert(result.has(card1));
    assert(result.has(card2));
    assert(result.has(card3));
    
    // Day 1: only bucket 0
    result = practice(buckets, 1);
    assert.strictEqual(result.size, 1);
    assert(result.has(card0));
    
    // Day 2: buckets 0 and 1
    result = practice(buckets, 2);
    assert.strictEqual(result.size, 2);
    assert(result.has(card0));
    assert(result.has(card1));
    
    // Day 4: buckets 0, 1, and 2
    result = practice(buckets, 4);
    assert.strictEqual(result.size, 3);
    assert(result.has(card0));
    assert(result.has(card1));
    assert(result.has(card2));
    
    // Day 8: all buckets
    result = practice(buckets, 8);
    assert.strictEqual(result.size, 4);
    assert(result.has(card0));
    assert(result.has(card1));
    assert(result.has(card2));
    assert(result.has(card3));
  });

  it("handles multiple cards in the same bucket", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    
    const buckets: Array<Set<Flashcard>> = [
      new Set([card1, card2]),
    ];
    
    const result = practice(buckets, 0);
    
    assert.strictEqual(result.size, 2);
    assert(result.has(card1));
    assert(result.has(card2));
  });

  it("handles large day numbers", () => {
    const card0 = createFlashcard("zero", "cero");
    const card1 = createFlashcard("one", "uno");
    const card2 = createFlashcard("two", "dos");
    
    const buckets: Array<Set<Flashcard>> = [
      new Set([card0]), // Bucket 0: every day
      new Set([card1]), // Bucket 1: every 2 days
      new Set([card2]), // Bucket 2: every 4 days
    ];
    
    const result = practice(buckets, 100);
    assert.strictEqual(result.size, 3);
    assert(result.has(card0));
    assert(result.has(card1));
    assert(result.has(card2));
  });
});


describe("update()", () => {
  // Helper function to create flashcards for testing
  function createFlashcard(front: string, back: string): Flashcard {
    return new Flashcard(front, back, "", []);
  }

  // Helper function to check if a card is in a specific bucket
  function isCardInBucket(buckets: BucketMap, bucketNum: number, card: Flashcard): boolean {
    const bucket = buckets.get(bucketNum);
    return bucket !== undefined && bucket.has(card);
  }

  // Helper function to count total cards across all buckets
  function countTotalCards(buckets: BucketMap): number {
    let count = 0;
    for (const bucket of buckets.values()) {
      count += bucket.size;
    }
    return count;
  }

  it("moves card to bucket 0 when answered Wrong", () => {
    const card = createFlashcard("hello", "hola");
    const bucketMap: BucketMap = new Map();
    bucketMap.set(2, new Set([card]));
    
    const result = update(bucketMap, card, AnswerDifficulty.Wrong);
    
    assert.strictEqual(countTotalCards(result), 1);
    assert(isCardInBucket(result, 0, card));
    assert(!isCardInBucket(result, 2, card));
  });

  it("moves card up one bucket when answered Easy", () => {
    const card = createFlashcard("hello", "hola");
    const bucketMap: BucketMap = new Map();
    bucketMap.set(2, new Set([card]));
    
    const result = update(bucketMap, card, AnswerDifficulty.Easy);
    
    assert.strictEqual(countTotalCards(result), 1);
    assert(isCardInBucket(result, 3, card));
    assert(!isCardInBucket(result, 2, card));
  });

  it("moves card down one bucket when answered Hard", () => {
    const card = createFlashcard("hello", "hola");
    const bucketMap: BucketMap = new Map();
    bucketMap.set(2, new Set([card]));
    
    const result = update(bucketMap, card, AnswerDifficulty.Hard);
    
    assert.strictEqual(countTotalCards(result), 1);
    assert(isCardInBucket(result, 1, card));
    assert(!isCardInBucket(result, 2, card));
  });

  it("keeps card in bucket 0 when answered Hard", () => {
    const card = createFlashcard("hello", "hola");
    const bucketMap: BucketMap = new Map();
    bucketMap.set(0, new Set([card]));
    
    const result = update(bucketMap, card, AnswerDifficulty.Hard);
    
    assert.strictEqual(countTotalCards(result), 1);
    assert(isCardInBucket(result, 0, card));
    assert.strictEqual(result.get(0)?.size, 1);
  });

  it("handles retired bucket (5) when answered Easy", () => {
    const card = createFlashcard("hello", "hola");
    const bucketMap: BucketMap = new Map();
    const retiredBucket = 5;
    bucketMap.set(retiredBucket, new Set([card]));
    
    const result = update(bucketMap, card, AnswerDifficulty.Easy);
    
    // Should remain in retired bucket
    assert.strictEqual(countTotalCards(result), 1);
    assert(isCardInBucket(result, retiredBucket, card));
  });

  it("moves from retired bucket to bucket 0 when answered Wrong", () => {
    const card = createFlashcard("hello", "hola");
    const bucketMap: BucketMap = new Map();
    const retiredBucket = 5;
    bucketMap.set(retiredBucket, new Set([card]));
    
    const result = update(bucketMap, card, AnswerDifficulty.Wrong);
    
    assert.strictEqual(countTotalCards(result), 1);
    assert(isCardInBucket(result, 0, card));
    assert(!isCardInBucket(result, retiredBucket, card));
  });

  it("maintains other cards in buckets", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    const card3 = createFlashcard("cat", "gato");
    
    const bucketMap: BucketMap = new Map();
    bucketMap.set(1, new Set([card1]));
    bucketMap.set(2, new Set([card2, card3]));
    
    const result = update(bucketMap, card2, AnswerDifficulty.Easy);
    
    assert.strictEqual(countTotalCards(result), 3);
    assert(isCardInBucket(result, 1, card1));
    assert(isCardInBucket(result, 3, card2));
    assert(isCardInBucket(result, 2, card3));
  });

  it("adds card to bucket 0 if not present in any bucket when answered Wrong", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    
    const bucketMap: BucketMap = new Map();
    bucketMap.set(1, new Set([card1]));
    
    const result = update(bucketMap, card2, AnswerDifficulty.Wrong);
    
    assert.strictEqual(countTotalCards(result), 2);
    assert(isCardInBucket(result, 1, card1));
    assert(isCardInBucket(result, 0, card2));
  });

  it("adds card to bucket 1 if not present in any bucket when answered Easy", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    
    const bucketMap: BucketMap = new Map();
    bucketMap.set(1, new Set([card1]));
    
    const result = update(bucketMap, card2, AnswerDifficulty.Easy);
    
    assert.strictEqual(countTotalCards(result), 2);
    assert(isCardInBucket(result, 1, card1));
    assert(isCardInBucket(result, 1, card2));
  });

  it("adds card to bucket 0 if not present in any bucket when answered Hard", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("goodbye", "adios");
    
    const bucketMap: BucketMap = new Map();
    bucketMap.set(1, new Set([card1]));
    
    const result = update(bucketMap, card2, AnswerDifficulty.Hard);
    
    assert.strictEqual(countTotalCards(result), 2);
    assert(isCardInBucket(result, 1, card1));
    assert(isCardInBucket(result, 0, card2));
  });
});




describe("getHint()", () => {
  function createFlashcard(front: string, back: string): Flashcard {
    return new Flashcard(front, back, "", []);
  }

  it("handles short backs (less than 3 characters)", () => {
    const card1 = createFlashcard("one", "hi");
    const card2 = createFlashcard("two", "a");
    
    assert.strictEqual(getHint(card1), "h*");
    assert.strictEqual(getHint(card2), "a");
  });

  it("reveals first 1/3 of characters for longer backs", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("language", "espanol");
    const card3 = createFlashcard("world", "universe");
    
    assert.strictEqual(getHint(card1), "h***");
    assert.strictEqual(getHint(card2), "es*****");
    assert.strictEqual(getHint(card3), "un******");
  });

  it("ensures minimum hidden characters for longer words", () => {
    const card1 = createFlashcard("long", "spectacular");
    const card2 = createFlashcard("complex", "extraordinary");
    
    assert.strictEqual(getHint(card1), "sp*********");
    assert.strictEqual(getHint(card2), "ex***********");
  });

  it("handles unicode and special characters", () => {
    const card1 = createFlashcard("unicode", "こんにちは");
    const card2 = createFlashcard("special", "Hello, World!");
    
    assert.strictEqual(getHint(card1), "こ****");
    assert.strictEqual(getHint(card2), "He***********");
  });
});



describe("computeProgress()", () => {
  function createFlashcard(front: string, back: string): Flashcard {
    return new Flashcard(front, back, "", []);
  }

  it("handles empty buckets and history", () => {
    const buckets: BucketMap = new Map();
    const history: Map<Flashcard, AnswerDifficulty[]> = new Map();
    
    const result = computeProgress(buckets, history);
    
    assert.strictEqual(result.totalCards, 0);
    assert.deepStrictEqual(result.cardsPerBucket, {});
    assert.strictEqual(result.percentLearned, 0);
    assert.strictEqual(result.averageCompletionRate, 0);
  });

  it("computes total cards and cards per bucket", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("bye", "adios");
    const card3 = createFlashcard("cat", "gato");
    
    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [2, new Set([card2, card3])]
    ]);
    const history: Map<Flashcard, AnswerDifficulty[]> = new Map();
    
    const result = computeProgress(buckets, history);
    
    assert.strictEqual(result.totalCards, 3);
    assert.deepStrictEqual(result.cardsPerBucket, {
      0: 1,
      2: 2
    });
  });

  it("computes percent learned", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("bye", "adios");
    const card3 = createFlashcard("cat", "gato");
    const card4 = createFlashcard("dog", "perro");
    
    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [3, new Set([card2])],
      [4, new Set([card3])],
      [5, new Set([card4])]
    ]);
    const history: Map<Flashcard, AnswerDifficulty[]> = new Map();
    
    const result = computeProgress(buckets, history);
    
    assert.strictEqual(result.totalCards, 4);
    assert.strictEqual(result.percentLearned, 75);
  });

  it("computes average completion rate", () => {
    const card1 = createFlashcard("hello", "hola");
    const card2 = createFlashcard("bye", "adios");
    
    const buckets: BucketMap = new Map([
      [0, new Set([card1, card2])]
    ]);
    const history: Map<Flashcard, AnswerDifficulty[]> = new Map([
      [card1, [AnswerDifficulty.Easy, AnswerDifficulty.Easy, AnswerDifficulty.Wrong]],
      [card2, [AnswerDifficulty.Easy, AnswerDifficulty.Hard, AnswerDifficulty.Easy]]
    ]);
    
    const result = computeProgress(buckets, history);
    
    // Completion rates: [2/3, 2/3] = 2/3 average
    assert.strictEqual(result.averageCompletionRate, 2/3);
  });
});




