var chai = require('chai');
var expect = chai.expect;
var interpreter = require("../interpreter.js");

describe("Tokenizer", function() {
    it("should basic basic test", function() {
        var program = "one = 90;\ntwo = 100;\n three = one + two;";
        var inputStream = interpreter.InputStream(program);
        var tokenStream = interpreter.TokenStream(inputStream);
        var tokens = [];
        var goldenTokens = [
            { type: 'var', val: 'one' },
            { type: 'op', val: '=' },
            { type: 'num', val: 90 },
            { type: 'punc', val: ';' },
            { type: 'var', val: 'two' },
            { type: 'op', val: '=' },
            { type: 'num', val: 100 },
            { type: 'punc', val: ';' },
            { type: 'var', val: 'three' },
            { type: 'op', val: '=' },
            { type: 'var', val: 'one' },
            { type: 'op', val: '+' },
            { type: 'var', val: 'two' },
            { type: 'punc', val: ';' }
        ];
        while(tokenStream.peek() != null)
            tokens.push(tokenStream.next());
        expect(tokens).to.eql(goldenTokens);
    });
});

