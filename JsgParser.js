
class JsgParser extends ParserCore {

    constructor(input) {
        super(input);
        createLookups();
    }

    lexKnownToken(t) {
        let s1 = 1;
        if(t === this.Token.LineTerminatorSequence) {
            s1 = this.lexLineTerminatorSequence(s1);
        } else if(t === this.Token.Comment) {
            s1 = this.lexComment(s1);
        } else if(t === this.Token.Abbreviation) {
            s1 = this.lexAbbreviation(s1);
        } else if(t === this.Token.ProductionName) {
            s1 = this.lexProductionName(s1);
        } else if(t === this.Token.GrammarLiteral) {
            s1 = this.lexGrammarLiteral(s1);
        } else if(t === this.Token.ProductionLiteral) {
            s1 = this.lexProductionLiteral(s1);
        } else if(t === this.Token.Literal) {
            s1 = this.lexLiteral(s1);
        }
        return this.acceptToken(t, s1);
    }

    lexUnknownToken(t) {
        if(t < this.Unknown.GrammarLiteral$$r) {
            if(t < this.Unknown.GrammarLiteral$$h) {
                if(t < this.Unknown.GrammarLiteral$$b) {
                    if(t < this.Unknown.GrammarLiteral$$a) {
                        return this.lexProductionPunctuator__3A();
                    } else {
                        return this.lexGrammarLiteral$$a();
                    }
                } else if(t < this.Unknown.GrammarLiteral$$e) {
                    return this.lexGrammarLiteral$$b();
                } else if(t < this.Unknown.GrammarLiteral$$g) {
                    return this.lexGrammarLiteral$$e();
                } else {
                    return this.lexGrammarLiteral$$g();
                }
            } else if(t < this.Unknown.GrammarLiteral$$l) {
                if(t < this.Unknown.GrammarLiteral$$i) {
                    return this.lexGrammarLiteral$$h();
                } else {
                    return this.lexGrammarLiteral$$i();
                }
            } else if(t < this.Unknown.GrammarLiteral$$n) {
                return this.lexGrammarLiteral$$l();
            } else if(t < this.Unknown.GrammarLiteral$$o) {
                return this.lexGrammarLiteral$$n();
            } else {
                return this.lexGrammarLiteral$$o();
            }
        } else if(t < this.Unknown.Unknown3) {
            if(t < this.Unknown.GrammarLiteral$$u) {
                if(t < this.Unknown.GrammarLiteral$$s) {
                    return this.lexGrammarLiteral$$r();
                } else {
                    return this.lexGrammarLiteral$$s();
                }
            } else if(t < this.Unknown.Unknown1) {
                return this.lexGrammarLiteral$$u();
            } else if(t < this.Unknown.Unknown2) {
                return this.lexUnknown1();
            } else {
                return this.lexUnknown2();
            }
        } else if(t < this.Unknown.Unknown5) {
            if(t < this.Unknown.Unknown4) {
                return this.lexUnknown3();
            } else {
                return this.lexUnknown4();
            }
        } else if(t < this.Unknown.Unknown6) {
            return this.lexUnknown5();
        } else if(t < this.Unknown.Unknown7) {
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

    parse() {
        return this.parseJsgFile();
    }

    parseJsgFile() {
        this.setMap(this.Map.InputElementFile);
        return this.parseDefinitions();
    }

    parseDefinitions() {
        let r = [];
        let d = this.parseDefinition();
        while(d) {
            r.push(d);
            d = this.parseDefinition();
        }
        return this.ast.addDefinitions(r);
    }

    parseDefinition() {
        let r;
        let token = this.findToken();
        let t = token.type;
        if(t === this.Token.GrammarStart) {
            this.setMap(this.Map.InputElementGrammar);
            r = this.parseSpecialInstruction(token);
            this.setMap(this.Map.InputElementFile);
        } else if(t === this.Token.Abbreviation) {
            r = this.parseAbbreviationDefinition(token);
        } else if(t === this.Token.ProductionName) {
            r = this.parseProductionDefinition(token);
        } else if(t === this.Token.EOF) {
            r = null;
        } else {
            this.unexpectedToken(token);
        }
        return r;
    }

    parseSpecialInstruction(token) {
        let r = [token];
        r.push[this.parseCoreSpecialInstruction];
        r.push[this.findTokenType(this.Token.GrammarLiteral_5D)];
        return this.ast.SpecialInstruction(r);
    }

    parseCoreSpecialInstruction() {
        let r;
        let token = this.findToken();
        let t = token.type;
        if(t === this.Token.GrammarLiteral$empty) {
            r = this.parseEmptyProduction(token);
        } else if(t === this.Token.GrammarLiteral$lookahead) {
            r = this.parseLookaheadRestriction(token);
        } else if(t === this.Token.GrammarLiteral$but) {
            r = this.parseButNotRestriction(token);
        } else if(t === this.Token.GrammarLiteral$no) {
            r = this.parseProductionRestriction(token);
        } else if(t === this.Token.GrammarLiteral$lexical
            || t === this.Token.GrammarLiteral$syntactic
                || t === this.Token.GrammarLiteral$if) {
                    r = this.parseGoalProduction(token);
                } else if(t === this.Token.GrammarLiteral$after
                    || t === this.Token.GrammarLiteral$before
                        || t === this.Token.GrammarLiteral$indent) {
                            r = this.parseLocationInstruction(token);
                        } else if(t === this.Token.GrammarLiteral$reparse) {
                            r = this.parseReparseInstruction(token);
                        } else {
                            this.unexpectedToken(token);
                        }
                        return r;
    }

    parseEmptyProduction(token) {
        let r = [token];
        return this.ast.addEmptyProduction(r);
    }

    parseLookaheadRestriction(token) {
        let r = [token];
        r.push(this.parse$Token(this.Token.GrammarLiteral$not));
        token = this.findToken();
        r.push(token);
        if(token.type === this.Token.GrammarLiteral$in) {
            token = this.findToken();
            if(token.type === this.Token.GrammarLiteral_7B) {
                r.push(token);
                r.push(this.parseRestrictedItemList());
                r.push(this.findTokenType(this.Token.GrammarLiteral_7D));
            } else if(token.type === this.Token.ProductionName) {
                r.push(token);
            } else {
                this.unexpectedToken(token);
            }
        }
        return this.ast.addLookaheadRestriction(r);
    }

    parseRestrictedItemList() {
        let r = [];
        let d = this.parseRestrictedItem();
        while(d) {
            r.push(d);
            if(this.peekTokenType(this.Token.GrammarLiteral_2C)) {
                r.push(this.peekedToken());
                d = this.parseRestrictedItem();
            } else {
                d = null;
            }
        }
        return this.ast.addRestrictedItemList(r);
    }



    createLookups() {

        this.Token = {
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
            $Unknown: 1000
        };

        this.Unknown = {
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

        this.Map = {
            InputElementFile: [
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
            ],

            InputElementGrammar: [
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
            ],

            InputElementProduction: [
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
            ],

            InputElementLiteral: [
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
            ]
        };

    }
