import { SlidingWindowCounter, WORD_SIZE } from "./SlidingWindowCounter";

export class HalfFullSlidingCounter extends SlidingWindowCounter {
    constructor(size: number = 1) {
        super(
            size,
            new Uint8Array(size).fill(0b01010101),
            Math.floor(size * WORD_SIZE / 2)
        );
    }
}