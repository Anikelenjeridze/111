"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const flashcards_1 = require("../src/flashcards");
const algorithm_1 = require("../src/algorithm");
/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
//
describe("getBucketRange()", () => {
    // Helper function to create flashcards for testing
    function createFlashcard(front, back) {
        return new flashcards_1.Flashcard(front, back, "", []);
    }
    it("returns undefined for empty array", () => {
        const emptyArray = [];
        const result = (0, algorithm_1.getBucketRange)(emptyArray);
        assert_1.default.strictEqual(result, undefined);
    });
    it("returns undefined when all buckets are empty", () => {
        const buckets = [new Set(), new Set(), new Set()];
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.strictEqual(result, undefined);
    });
    it("handles single bucket with cards", () => {
        const card = createFlashcard("hello", "hola");
        const buckets = [new Set([card])];
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.deepStrictEqual(result, { minBucket: 0, maxBucket: 0 });
    });
    it("handles multiple contiguous buckets with cards", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const card3 = createFlashcard("cat", "gato");
        const buckets = [
            new Set([card1]),
            new Set([card2]),
            new Set([card3])
        ];
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
    });
    it("handles buckets with empty buckets in between", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("cat", "gato");
        const buckets = [
            new Set([card1]),
            new Set(),
            new Set([card2])
        ];
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
    });
    it("handles only highest bucket with cards", () => {
        const card = createFlashcard("hello", "hola");
        const buckets = [
            new Set(),
            new Set(),
            new Set(),
            new Set([card])
        ];
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.deepStrictEqual(result, { minBucket: 3, maxBucket: 3 });
    });
    it("handles only lowest bucket with cards", () => {
        const card = createFlashcard("hello", "hola");
        const buckets = [
            new Set([card]),
            new Set(),
            new Set(),
            new Set()
        ];
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.deepStrictEqual(result, { minBucket: 0, maxBucket: 0 });
    });
    it("handles large array with cards at extremes", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const buckets = [];
        for (let i = 0; i < 10; i++) {
            buckets.push(new Set());
        }
        buckets[0] = new Set([card1]);
        buckets[9] = new Set([card2]);
        const result = (0, algorithm_1.getBucketRange)(buckets);
        assert_1.default.deepStrictEqual(result, { minBucket: 0, maxBucket: 9 });
    });
});
describe("getBucketRange()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
describe("practice()", () => {
    // Helper function to create flashcards for testing
    function createFlashcard(front, back) {
        return new flashcards_1.Flashcard(front, back, "", []);
    }
    it("returns empty set for empty buckets array", () => {
        const emptyArray = [];
        const result = (0, algorithm_1.practice)(emptyArray, 0);
        assert_1.default.strictEqual(result.size, 0);
    });
    it("returns empty set when no buckets are scheduled", () => {
        // Day 3 should only practice buckets 0 and 2, but there are none
        const buckets = [
            new Set(), // Bucket 0 empty
            new Set([createFlashcard("hello", "hola")]), // Bucket 1 has card
            new Set(), // Bucket 2 empty
        ];
        const result = (0, algorithm_1.practice)(buckets, 3);
        assert_1.default.strictEqual(result.size, 0);
    });
    it("schedules bucket 0 for every day", () => {
        const card = createFlashcard("hello", "hola");
        const buckets = [new Set([card])];
        // Test several different days
        for (const day of [0, 1, 2, 5, 10, 15]) {
            const result = (0, algorithm_1.practice)(buckets, day);
            assert_1.default.strictEqual(result.size, 1);
            (0, assert_1.default)(result.has(card));
        }
    });
    it("schedules bucket 1 every two days", () => {
        const card = createFlashcard("hello", "hola");
        const buckets = [
            new Set(),
            new Set([card]),
        ];
        // Days 0, 2, 4, etc. should have the card
        for (const day of [0, 2, 4, 6, 10]) {
            const result = (0, algorithm_1.practice)(buckets, day);
            assert_1.default.strictEqual(result.size, 1);
            (0, assert_1.default)(result.has(card));
        }
        // Days 1, 3, 5, etc. should not have the card
        for (const day of [1, 3, 5, 7, 11]) {
            const result = (0, algorithm_1.practice)(buckets, day);
            assert_1.default.strictEqual(result.size, 0);
        }
    });
    it("schedules bucket 2 every four days", () => {
        const card = createFlashcard("hello", "hola");
        const buckets = [
            new Set(),
            new Set(),
            new Set([card]),
        ];
        // Days 0, 4, 8, etc. should have the card
        for (const day of [0, 4, 8, 12]) {
            const result = (0, algorithm_1.practice)(buckets, day);
            assert_1.default.strictEqual(result.size, 1);
            (0, assert_1.default)(result.has(card));
        }
        // Other days should not have the card
        for (const day of [1, 2, 3, 5, 6, 7, 9, 10, 11]) {
            const result = (0, algorithm_1.practice)(buckets, day);
            assert_1.default.strictEqual(result.size, 0);
        }
    });
    it("schedules cards from multiple buckets", () => {
        const card0 = createFlashcard("zero", "cero");
        const card1 = createFlashcard("one", "uno");
        const card2 = createFlashcard("two", "dos");
        const card3 = createFlashcard("three", "tres");
        const buckets = [
            new Set([card0]), // Bucket 0: every day
            new Set([card1]), // Bucket 1: every 2 days
            new Set([card2]), // Bucket 2: every 4 days
            new Set([card3]), // Bucket 3: every 8 days
        ];
        // Day 0: all buckets
        let result = (0, algorithm_1.practice)(buckets, 0);
        assert_1.default.strictEqual(result.size, 4);
        (0, assert_1.default)(result.has(card0));
        (0, assert_1.default)(result.has(card1));
        (0, assert_1.default)(result.has(card2));
        (0, assert_1.default)(result.has(card3));
        // Day 1: only bucket 0
        result = (0, algorithm_1.practice)(buckets, 1);
        assert_1.default.strictEqual(result.size, 1);
        (0, assert_1.default)(result.has(card0));
        // Day 2: buckets 0 and 1
        result = (0, algorithm_1.practice)(buckets, 2);
        assert_1.default.strictEqual(result.size, 2);
        (0, assert_1.default)(result.has(card0));
        (0, assert_1.default)(result.has(card1));
        // Day 4: buckets 0, 1, and 2
        result = (0, algorithm_1.practice)(buckets, 4);
        assert_1.default.strictEqual(result.size, 3);
        (0, assert_1.default)(result.has(card0));
        (0, assert_1.default)(result.has(card1));
        (0, assert_1.default)(result.has(card2));
        // Day 8: all buckets
        result = (0, algorithm_1.practice)(buckets, 8);
        assert_1.default.strictEqual(result.size, 4);
        (0, assert_1.default)(result.has(card0));
        (0, assert_1.default)(result.has(card1));
        (0, assert_1.default)(result.has(card2));
        (0, assert_1.default)(result.has(card3));
    });
    it("handles multiple cards in the same bucket", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const buckets = [
            new Set([card1, card2]),
        ];
        const result = (0, algorithm_1.practice)(buckets, 0);
        assert_1.default.strictEqual(result.size, 2);
        (0, assert_1.default)(result.has(card1));
        (0, assert_1.default)(result.has(card2));
    });
    it("handles large day numbers", () => {
        const card0 = createFlashcard("zero", "cero");
        const card1 = createFlashcard("one", "uno");
        const card2 = createFlashcard("two", "dos");
        const buckets = [
            new Set([card0]), // Bucket 0: every day
            new Set([card1]), // Bucket 1: every 2 days
            new Set([card2]), // Bucket 2: every 4 days
        ];
        const result = (0, algorithm_1.practice)(buckets, 100);
        assert_1.default.strictEqual(result.size, 3);
        (0, assert_1.default)(result.has(card0));
        (0, assert_1.default)(result.has(card1));
        (0, assert_1.default)(result.has(card2));
    });
});
describe("practice()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
describe("update()", () => {
    // Helper function to create flashcards for testing
    function createFlashcard(front, back) {
        return new flashcards_1.Flashcard(front, back, "", []);
    }
    // Helper function to check if a card is in a specific bucket
    function isCardInBucket(buckets, bucketNum, card) {
        const bucket = buckets.get(bucketNum);
        return bucket !== undefined && bucket.has(card);
    }
    // Helper function to count total cards across all buckets
    function countTotalCards(buckets) {
        let count = 0;
        for (const bucket of buckets.values()) {
            count += bucket.size;
        }
        return count;
    }
    it("moves card to bucket 0 when answered Wrong", () => {
        const card = createFlashcard("hello", "hola");
        const bucketMap = new Map();
        bucketMap.set(2, new Set([card]));
        const result = (0, algorithm_1.update)(bucketMap, card, flashcards_1.AnswerDifficulty.Wrong);
        assert_1.default.strictEqual(countTotalCards(result), 1);
        (0, assert_1.default)(isCardInBucket(result, 0, card));
        (0, assert_1.default)(!isCardInBucket(result, 2, card));
    });
    it("moves card up one bucket when answered Easy", () => {
        const card = createFlashcard("hello", "hola");
        const bucketMap = new Map();
        bucketMap.set(2, new Set([card]));
        const result = (0, algorithm_1.update)(bucketMap, card, flashcards_1.AnswerDifficulty.Easy);
        assert_1.default.strictEqual(countTotalCards(result), 1);
        (0, assert_1.default)(isCardInBucket(result, 3, card));
        (0, assert_1.default)(!isCardInBucket(result, 2, card));
    });
    it("moves card down one bucket when answered Hard", () => {
        const card = createFlashcard("hello", "hola");
        const bucketMap = new Map();
        bucketMap.set(2, new Set([card]));
        const result = (0, algorithm_1.update)(bucketMap, card, flashcards_1.AnswerDifficulty.Hard);
        assert_1.default.strictEqual(countTotalCards(result), 1);
        (0, assert_1.default)(isCardInBucket(result, 1, card));
        (0, assert_1.default)(!isCardInBucket(result, 2, card));
    });
    it("keeps card in bucket 0 when answered Hard", () => {
        const card = createFlashcard("hello", "hola");
        const bucketMap = new Map();
        bucketMap.set(0, new Set([card]));
        const result = (0, algorithm_1.update)(bucketMap, card, flashcards_1.AnswerDifficulty.Hard);
        assert_1.default.strictEqual(countTotalCards(result), 1);
        (0, assert_1.default)(isCardInBucket(result, 0, card));
        assert_1.default.strictEqual(result.get(0)?.size, 1);
    });
    it("handles retired bucket (5) when answered Easy", () => {
        const card = createFlashcard("hello", "hola");
        const bucketMap = new Map();
        const retiredBucket = 5;
        bucketMap.set(retiredBucket, new Set([card]));
        const result = (0, algorithm_1.update)(bucketMap, card, flashcards_1.AnswerDifficulty.Easy);
        // Should remain in retired bucket
        assert_1.default.strictEqual(countTotalCards(result), 1);
        (0, assert_1.default)(isCardInBucket(result, retiredBucket, card));
    });
    it("moves from retired bucket to bucket 0 when answered Wrong", () => {
        const card = createFlashcard("hello", "hola");
        const bucketMap = new Map();
        const retiredBucket = 5;
        bucketMap.set(retiredBucket, new Set([card]));
        const result = (0, algorithm_1.update)(bucketMap, card, flashcards_1.AnswerDifficulty.Wrong);
        assert_1.default.strictEqual(countTotalCards(result), 1);
        (0, assert_1.default)(isCardInBucket(result, 0, card));
        (0, assert_1.default)(!isCardInBucket(result, retiredBucket, card));
    });
    it("maintains other cards in buckets", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const card3 = createFlashcard("cat", "gato");
        const bucketMap = new Map();
        bucketMap.set(1, new Set([card1]));
        bucketMap.set(2, new Set([card2, card3]));
        const result = (0, algorithm_1.update)(bucketMap, card2, flashcards_1.AnswerDifficulty.Easy);
        assert_1.default.strictEqual(countTotalCards(result), 3);
        (0, assert_1.default)(isCardInBucket(result, 1, card1));
        (0, assert_1.default)(isCardInBucket(result, 3, card2));
        (0, assert_1.default)(isCardInBucket(result, 2, card3));
    });
    it("adds card to bucket 0 if not present in any bucket when answered Wrong", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const bucketMap = new Map();
        bucketMap.set(1, new Set([card1]));
        const result = (0, algorithm_1.update)(bucketMap, card2, flashcards_1.AnswerDifficulty.Wrong);
        assert_1.default.strictEqual(countTotalCards(result), 2);
        (0, assert_1.default)(isCardInBucket(result, 1, card1));
        (0, assert_1.default)(isCardInBucket(result, 0, card2));
    });
    it("adds card to bucket 1 if not present in any bucket when answered Easy", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const bucketMap = new Map();
        bucketMap.set(1, new Set([card1]));
        const result = (0, algorithm_1.update)(bucketMap, card2, flashcards_1.AnswerDifficulty.Easy);
        assert_1.default.strictEqual(countTotalCards(result), 2);
        (0, assert_1.default)(isCardInBucket(result, 1, card1));
        (0, assert_1.default)(isCardInBucket(result, 1, card2));
    });
    it("adds card to bucket 0 if not present in any bucket when answered Hard", () => {
        const card1 = createFlashcard("hello", "hola");
        const card2 = createFlashcard("goodbye", "adios");
        const bucketMap = new Map();
        bucketMap.set(1, new Set([card1]));
        const result = (0, algorithm_1.update)(bucketMap, card2, flashcards_1.AnswerDifficulty.Hard);
        assert_1.default.strictEqual(countTotalCards(result), 2);
        (0, assert_1.default)(isCardInBucket(result, 1, card1));
        (0, assert_1.default)(isCardInBucket(result, 0, card2));
    });
});
describe("update()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
    it("Example test case - replace with your own tests", () => {
        assert_1.default.fail("Replace this test case with your own tests based on your testing strategy");
    });
});
