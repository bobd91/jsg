
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

