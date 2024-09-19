export class Last32 {
    private memory: Uint32Array;
    private count: number;

    constructor() {
        this.memory = new Uint32Array(1);
        this.count = 0;
    }

    write(value: number) {
        const toForget = (this.memory[0] & 0x80000000) == 0 ? 0 : 1;

        this.memory[0] = (this.memory[0] << 1) | value;

        this.count += value - toForget;
    }

    get ones() {
        return this.count;
    }
}