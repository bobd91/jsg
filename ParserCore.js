
// TODO: speed up skipping adjoining whitespace
class ParserCore {
    constructor(input) {
        this.input = input;
        this.line = 1;
        this.linepos = 0;
        this.linetok = 1;
        this.linetokpos = 0;
        this.pos = 0;
    }
    
    // Get Ascii code n single width characters from current position
    la(n) {
        return this.input.charCodeAt(this.pos + n);
    }

    // Get Unicode code point n single width characters from current position
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

    // Move current position forward n characters
    forward(n) {
        this.pos += n;
    }

    // Accept token of given length
    // Token may be skipped if whitespace, line terminator or comment
    // in which case return null
    // Otherwise return the token
    acceptToken(type, length) {
        if(this.processWhiteSpace(type, length)) {
            return null;
        }
        if(type < this.Token.$Token) {
            return this.makeToken(type, 0, length);
        } else {
            return this.makeToken(type & this.Token.$Token, type, length);
        }
    }

    // Skip the number of chars
    // Used when token is whitespace
    skipToken(length) {
        this.line = this.linetok;
        this.linepos = this.linetokpos;
        this.forward(length);
    }

    // Make a token
    // type must be actual token type
    // literal must be 0 if not a literal token
    // length is chars in token
    makeToken(type, literal, length) {
        let pos = this.pos;
        if(length === 0 && type !== this.Token.$EOF) {
            length = 1;
            type = this.Token.$Error;
            literal = 0;
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
        return new Token(type, literal, this.input, pos, length, start, end);
    }
    
    // If token type is whitespace, lineterminator or comment then skip forward
    // and return true
    // Otherwise return false
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

    // Return previously peeked token and remove it from tokens to return
    peekedToken() {
        return this.peekTokens.shift;
    }

    // Return next non-whitespace token
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

    // Return next non-whitespace token if specified type, otherwise error
    findTokenType(type) {
        let token = this.findToken();
        if(token.type != type) {
            this.unexpectedToken(token);
        }
        return token;
    }

    // Return next non-whitespace token but leave it as if not found
    peekToken() {
        let token = this.findToken();
        this.peekTokens.push(token);
        return token;
    }

    // Return next non-whitespace token of specified type but leave it as if not found
    // If not correct type then error
    peekTokenType(type) {
        let token = this.findTokenType();
        this.peekTokens.push(token);
        return token;
    }

    // Return the next token, may be whitespace
    nextToken() {
        let c1 = this.la(0);
        if(c1 < 128) {
            let t = this.map[c1];
            if(t >= 0) {
                return this.acceptToken(t, 1);
            } else {
                t = -t;
                if(t < this.Literal.$Literal) {
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

    // Change the parse map, any peeked tokens will have to be reparsed
    setMap(map) {
        this.map = map;
        this.peekTokens = [];
    }

    // Line counting
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
