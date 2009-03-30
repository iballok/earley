qx.Class.define("earley.Set",
{
  extend :qx.core.Object,

  construct : function(terminal, generation)
  {
    this.base(arguments);

    this.__terminal = terminal;
    this.__generation = generation;
    this.__states = {};
  },

  
  members :
  {
    getTerminal : function() {
      return this.__terminal;
    },

    
    getGeneration : function() {
      return this.__generation;
    },

    
    addState : function(state) {
      this.__states[state.toString()] = state;
    },

    
    getStates : function() {
      return qx.lang.Object.getValues(this.__states);
    },
    
    
    lookupState : function (state) {
      return this.__states[state.toString()] || null;
    },
    
    
    contains : function(state) {
      return !!this.__states[state.toString()];
    },
    
    complete : function(nonTerminal)
    {
      var completed = [];
      for (var key in this.__states)
      {
        var state = this.__states[key];
        if(state.isSymbolAfterDot(nonTerminal)) {
          completed.push(state.advanceDot());
        }
      }
      return completed;
    },
    
    
    scan : function(terminal)
    {
      var scanned = [];
      for (var key in this.__states)
      {
        var state = this.__states[key];
        if(state.isSymbolAfterDot(terminal)) {
          scanned.push(state.advanceDot(state.getGeneration()));
        }
      }
      return scanned;
    },
    
    
    containsCompletedStateForNonTerminal : function(nonTerminal, generation)
    {
      for (var key in this.__states)
      {
        var state = this.__states[key];
        
        var isCompleted = 
          state.getGeneration() == generation &&
          state.getRule().getLeftHandSide() == nonTerminal &&
          state.isComplete();
        
        if (isCompleted) {
          return true;
        }
      }
      return false;
    }
  }
});