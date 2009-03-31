qx.Class.define("earley.Rule",
{
  extend : qx.core.Object,
  
  construct : function(leftHandSide, rightHandSide)
  {
    this.base(arguments);
    
    this.__nonTerminals = {};
    this.__terminals = {};
    
    this.__setLeftHandSide(leftHandSide)
    this.__setRightHandSide(rightHandSide);
  },
  
  statics :
  {
    __instances : {},
    
    create : function(leftHandSide, rightHandSide)
    {
      var key = leftHandSide + rightHandSide.join("");
      
      if (!this.__instances[key]) {
        this.__instances[key] = new this(leftHandSide, rightHandSide);
      }      
      return this.__instances[key];
    }
  },
  
  
  members :
  {
    getLeftHandSide : function() {
      return this.__leftHandSide;
    },
    
    
    __setLeftHandSide : function(leftHandSide)
    {
      this.__leftHandSide = leftHandSide;
      this.__nonTerminals[leftHandSide.toString()] = leftHandSide;
    },

    
    getRightHandSide : function() {
      return qx.lang.Array.clone(this.__rightHandSide);
    },
    
    
    __setRightHandSide : function(rightHandSide) 
    {
      var rhs = this.__rightHandSide = qx.lang.Array.clone(rightHandSide);
      if (rhs.length == 0) {
        rhs.push(earley.Terminal.epsylon);
      }
      
      for (var i=0; i<rhs.length; i++)
      {
        var symbol = rhs[i];
        if (symbol instanceof earley.Terminal) {
          this.__terminals[symbol.toString()] = symbol;
        } else if (symbol instanceof earley.NonTerminal) {
          this.__nonTerminals[symbol.toString()] = symbol;
        } else {
          throw new Error("Unknown symbol: " + symbol);
        }
      }
    },
    
    
    getNonTerminals : function() {
      return qx.lang.Object.getValues(this.__nonTerminals);
    },
    
    
    getTerminals : function() {
      return qx.lang.Object.getValues(this.__terminals);
    },
    
    
    toString : function() {
      return this.getLeftHandSide() + "->" + this.getRightHandSide().join(" ");
    }
  },
  
  
  defer : function(statics) {
    statics.create = qx.lang.Function.bind(statics.create, statics);
  } 
});