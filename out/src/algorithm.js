"use strict";
/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the Didit autograder.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBucketSets = toBucketSets;
exports.getBucketRange = getBucketRange;
exports.practice = practice;
exports.update = update;
exports.getHint = getHint;
exports.computeProgress = computeProgress;
/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
function toBucketSets(buckets) {
    const maxBucket = Math.max(0, ...Array.from(buckets.keys()));
    const bucketArray = Array.from({ length: maxBucket + 1 }, () => new Set());
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
function getBucketRange(buckets) {
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
function practice(buckets, day) {
    // TODO: Implement this function
    throw new Error("Implement me!");
}
/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
function update(buckets, card, difficulty) {
    // TODO: Implement this function
    throw new Error("Implement me!");
}
/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
function getHint(card) {
    // TODO: Implement this function (and strengthen the spec!)
    throw new Error("Implement me!");
}
/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
function computeProgress(buckets, history) {
    // Replace 'any' with appropriate types
    // TODO: Implement this function (and define the spec!)
    throw new Error("Implement me!");
}
