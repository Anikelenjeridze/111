/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the Didit autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
 
  const maxBucket = Math.max(0, ...Array.from(buckets.keys()));
  
  const bucketArray: Array<Set<Flashcard>> = Array.from(
      { length: maxBucket + 1 },
      () => new Set<Flashcard>()
  );
  
  for (const [bucket, flashcards] of buckets.entries()) {
      bucketArray[bucket] = new Set(flashcards);
  }
  
  return bucketArray;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  // Find the first non-empty bucket from the start
  let minBucket = -1;
  for (let i = 0; i < buckets.length; i++) {
    // Use optional chaining and explicit null check to satisfy TypeScript
    if (buckets[i]?.size ?? 0 > 0) {
      minBucket = i;
      break;
    }
  }

  // If no non-empty bucket was found, return undefined
  if (minBucket === -1) {
    return undefined;
  }

  // Find the last non-empty bucket from the end
  let maxBucket = minBucket;
  for (let i = buckets.length - 1; i >= minBucket; i--) {
    // Use optional chaining and explicit null check to satisfy TypeScript
    if (buckets[i]?.size ?? 0 > 0) {
      maxBucket = i;
      break;
    }
  }

  return { minBucket, maxBucket };
}
/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const practiceSet = new Set<Flashcard>();

  // Ensure bucket 0 exists and add its cards
  if (buckets[0]) {
    for (const card of buckets[0]) {
      practiceSet.add(card);
    }
  }

  // Practice cards in buckets based on the day
  for (let bucket = 1; bucket < buckets.length; bucket++) {
    // Type guard to ensure bucket exists and has cards
    const currentBucket = buckets[bucket];
    if (currentBucket && currentBucket.size > 0 && day % (2 ** bucket) === 0) {
      for (const card of currentBucket) {
        practiceSet.add(card);
      }
    }
  }

  return practiceSet;
}


// The rest of the test suite remains the same as in the previous implementation
describe("practice()", () => {
  // ... (previous test cases)
});

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  // Create a deep copy of the buckets map to avoid modifying the original
  const updatedBuckets = new Map(
    Array.from(buckets.entries()).map(([bucket, cards]) => [bucket, new Set(cards)])
  );

  // Remove the card from its current bucket
  let currentBucket: number | undefined;
  for (const [bucket, cards] of updatedBuckets.entries()) {
    if (cards.has(card)) {
      currentBucket = bucket;
      cards.delete(card);
      break;
    }
  }

  // Default to bucket 0 if the card is not found in any bucket
  currentBucket = currentBucket ?? 0;

  // Determine the new bucket based on difficulty
  let newBucket: number;
  switch (difficulty) {
    case AnswerDifficulty.Wrong:
      newBucket = 0;
      break;
    case AnswerDifficulty.Hard:
      newBucket = Math.max(0, currentBucket - 1);
      break;
    case AnswerDifficulty.Easy:
      newBucket = currentBucket === 5 ? 5 : currentBucket + 1;
      break;
  }

  // Add the card to the new bucket
  if (!updatedBuckets.has(newBucket)) {
    updatedBuckets.set(newBucket, new Set());
  }
  updatedBuckets.get(newBucket)!.add(card);

  return updatedBuckets;
}

export function getHint(card: Flashcard): string {
  const { back } = card;

  // Handle very short backs (less than 3 characters)
  if (back.length < 3) {
    return back[0] + '*'.repeat(Math.max(0, back.length - 1));
  }

  // Use Array.from to correctly handle unicode characters
  const backChars = Array.from(back);

  // Calculate reveal length based on word length
  let revealLength: number;
  if (backChars.length <= 6) {
    // For words up to 6 characters, reveal 1 character
    revealLength = 1;
  } else {
    // For words longer than 6 characters, reveal 2 characters
    revealLength = 2;
  }

  // Reveal part and create hidden part
  const revealedPart = backChars.slice(0, revealLength).join('');
  const hiddenPart = '*'.repeat(backChars.length - revealLength);

  return revealedPart + hiddenPart;
}
/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export interface ProgressStats {
  totalCards: number;
  cardsPerBucket: Record<number, number>;
  percentLearned: number;
  averageCompletionRate: number;
}

export function computeProgress(
  buckets: BucketMap, 
  history: Map<Flashcard, AnswerDifficulty[]>
): ProgressStats {
  // Total number of cards
  const totalCards = Array.from(buckets.values())
    .reduce((total, bucket) => total + bucket.size, 0);
  
  // Count cards per bucket
  const cardsPerBucket: Record<number, number> = {};
  for (const [bucket, cards] of buckets.entries()) {
    cardsPerBucket[bucket] = cards.size;
  }
  
  // Compute learning progress (percentage of cards in advanced buckets)
  const advancedBuckets = [3, 4, 5];
  const advancedCards = advancedBuckets.reduce((total, bucket) => 
    total + (cardsPerBucket[bucket] || 0), 0);
  const percentLearned = totalCards > 0 
    ? (advancedCards / totalCards) * 100 
    : 0;
  
  // Compute average completion rate based on answer history
  const completionRates = Array.from(history.entries()).map(([card, cardHistory]) => {
    const goodAttempts = cardHistory.filter(
      attempt => attempt === AnswerDifficulty.Easy
    ).length;
    return goodAttempts / cardHistory.length;
  });
  
  const averageCompletionRate = completionRates.length > 0
    ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
    : 0;
  
  return {
    totalCards,
    cardsPerBucket,
    percentLearned,
    averageCompletionRate
  };
}