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
    getTerminal : function()
    {
      return this.__terminal;
    },

    getGeneration : function()
    {
      return this.__generation;
    },

    addState : function(state)
    {
      this.__states[state.toHashCode()] = state;
    },

    getStates : function()
    {
      return qx.lang.Object.getValues(this.__states);
    },
    
    complete : function(nonTerminal, generation)
    {
      var completed = [];
      for (var key in this.__states)
      {
        var state = this.__states[key];
        if(state.isSymbolAfterDot(nonTerminal)) {
          completed.push(state.advanceDot(generation));
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
    }
  }
});