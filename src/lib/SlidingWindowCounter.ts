export const WORD_SIZE = 8;

export class SlidingWindowCounter {
    private index: number = 0;

    constructor(
        private size: number = 1,
        private memory: Uint8Array = new Uint8Array(size), // is WORD_SIZE dependent
        private count: number = 0
    ) {}

    get counter() {
        return this.count;
    }

    write(value: number) {
        const wordIndex = Math.floor(this.index / WORD_SIZE);
        const bitIndex = this.index % WORD_SIZE;

        const currentWord = this.memory[wordIndex];
        const currentValue = (currentWord & (1 << bitIndex)) == 0 ? 0 : 1;

        // - clear the bit at the current index. // `~` is the bitwise NOT operator --> e.g. currentWord & 0b111011
        // - and merge in the value. // `<<` is the bitwise left shift operator --> 0b10000011 << 2 === 0b00001100
        this.memory[wordIndex] = currentWord & ~(1 << bitIndex) | value << bitIndex;
    
        // update the cached value for fast read access
        this.count += value - currentValue;

        // loop to zero if we reach the end of the memory
        this.index = (this.index + 1) % (this.size * WORD_SIZE);
    }
}