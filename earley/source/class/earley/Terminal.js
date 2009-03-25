qx.Class.define("earley.Terminal",
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
  
  properties : {
    value : {
      check : "String",
      apply : "_applyValue"
    }
  },
  
  members : 
  {
    _applyValue : function(value, old) 
    {
      if (value.toLowerCase() != value) {
        throw new Error("Terminals must be lower case.")
      }
    },
    
    toString : function() {
      return this.getValue();
    }
  },
  
  defer : function(statics)
  {
    statics.epsylon = statics.create("<epsylon>");
    statics.create = qx.lang.Function.bind(statics.create, statics);
  }
});