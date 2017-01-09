const getStdin = require('get-stdin');

/*function getInput()
{
    var input = getStdin().then(str => {
        return str;
    });
}*/

// Some input helper functions

function InputStream(input) {
    var pos = 0;
    var line = 1;
    var col = 0;

    function peek() {
        if (pos < input.length)
            return input.charAt(pos);
        else
            return null;
    }

    function next() {
        if (pos >= input.length)
            return null;
        var nextChar = input.charAt(pos);
        pos++;
        if (nextChar == "\n") {
            line++;
            col = 0;
        } else {
            col++;
        }
        return nextChar;
    }

    function isEOF() {
        if (pos == input.length)
            return true;
        else
            return false;
    }

    function errorMessage(error) {
        //TODO
        console.log(error + "at line " + line + " and column " + col);
        console.log("Error message is currently NOT handled LOL");
    }

    return {
        peek : peek,
        next : next,
        isEOF : isEOF,
        errorMessage : errorMessage
    };
}

exports.InputStream = InputStream


//Tokenizer

function TokenStream(inputStream) {

    var curr = null; // curr is set to null in between reading tokens
    var keywords = ["if", "then", "else", "lambda", "true", "false"]
    var punc_chars = ["(", ")", ";", ",", "{", "}", "[", "]"];
    var digits = "0123456789";
    var ops = ["+", "-", "*", "/", "%", "=", "&", "|", "<", ">", "!"];

    // Helper functions for read_next

    function read_while(predicate) {
        var string = "";
        while (!inputStream.isEOF() && predicate(inputStream.peek()))
            string += inputStream.next();
        return string;
    }
    
    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }

    function is_comment(ch) {
        return ch == "#"
    }

    function is_alpha(ch) {
       if (ch.toLowerCase() != ch || ch.toUpperCase() != ch)
           return true;
       else
           return false;
    }

    function is_punc(ch) {
        if (punc_chars.indexOf(ch) >= 0)
            return true;
        else
            return false;
    }

    function is_op(ch) {
        if (ops.indexOf(ch) >= 0)
            return true;
        else
            return false;
    }

    function skip_comment() {
        read_while(function(ch) {ch != "\n";});
    }

    function get_string() {
        inputStream.next(); // skip start quote
        var retStr = read_while(function(ch) {ch != "\"";});
        inputStream.next(); // skip end quote
        return {type: "str", val: retStr};
    }

    function get_number() {
        var num = read_while(function(ch) { digits.indexOf(ch) >= 0;});
        return {type: "num", val: parseFloat(num)};
    }

    function get_identifier() {
        var id = read_while(is_alpha());
        if (keywords.indexOf(id) >= 0 )
            return {type: "keyword", val: id};
        else
            return {type: "var", val: id};
    }

    function get_punc() {
        var punc = inputStream.next();
        return {type: "punc", val: punc};
    }

    function get_op() {
        var op = inputStream.next();
        return {type: "op", val: op};
    }

    // Reads the next token in the stream, but don't advance
    function read_next() {
        var currChar = inputStream.peek();
        read_while(is_whitespace); // skip whitespace
        if (inputStream.isEOF()) // check EOF
            return null;
        else if (is_comment(currChar)) { // ignore comments
            skip_comment();
            return read_next();
        }
        else if (currChar=="\"") // capture strings 
            return get_string();
        else if (digits.indexOf(currChar) >= 0) // capture numbers
            return get_number();
        else if (is_alpha(currChar)) // capture identifiers
            return get_identifier();
        else if (is_punc(currChar)) // capture punctuation
            return get_punc();
        else if (is_op(currChar)) // capture operators
            return get_op();
        else
            inputStream.errorMessage("Invalid character");
    }

    // Advances the stream to the next token
    function next() {
        if (curr == null)
            curr = read_next();
        var retTok = curr;
        curr = null;
        return retTok;
    }
   
    // Looks at current token
    function peek() {
        if (curr == null)
            curr = read_next();
        return curr;
    }

    function isEOF() {
        return peek() == null;
    }
}
