
class ParserCore {
    constructor(input) {
        this.input = input;
        this.line = 1;
        this.linepos = 0;
        this.linetok = 1;
        this.linetokpos = 0;
        this.pos = 0;
    }
    
    la(n) {
        return this.input.charCodeAt(this.pos + n);
    }

    lax(n) {
        let c1 = this.la(n);
        if(c1 >= 0xD800 && c1 <= 0xDBFF) {
            let c2 = this.la(n + 1);
            if(c2 >= 0xDC00 && c2 <= 0xDFFF) {
                return (c1 - 0xD800) * 1024 + (c2 - 0xDC00) + 0x10000;
            }
        }
        return c1;
    }

    forward(n) {
        this.pos += n;
    }

    acceptToken(type, length) {
        if(this.processWhiteSpace(type, length)) {
            return null;
        }
        return this.makeToken(type, 0, length);
    }

    literalToken(type, ltype, length) {
        this.makeToken(type, ltype, length);
    }

    skipToken(length) {
        this.line = this.linetok;
        this.linepos = this.linetokpos;
        this.forward(length);
    }

    makeToken(type, ltype, length) {
        let pos = this.pos;
        if(length === 0 && type !== this.Token.$EOF) {
            length = 1;
            type = this.Token.$Error;
        }
        let start = { line: this.line, col: pos - this.linepos };
        if(type === this.Token.$Error) {
            this.linetok = this.line;
            this.linetokpos = this.linepos;
        } else {
            this.line = this.linetok;
            this.linepos = this.linetokpos;
        }
        this.forward(length);
        let end = { line: this.line, col: this.pos - this.linepos};
        return new Token(type, subtype, this.input, pos, length, start, end);
    }
    
    processWhiteSpace(type, length) {
        if(type === this.Token.WhiteSpace) {
            this.skipToken(length);
            return true;
        } else if(type === this.Token.LineTerminatorSequence) {
            this.newLine(length);
            this.skipToken(length);
            return true;
        } else if(type === this.Token.Comment) {
            if(this.collectComment) {
                this.collectComment(this.makeToken(type, length));
            } else {
                this.skipToken(length);
            }
            return true;
        }
        return false;
    }

    peekedToken() {
        return this.peekTokens.shift;
    }

    findToken() {
        let t;
        if(this.peekTokens.length) {
            return this.peekedToken();
        }
        do {
            t = this.nextToken();
        } while(!t);
        return t;
    }

    findTokenType(type) {
        let token = this.findToken();
        if(token.type != type) {
            this.unexpectedToken(token);
        }
        return token;
    }

    peekToken() {
        let token = this.findToken();
        this.peekTokens.push(token);
        return token;
    }

    peekTokenType(type) {
        let token = this.findTokenType();
        this.peekTokens.push(token);
        return token;
    }

    nextToken() {
        let c1 = this.la(0);
        if(c1 < 128) {
            let t = this.map[c1];
            if(t >= 0) {
                return this.acceptToken(t, 1);
            } else {
                t = -t;
                if(t < this.Token.$Unknown) {
                    return this.lexKnownToken(t);
                } else {
                    return this.lexUnknownToken(t);
                }
            }
        } else if(Number.isNaN(c1)) {
            return this.acceptToken(this.Token.$EOF, 0);
        } else {
            return this.lexNonAsciiToken(c1);
        }
    }

    setMap(map) {
        this.map = map;
        this.peekTokens = [];
    }

    newLine(n) {
        this.linetok ++;
        this.linetokpos = this.pos + n;
    }

    isEOF(c1) {
        return c1 === undefined;
    }

    unexpectedToken(token) {
        throw token;
    }

}
