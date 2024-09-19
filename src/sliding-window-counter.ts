const WORD_SIZE = 32;

export class SlidingWindowCounter {
    private memory: Uint32Array;
    private count: number;
    private index: number;

    constructor(private size: number = 1) {
        this.memory = new Uint32Array(size); // is WORD_SIZE dependent
        this.count = 0;
        this.index = 0;
    }

    write(value: number) {
        const wordIndex = Math.floor(this.index / WORD_SIZE);
        const bitIndex = this.index % WORD_SIZE;

        const currentWord = this.memory[wordIndex];

        const forgetValue = (currentWord & (1 << bitIndex)) == 0 ? 0 : 1;

        // Clear the bit at the current index. `~` is the bitwise NOT operator --> e.g. 0b000100 -> 0b111011
        let targetWord = currentWord & ~(1 << bitIndex);

        if (value == 1) {
            targetWord |= value << bitIndex;
        }

        this.memory[wordIndex] = targetWord;

        this.count += value - forgetValue;

        // loop to zero if we reach the end of the memory
        this.index = (this.index + 1) % (this.size * WORD_SIZE);
    }

    get counter() {
        return this.count;
    }
}