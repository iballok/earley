qx.Class.define("earley.NonTerminal",
{
  extend : qx.core.Object,
  
  statics :
  {
    __instances : {},
    
    create : function(value)
    {
      if (!this.__instances[value]) {
        this.__instances[value] = new this().set({value: value});
      }
      return this.__instances[value];
    }
  },
  
  
  properties :
  {
    value :
    {
      check : "String",
      apply : "_applyValue"
    }
  },
  
  
  members : 
  {
    _applyValue : function(value, old) 
    {
      if (value.toUpperCase() != value) {
        throw new Error("Non terminals must be upper case.")
      }
    },
    
    
    toString : function() {
      return this.getValue();
    }
  },
  
  
  defer : function(statics) {
    statics.create = qx.lang.Function.bind(statics.create, statics);
  }  
});