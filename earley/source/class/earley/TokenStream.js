qx.Class.define("earley.TokenStream",
{
  extend :qx.core.Object,

  construct : function(input)
  {
    this.base(arguments);

    this.__input = input;
    this.__tokens = [];
    this.__currentTokenIndex = -1;
  },

  members :
  {
    getInput : function()
    {
      return this.__input;
    },
    
    getTokenString : function(position, length) {
      return this.__input.substr(position, length);
    },
    
    
    addToken : function(token) {
      this.__tokens.push(token);
    },
    
    
    hasNext : function() {
      return this.__currentTokenIndex < this.__tokens.length-1;
    },
    
    
    next : function() {
      return this.__tokens[++this.__currentTokenIndex];
    }
  }
});