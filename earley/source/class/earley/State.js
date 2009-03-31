qx.Class.define("earley.State",
{
  extend : qx.core.Object,
  
  construct : function(rule, generation, dotPosition)
  {
    this.base(arguments);
    
    this.__rule = rule;
    this.__generation = generation;
    this.__dotPosition = dotPosition;
    
    this.__incomingStates = {};
    this.__outgoingStates = {};
  },

  members :
  {
    getRule : function() {
      return this.__rule;
    },
    
    
    getGeneration : function() {
      return this.__generation;
    },
    
    
    getDotPosition : function() {
      return this.__dotPosition;
    },

    
    addOutgoingState : function(state)
    {
      this.__outgoingStates[state.toHashCode()] = state;
      state.__incomingStates[this.toHashCode()] = this;
    },
    
    
    getOutgoingStates : function() {
      return qx.lang.Object.getValues(this.__outgoingStates);
    },
    
    
    getIncomingStates : function() {
      return qx.lang.Object.getValues(this.__incomingStates);
    },
    
    
    isComplete : function() {
      return this.__rule.getRightHandSide().length == this.__dotPosition;
    },
    
    
    advanceDot : function ()
    {
      if (this.isComplete()) {
        throw new Error("State is already complete");
      }
      return new earley.State(this.__rule, this.__generation, this.__dotPosition+1);
    },
    
     
    isDotAdvanced : function(state)
    {
      return (
        this.__rule == state.__rule &&
        this.__generation == state.__generation &&
        this.__dotPosition + 1 == state.__dotPosition
      );
    },
    
    
    isSymbolAfterDot : function(symbol) {
      return this.__rule.getRightHandSide()[this.__dotPosition] == symbol;
    },
    
    
    getSymbolAfterDot : function() {
      return this.__rule.getRightHandSide()[this.__dotPosition] || null;
    },

    
    isNonTerminalAfterDot : function() {
      return this.getSymbolAfterDot() instanceof earley.NonTerminal;
    },
    
    
    toString : function()
    {
      var rule = this.__rule;
      var rhs = qx.lang.Array.clone(rule.getRightHandSide());
      qx.lang.Array.insertAt(rhs, "[.]", this.__dotPosition);
      return rule.getLeftHandSide() + "->" + rhs.join(" ") + ", " + this.__generation;
    }
  }
});