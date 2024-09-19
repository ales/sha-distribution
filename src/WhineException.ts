export class WhineException extends Error {
    constructor(message: string) {

        const div = document.createElement("div");
        div.style.position = "relative";
        div.style.backgroundColor = "#1b1b1b";
        div.style.color = "#f0f0f0";
        div.style.padding = "1rem";

        const pre = document.createElement("pre");
        pre.innerText = message;

        div.appendChild(pre);

        document.body.prepend(div);

        super(message);

        this.name = "WhineException";
    }
}