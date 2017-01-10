var interpreter = require("../interpreter.js");
var program = "one = \"fatguy\";\n\n   two = 100;\n three = (one + two);";
var inputStream = interpreter.InputStream(program);
var tokenStream = interpreter.TokenStream(inputStream);
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
    console.log(tokenStream.next());
