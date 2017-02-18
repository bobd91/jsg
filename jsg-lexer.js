"use strict";

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
        return this.makeToken(type, length);
    }

    skipToken(length) {
        this.line = this.linetok;
        this.linepos = this.linetokpos;
        this.forward(length);
    }

    makeToken(type, length) {
        let pos = this.pos;
        if(length === 0 && type !== this.Token.$EOF) {
            length = 1;
            type = this.Token.$Error;
        }
        let start = { line: this.line, col: pos - this.linepos };
        //let startLine = this.line;
        //let startCol = pos - this.linepos;
        if(type === this.Token.$Error) {
            this.linetok = this.line;
            this.linetokpos = this.linepos;
        } else {
            this.line = this.linetok;
            this.linepos = this.linetokpos;
        }
        this.forward(length);
        let end = { line: this.line, col: this.pos - this.linepos};
        return new Token(type, this.input, pos, length, start, end);
        //return [ type, pos, length, startLine, startCol, this.line, this.pos - this.linepos ];
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

    findToken() {
        let t;
        do {
            t = this.nextToken();
        } while(!t);
        return t;
    }

    nextToken() {
        let c1 = this.la(0);
        if(c1 < 128) {
            let t = this.lgMap[c1];
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

    setLexicalGoal(goal) {
        this.lgMap = goal;
    }

    newLine(n) {
        this.linetok ++;
        this.linetokpos = this.pos + n;
    }

    isEOF(c1) {
        return c1 === undefined;
    }

}

class JsgParser extends ParserCore {
        
    constructor(input) {
        super(input);
    }

    lexKnownToken(t) {
        let s1 = 1;
        let token = this.Token;
        if(t === token.LineTerminatorSequence) {
            s1 = this.lexLineTerminatorSequence(s1);
        } else if(t === token.Comment) {
            s1 = this.lexComment(s1);
        } else if(t === token.Abbreviation) {
            s1 = this.lexAbbreviation(s1);
        } else if(t === token.ProductionName) {
            s1 = this.lexProductionName(s1);
        } else if(t === token.GrammarLiteral) {
            s1 = this.lexGrammarLiteral(s1);
        } else if(t === token.ProductionLiteral) {
            s1 = this.lexProductionLiteral(s1);
        } else if(t === token.Literal) {
            s1 = this.lexLiteral(s1);
        }
        return this.acceptToken(t, s1);
    }

    lexUnknownToken(t) {
        let unknown = this.Unknown;
        if(t < unknown.GrammarLiteral$$r) {
            if(t < unknown.GrammarLiteral$$h) {
                if(t < unknown.GrammarLiteral$$b) {
                    if(t < unknown.GrammarLiteral$$a) {
                        return this.lexProductionPunctuator__3A();
                    } else {
                        return this.lexGrammarLiteral$$a();
                    }
                } else if(t < unknown.GrammarLiteral$$e) {
                        return this.lexGrammarLiteral$$b();
                } else if(t < unknown.GrammarLiteral$$g) {
                        return this.lexGrammarLiteral$$e();
                } else {
                        return this.lexGrammarLiteral$$g();
                }
            } else if(t < unknown.GrammarLiteral$$l) {
                if(t < unknown.GrammarLiteral$$i) {
                    return this.lexGrammarLiteral$$h();
                } else {
                    return this.lexGrammarLiteral$$i();
                }
            } else if(t < unknown.GrammarLiteral$$n) {
                    return this.lexGrammarLiteral$$l();
            } else if(t < unknown.GrammarLiteral$$o) {
                    return this.lexGrammarLiteral$$n();
            } else {
                    return this.lexGrammarLiteral$$o();
            }
        } else if(t < unknown.Unknown3) {
            if(t < unknown.GrammarLiteral$$u) {
                if(t < unknown.GrammarLiteral$$s) {
                    return this.lexGrammarLiteral$$r();
                } else {
                    return this.lexGrammarLiteral$$s();
                }
            } else if(t < unknown.Unknown1) {
                    return this.lexGrammarLiteral$$u();
            } else if(t < unknown.Unknown2) {
                    return this.lexUnknown1();
            } else {
                    return this.lexUnknown2();
            }
        } else if(t < unknown.Unknown5) {
            if(t < unknown.Unknown4) {
                return this.lexUnknown3();
            } else {
                return this.lexUnknown4();
            }
        } else if(t < unknown.Unknown6) {
            return this.lexUnknown5();
        } else if(t < unknown.Unknown7) {
            return this.lexUnknown6();
        } else {
            return this.lexUnknown7();
        }
    }

    // After <CR>
    lexLineTerminatorSequence(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(c1 === 0x0A) {
            return s1 + 1;
        }
        return start;
    }

    lexComment(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(c1 === 0x2A) {
            return this.lexMultiLineComment(s1 + 1);
        } else if(c1 === 0x2F) {
            return this.lexSingleLineComment(s1 + 1);
        }
        return 0;
    }

    lexProductionPunctuator__3A() {
        if(0x3A === this.la(1)) {
            return this.acceptToken(this.Token.ProductionPunctuator_3A3A, 2);
        }
        return this.acceptToken(this.Token.ProductionPunctuator_3A, 1);
    }
            
    // After /*
    lexMultiLineComment(start) {
        let s = start;
        let c = this.la(s);
        while(!Number.isNaN(c)) {
            if(c === 0x0A) {
                this.newLine(s);
            } else if(c === 0x0D) {
                if(0x0A === this.la(s+1)) {
                    s++;
                }
                this.newLine(s);
            } else if(c === 0x2A && 0x2F === this.la(s + 1)) {
                return s + 2;
            }
            s++;
            c = this.la(s)
        }
        return s;
    }

    // After //
    lexSingleLineComment(start) {
        let s = start;
        let c = this.la(s);
        while(!Number.isNaN(c)) {
            if(c === 0x0A || c === 0x0D) {
                return s;
            }
            s++;
            c = this.la(s);
        }
        return s;
    }

    // After A-Z and lookahead not AsciiSymbol
    lexProductionName(start) {
        let s = start;
        let c = this.la(s);
        if(this.isAsciiSymbol(c)) {
            return 0;
        }
        while(this.isAsciiUpperCase(c) || this.isAsciiLowerCase(c)) {
            s++;
            c = this.la(s);
        }
        return s;
    }

    lexGrammarLiteral(start) {
        let s = start;
        let c = this.la(s);
        // can these ranges be improved
        while(this.isAsciiLowerCase(c) || this.isDecimalDigit(c)) {
            c = this.la(++s);
        }
        return s;
    }
    
    lexProductionLiteral(start) {
        let s = start;
        let c = this.la(s);
        // can these ranges be improved
        while(this.isAsciiLowerCase(c) || this.isDecimalDigit(c) || this.isAsciiSymbol(c)) {
            c = this.la(++s);
        }
        return s;
    }

    lexLiteral(start) {
        let s = start;
        let c = this.la(s);
        // uppercase, lowercase, digits, symbols
        while(c >= 0x21 && c <= 0x7E) {
            c = this.la(++s);
        }
        return s;
    }

    // After <
    lexAbbreviation(start) {
        let s = start;
        let c = this.la(s);
        if(!this.isAsciiUpperCase(c)) {
            return 0;
        }
        do {
            c = this.la(++s);
        } while(this.isAsciiUpperCase(c));
        if(0x3E !== c) {
            return 0;
        }
        return s + 1;
    }

    lexAsciiUpperCase(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(this.isAsciiUpperCase(c1)) {
            return s1 + 1;
        }
        return 0;
    }

    lexAsciiLowerCase(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(this.isAsciiLowerCase(c1)) {
            return s1 + 1;
        }
        return 0;
    }

    lexAsciiSymbol(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(this.isAsciiSymbol(c1)) {
            return s1 + 1;
        }
        return 0;
    }

    isGrammarStartLookahead(c1, c2) {
        return this.isAsciiUpperCase(c1)
            || this.isAsciiLowerCase(c1)
            || (c1 === '?' || c1 === '+' || c1 === '~') && this.asAsciiUpperCase(c2);
    } 

    // After $   ArgumentNumber or GrammarLiteral
    lexUnknown1() {
        if(this.isNonZeroDecimalDigit(this.la(1))) {
            return this.acceptToken(this.Token.ArgumentNumber, 2);
        } else {
            return this.acceptToken(this.Token.GrammerLiteral, 1);
        }
    }

    // After <   GrammarLiteral or Abbreviation
    lexUnknown2() {
        if(this.isAsciiUpperCase(this.la(1))) {
            return this.acceptToken(this.Token.Abbreviation, this.lexAbbreviation(2));
        } else {
            return this.acceptToken(this.Token.GrammerLiteral, 1);
        }
    }

    // After [   GrammarStart or GrammarLiteral
    lexUnknown3() {
        if(this.isGrammarStartLookahead(this.la(1), this.la(2))) {
            return this.acceptToken(this.Token.GrammarStart, 1);
        } else {
            return this.acceptToken(this.Token.GrammarLiteral, 1);
        }
    }

    // After <   ProductionLiteral or Abbreviation
    lexUnknown4() {
        if(this.isAsciiUpperCase(this.la(1))) {
            return this.acceptToken(this.Token.Abbreviation, this.lexAbbreviation(2));
        } else {
            return this.acceptToken(this.Token.ProductionLiteral, this.lexProductionLiteral(1));
        }
    }

    // After U   ProductionName, UnicodeCharacter
    lexUnknown5() {
        if(0x2B === this.la(1)) {
            return this.acceptToken(this.Token.UnicodeCharacter, this.lexUnicodeCharacter(2));
        } else {
            return this.acceptToken(this.Token.ProductionName, this.lexProductionName(1));
        }
    }

    // After [   GrammarStart or ProductionLiteral
    lexUnknown6() {
        if(this.isGrammarStartLookahead(this.la(1), this.la(2))) {
            return this.acceptToken(this.Token.GrammarStart, 1);
        } else {
            return this.acceptToken(this.Token.ProductionLiteral, this.lexProductionLiteral(1));
        }
    }

    // After [   GrammarStart or Literal
    lexUnknown7() {
        if(this.isGrammarStartLookahead(this.la(1), this.la(2))) {
            return this.acceptToken(this.Token.GrammarStart, 1);
        } else {
            return this.acceptToken(this.Token.Literal, this.lexLiteral(1));
        }
    }

    // After U+
    lexUnicodeCharacter(start) {
        let s1 = start;
        for(let i = 0 ; i < 4 && s1 ; i++) {
            s1 = this.lexHexDigit(s1);
        }
        return s1;
    }

    lexDecimalDigit(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(this.isDecimalDigit(c1)) {
            return s1 + 1;
        }
        return 0;
    }

    isDecimalDigit(c1) {
        return c1 >= 0x30 && c1 <= 0x39;
    }

    isNonZeroDecimalDigit(c1) {
        return c1 >= 0x31 && c1 <= 0x39;
    }

    lexHexDigit(start) {
        let s1 = start;
        let c1 = this.la(s1);
        if(this.isHexDigit(c1)) {
            return s1 + 1;
        }
        return 0;
    }

    // TODO: binary search
    isHexDigit(c1) {
        if(c1 < 0x30) return false;
        if(c1 < 0x40) return true;
        if(c1 < 0x41) return false;
        if(c1 < 0x47) return true;
        if(c1 < 0x61) return false;
        if(c1 < 0x67) return true;
        return false;
    }


    isAsciiUpperCase(c1) {
        return c1 >= 0x41 && c1 <= 0x5A;
    }

    isAsciiLowerCase(c1) {
        return c1 >= 0x61 && c1 <= 0x7A;
    }

    // TODO: binary search
    isAsciiSymbol(c1) {
        return c1 >= 0x21 && c1 <= 0x2F
            || c1 >= 0x3A && c1 <= 0x40
            || c1 >= 0x5B && c1 <= 0x60
            || c1 >= 0x7B && c1 <= 0x7E;
    }

    isLineTerminator(c1) {
        return c1 === 0x0A || c1 === 0x0D;
    }

    lexNonAsciiToken(c1) {
        return this.acceptToken(this.Token.$Error, 1);
    }

    // after
    lexGrammarLiteral$$a() {
        let s = 1;
        if(0x66 === this.la(s)
                && 0x74 === this.la(++s)
                && 0x65 === this.la(++s)
                && 0x72 === this.la(++s)
                && !this.isAsciiLowerCase(this.la(++s))) {
            return this.acceptToken(this.Token.GrammarLiteral$after, s);
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // before but 
    lexGrammarLiteral$$b() {
        let s = 1;
        if(0x65 === this.la(s)) {
            if(0x66 === this.la(++s)
                    && 0x6F === this.la(++s)
                    && 0x72 === this.la(++s)
                    && 0x65 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$before, s);
            }
        } else if(0x75 === this.la(s)) {
            if(0x74 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$but, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // empty error
    lexGrammarLiteral$$e() {
        let s = 1;
        if(0x6D === this.la(s)) {
            if(0x70 === this.la(++s)
                    && 0x74 === this.la(++s)
                    && 0x79 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$empty, s);
            }
        } else if(0x72 === this.la(s)) {
            if(0x72 === this.la(++s)
                    && 0x6F === this.la(++s)
                    && 0x72 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$error, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // goal goals
    lexGrammarLiteral$$g() {
        let s = 1;
        if(0x6F === this.la(s)
                && 0x61 === this.la(++s)
                && 0x6C === this.la(++s)) {
            if(!this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$goal, s);
            } else if(0x73 === this.la(s) 
                      && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$goals, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // here
    lexGrammarLiteral$$h() {
        let s = 1;
        if(0x65 === this.la(s)
                && 0x72 === this.la(++s)
                && 0x65 === this.la(++s)
                && !this.isAsciiLowerCase(this.la(++s))) {
            return this.acceptToken(this.Token.GrammarLiteral$here, s);
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // if in indent 
    lexGrammarLiteral$$i() {
        let s = 1;
        if(0x66 === this.la(s)) {
            if(!this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$if, s);
            }
        } else if(0x6E === this.la(s)) {
            if(!this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$in, s);
            } else if(0x64 === this.la(s) 
                    && 0x65 === this.la(++s)
                    && 0x6E === this.la(++s)
                    && 0x74 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$indent, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // lexical lookahead
    lexGrammarLiteral$$l() {
        let s = 1;
        if(0x65 === this.la(s)) {
            if(0x78 === this.la(++s)
                    && 0x69 === this.la(++s)
                    && 0x63 === this.la(++s)
                    && 0x61 === this.la(++s)
                    && 0x6C === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$lexical, s);
            }
        } else if(0x6F === this.la(s)) {
            if(0x6F === this.la(++s)
                    && 0x6B === this.la(++s)
                    && 0x61 === this.la(++s)
                    && 0x68 === this.la(++s)
                    && 0x65 === this.la(++s)
                    && 0x61 === this.la(++s)
                    && 0x64 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$lookahead, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // no not
    lexGrammarLiteral$$n() {
        let s = 1;
        if(0x6F === this.la(s)) {
            if(!this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$no, s);
            } else if(0x74 === this.la(s) 
                      && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$not, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // of one opt or 
    lexGrammarLiteral$$o() {
        let s = 1;
        if(0x66 === this.la(s)) {
            if(!this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$of, s);
            }
        } else if(0x6E === this.la(s)) {
            if(0x65 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$one, s);
            }
        } else if(0x70 === this.la(s)) {
            if(0x74 === this.la(++s)
                    && !this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$opt, s);
            }
        } else if(0x72 === this.la(s)) {
            if(!this.isAsciiLowerCase(this.la(++s))) {
                return this.acceptToken(this.Token.GrammarLiteral$or, s);
            }
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // relex
    lexGrammarLiteral$$r() {
        let s = 1;
        if(0x65 === this.la(s)
                && 0x70 === this.la(++s)
                && 0x61 === this.la(++s)
                && 0x72 === this.la(++s)
                && 0x73 === this.la(++s)
                && 0x65 === this.la(++s)
                && !this.isAsciiLowerCase(this.la(++s))) {
            return this.acceptToken(this.Token.GrammarLiteral$relex, s);
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // syntactic
    lexGrammarLiteral$$s() {
        let s = 1;
        if(0x79 === this.la(s)
                && 0x6E === this.la(++s)
                && 0x74 === this.la(++s)
                && 0x61 === this.la(++s)
                && 0x63 === this.la(++s)
                && 0x74 === this.la(++s)
                && 0x69 === this.la(++s)
                && 0x63 === this.la(++s)
                && !this.isAsciiLowerCase(this.la(++s))) {
            return this.acceptToken(this.Token.GrammarLiteral$syntactic, s);
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

    // using
    lexGrammarLiteral$$u() {
        let s = 1;
        if(0x73 === this.la(s)
                && 0x69 === this.la(++s)
                && 0x6E === this.la(++s)
                && 0x67 === this.la(++s)
                && !this.isAsciiLowerCase(this.la(++s))) {
            return this.acceptToken(this.Token.GrammarLiteral$using, s);
        }
        return this.acceptToken(this.Token.GrammarLiteral, this.lexGrammarLiteral(s));
    }

}

class Token {
    constructor(type, text, pos, length, start, end) {
        this.type = type;
        this.text = text;
        this.pos =  pos;
        this.length = length;
        this.start = start;
        this.end = end;
    }
    toString() {
        return `${this.type} (${this.start.line}:${this.start.col})(${this.end.line}:${this.end.col}) ${this.text.slice(this.pos, this.pos + this.length)}`;
    }
}

(function(p) {
    p.Token = {
        $EOF: -1,
        $Error: 0,
        WhiteSpace: 1,
        LineTerminatorSequence: 2,
        Comment: 3,
        Abbreviation: 5,
        ProductionName: 6,
        GrammarStart: 8,
        GrammarLiteral: 9,
        ArgumentNumber: 10,
        UnicodeCharacter: 11,
        ProductionLiteral: 12,
        Literal: 13,
        ProductionPunctuator_3A: 14,
        ProductionPunctuator_3A3A: 15,
        GrammarLiteral: 100,
        GrammarLiteral_2B: 101,
        GrammarLiteral_2C: 102,
        GrammarLiteral_3F: 104,
        GrammarLiteral_5B: 105,
        GrammarLiteral_5D: 106,
        GrammarLiteral_7B: 107,
        GrammarLiteral_7D: 108,
        GrammarLiteral_7E: 109,
        GrammarLiteral$after: 218,
        GrammarLiteral$before: 219,
        GrammarLiteral$but: 220,
        GrammarLiteral$empty: 221,
        GrammarLiteral$error: 222,
        GrammarLiteral$goal: 223,
        GrammarLiteral$goals: 224,
        GrammarLiteral$here: 225,
        GrammarLiteral$if: 226,
        GrammarLiteral$in: 227,
        GrammarLiteral$indent: 228,
        GrammarLiteral$lexical: 229,
        GrammarLiteral$lookahead: 230,
        GrammarLiteral$no: 231,
        GrammarLiteral$not: 232,
        GrammarLiteral$of: 233,
        GrammarLiteral$one: 234,
        GrammarLiteral$opt: 235,
        GrammarLiteral$or: 236,
        GrammarLiteral$reparse: 237,
        GrammarLiteral$syntactic: 238,
        GrammarLiteral$using: 239,
        ProductionLiteral: 300,
        Literal: 400,
        $Unknown: 1000 };

    p.Unknown = {
        ProductionPunctuator__3A: 1001,
        GrammarLiteral$$a: 1005,
        GrammarLiteral$$b: 1006,
        GrammarLiteral$$e: 1007,
        GrammarLiteral$$g: 1008,
        GrammarLiteral$$h: 1009,
        GrammarLiteral$$i: 1010,
        GrammarLiteral$$l: 1011,
        GrammarLiteral$$n: 1012,
        GrammarLiteral$$o: 1013,
        GrammarLiteral$$r: 1014,
        GrammarLiteral$$s: 1015,
        GrammarLiteral$$u: 1016,
        Unknown1: 1100, // $ ArgumentNumber or GrammarLiteral
        Unknown2: 1101, // < Abbreviation or GrammarLiteral
        Unknown3: 1102, // [ GrammarStart or GrammarLiteral
        Unknown4: 1103, // < Abbreviation or ProductionLiteral
        Unknown5: 1104, // U UnicodeCharacter or ProductionName
        Unknown6: 1105, // [ GrammarStart or ProductionLiteral
        Unknown7: 1106  // [ GrammarStart or Literal
        };

    p.lgInputElementFile = [
        0, 0, 0, 0, 
        0, 0, 0, 0,
        0, p.Token.WhiteSpace, p.Token.LineTerminatorSequence, 0,
        0, -p.Token.LineTerminatorSequence, 0, 0,
        // 0x10
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        // 0x20
        p.Token.WhiteSpace, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, -p.Token.Comment,
        // 0x30
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, -p.Unknown.ProductionPunctuator__3A, 0,
        -p.Token.Abbreviation, 0, 0, 0,
        // 0x40
        0, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        // 0x50
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, p.Token.GrammarStart,
        0, 0, 0, 0,
        // 0x60
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        // 0x70
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];

    p.lgInputElementGrammar = [
        0, 0, 0, 0, 
        0, 0, 0, 0,
        0, p.Token.WhiteSpace, p.Token.LineTerminatorSequence, 0,
        0, -p.Token.LineTerminatorSequence, 0, 0,
        // 0x10
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        // 0x20
        p.Token.WhiteSpace, p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral,
        -p.Unknown.Unknown1, p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral,
        p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral_2B,
        p.Token.GrammarLiteral_2C, p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral,
        // 0x30
        -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral,
        -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral,
        -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral,
        -p.Unknown.Unknown2, p.Token.GrammarLiteral, p.Token.GrammarLiteral, p.Token.GrammarLiteral_3F,
        // 0x40
        p.Token.GrammarLiteral, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        // 0x50
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Unknown.Unknown3,
        p.Token.GrammarLiteral, p.Token.GrammarLiteral_5D, p.Token.GrammarLiteral, p.Token.GrammarLiteral,
        // 0x60
        p.Token.GrammarLiteral, -p.Unknown.GrammarLiteral$$a, -p.Unknown.GrammarLiteral$$b, -p.Token.GrammarLiteral,
        -p.Token.GrammarLiteral, -p.Unknown.GrammarLiteral$$e, -p.Token.GrammarLiteral, -p.Unknown.GrammarLiteral$$g,
        -p.Unknown.GrammarLiteral$$h, -p.Unknown.GrammarLiteral$$i, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral,
        -p.Unknown.GrammarLiteral$$l, -p.Token.GrammarLiteral, -p.Unknown.GrammarLiteral$$n, -p.Unknown.GrammarLiteral$$o,
        // 0x70
        -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, -p.Unknown.GrammarLiteral$$r, -p.Unknown.GrammarLiteral$$s,
        -p.Token.GrammarLiteral, -p.Unknown.GrammarLiteral$$u, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral,
        -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, -p.Token.GrammarLiteral, p.Token.GrammarLiteral_7B,
        p.Token.GrammarLiteral, p.Token.GrammarLiteral_7D, p.Token.GrammarLiteral_7E, 0
    ];

    p.lgInputElementProduction = [
        0, 0, 0, 0, 
        0, 0, 0, 0,
        0, p.Token.WhiteSpace, p.Token.LineTerminatorSequence, 0,
        0, -p.Token.LineTerminatorSequence, 0, 0,
        // 0x10
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        // 0x20
        p.Token.WhiteSpace, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        // 0x30
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Unknown.Unknown4, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        // 0x40
        -p.Token.ProductionLiteral, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        // 0x50
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Unknown.Unknown5, -p.Token.ProductionName, -p.Token.ProductionName,
        -p.Token.ProductionName, -p.Token.ProductionName, -p.Token.ProductionName, -p.Unknown.Unknown6,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        // 0x60
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        // 0x70
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral,
        -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, -p.Token.ProductionLiteral, 0
    ];

    p.lgInputElementLiteral = [
        0, 0, 0, 0, 
        0, 0, 0, 0,
        0, p.Token.WhiteSpace, p.Token.LineTerminatorSequence, 0,
        0, -p.Token.LineTerminatorSequence, 0, 0,
        // 0x10
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        // 0x20
        p.Token.WhiteSpace, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        // 0x30
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        // 0x40
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        // 0x50
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Unknown.Unknown7,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        // 0x60
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        // 0x70
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, -p.Token.Literal,
        -p.Token.Literal, -p.Token.Literal, -p.Token.Literal, 0
    ];
    
})(JsgParser.prototype);




let tx = `
    /*
     * Comment
     */

    <LS> ::

    Urod[

// Comment`;

tx = tx + tx + tx + tx + tx + tx + tx + tx;
tx = tx + tx + tx + tx + tx + tx + tx + tx;
tx = tx + tx + tx + tx + tx + tx + tx + tx;
tx = tx + tx + tx + tx;
tx = tx + tx + tx + tx;
console.log(tx.length);

function parse(tx, lg) {
let hrs = process.hrtime();
let p = new JsgParser(tx);

p.setLexicalGoal(lg);


let t;
//let token = p.Token;
do {
    t = p.findToken();
//    console.log(t.toString());
} while(t !== undefined && t.type !== p.Token.$Error && t.type !== p.Token.$EOF);
//} while( t != undefined && t[0] != token.$error && t[0] != token.$EOF);


let hrt = process.hrtime(hrs);
console.log("Execution time: %dms", hrt[0]*1000 + hrt[1]/1000000);

if(t === undefined || t.type === p.Token.$Error) {
//if(t === undefined || t[0] === token.$Error) {
    console.log("Error");
}
}

parse(tx, JsgParser.prototype.lgInputElementFile);
parse('lookahead not in {*, let [, PName}]', JsgParser.prototype.lgInputElementGrammar); 
parse('after before but empty error goal goals here if in indent lexical lookahead no not or opt of one reparse syntactic using', JsgParser.prototype.lgInputElementGrammar); 
parse('PName]', JsgParser.prototype.lgInputElementGrammar);
parse('?PName,UName]', JsgParser.prototype.lgInputElementGrammar);
parse('+UName]', JsgParser.prototype.lgInputElementGrammar);
parse('~UName]', JsgParser.prototype.lgInputElementGrammar);
parse('reparse [using]]', JsgParser.prototype.lgInputElementGrammar);
parse('Pname or Uname << BName [', JsgParser.prototype.lgInputElementProduction);
parse('lookahead not in [', JsgParser.prototype.lgInputElementLiteral);


