import { SlidingWindowCounter, WORD_SIZE } from "./sliding-window-counter";

export class HalfFullSlidingCounter extends SlidingWindowCounter {
    constructor(size: number = 1) {
        super(
            size,
            new Uint32Array(size).fill(0b10101010101010101010101010101010),
            Math.floor(size * WORD_SIZE / 2)
        );
    }
}