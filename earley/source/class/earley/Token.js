qx.Class.define("earley.Token",
{
  extend :qx.core.Object,

  construct : function(position, length, tokenStream)
  {
    this.base(arguments);
    
    this.__position = position;
    this.__length = length;
    this.__tokenStream = tokenStream;
    this.__tags = {};
  },

  members : {
    
    getTokenStream : function() {
      return this.__tokenStream;
    },
    
    toString : function()
    {
      return this.__tokenStream.getTokenString(this.__position, this.__length);
    },
    
    addTag : function(tag) {
      this.__tags[tag.toHashCode()] = tag;
    },
    
    matches : function(tag) {
      return !!this.__tags[tag.toHashCode()];
    }
  }
});