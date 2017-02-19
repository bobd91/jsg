
class Token {
    constructor(type, ltype, text, pos, length, start, end) {
        this.type = type;
        this.ltype = ltype;
        this.text = text;
        this.pos =  pos;
        this.length = length;
        this.start = start;
        this.end = end;
    }
    toString() {
        return `${this.type} ${this.ltype} (${this.start.line}:${this.start.col})(${this.end.line}:${this.end.col}) ${this.text.slice(this.pos, this.pos + this.length)}`;
    }
}

