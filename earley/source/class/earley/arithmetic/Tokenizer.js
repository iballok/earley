qx.Class.define("earley.arithmetic.Tokenizer",
{
  extend :qx.core.Object,

  construct : function(input)
  {
    this.base(arguments);
    this.__input = input;
  },

  members :
  {
    tokenize : function()
    {
      var input = this.__input;
      var tokenStream = new earley.TokenStream(input);

      var separator_re = /([\s\(\)\+])/;

      var position = 0;
      var tokens = input.split(separator_re);
      for ( var i = 0; i < tokens.length; i++)
      {
        var tokenString = tokens[i];
        if (tokenString.length == 0) {
          continue;
        }

        if (!tokenString.match(/\s+/))
        {
          var token = new earley.Token(position, tokenString.length,
              tokenStream);
          tokenStream.addToken(token);
          this.__tag(token, tokenString);
        }

        position += tokenString.length;
      }
      return tokenStream;
    },
    
    
    __tag : function(token, tokenString)
    {
      if (/^\d+$/.test(tokenString)) {
        token.addTag(earley.arithmetic.Grammar.NUMBER);
      } else {
        token.addTag(earley.Terminal.create(tokenString));
      }
    }
  }
});