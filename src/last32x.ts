export class Last32TimesX {
    private memory: Uint32Array;
    private count: number;

    constructor(private size: number = 1) {
        this.memory = new Uint32Array(size);
        this.count = 0;
    }

    write(value: number) {
        const toForget = (this.memory[this.size-1] & 0x80000000) == 0 ? 0 : 1;

        for (let i = this.size - 1; i > 0; i--) {
            this.memory[i] = this.memory[i] << 1 | ((this.memory[i - 1] & 0x80000000) == 0 ? 0 : 1);
        }

        this.memory[0] = (this.memory[0] << 1) | value;

        this.count += value - toForget;
    }

    get ones() {
        return this.count;
    }
}