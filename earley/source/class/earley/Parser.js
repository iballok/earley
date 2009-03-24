qx.Class.define("earley.Parser",
{
  extend :qx.core.Object,

  construct : function(grammar, input)
  {
    this.base(arguments);
    this.__grammar = grammar;
    this.__sets = [];
    this.__input = input;
  },

  members :
  {
    getGrammar : function()
    {
      return this.__grammar;
    },

    predict : function(nonTerminal, generation)
    {
      var predictions = [];
      var rules = this.__grammar.getRules();
      for ( var i = 0; i < rules.length; i++)
      {
        var rule = rules[i];
        var lhs = rule.getLeftHandSide();
        if (lhs == nonTerminal)
        {
          predictions.push(new earley.State(rule, generation, 0));
        }
      }
      return predictions;
    },

    
    accept : function()
    {
      this.__sets[0] = this._createInitialSet();
      
      for (var i = 0; i< input.length; i++) 
      {
        var symbol = input[i];
        var generation = i+1;
        var set = this.__sets[generation] = new earley.Set(symbol, generation);
        this._scan(set);
        this._completeAndPredict(set);
      }
      
      var lastSet = this.__sets[this.__sets.length-1]
      return lastSet.containsAcceptorState();
    },
    
    _createInitialSet : function()
    {
      var initialSet = new earley.Set(earley.Terminal.epsylon, 0);
      initialSet.add(new earley.State(grammar.getRuleForStartSymbol()), 0);
      this._completeAndPredict(initialSet);
      return initialSet;
    },
    
    _completeAndPredict : function(set)
    {
      // TODO
    },
    
    _scan : function(set)
    {
      // TODO
    }
});