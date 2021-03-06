qx.Class.define("earley.Parser",
{
  extend : qx.core.Object,

  construct : function(grammar, input)
  {
    this.base(arguments);
    this.__grammar = grammar;
    this.__input = input;

    this.__sets = [];
  },

  
  members :
  {
    getGrammar : function() {
      return this.__grammar;
    },
    
    
    addSet : function(set) {
      this.__sets[set.getGeneration()] = set;
    },
    
    
    getSetForGeneration : function(generation) {
      return this.__sets[generation]; 
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

    
    parse : function()
    {
      // walk states starting with accepting state
      // depth first tree search
      // maintain stack of visited states
      // StateStack
      // -> Process state
      // -> Derivation
      if (!this.accept()) {
        return [];
      }
      
      var sets = this.__sets;
      var lastSet = sets[sets.length-1];
      
      var completedStates = [];
      var lastStates = lastSet.getStates();
      var metaStack = [];
      for (var i=0; i<lastStates.length; i++) {
        var lastState = lastStates[i];
        if (
            lastState.getGeneration() == 0 &&
            lastState.getRule().getLeftHandSide() == this.__grammar.getStartSymbol() &&
            lastState.isComplete()
        ) {
          metaStack.push(new earley.StateStack(lastState));
        }
      }
      
      var derivations = [];
      
      while(metaStack.length) {
        var stateStack = metaStack.pop();
        while (!stateStack.isDerivationComplete()) {
          var state = stateStack.getLastProcessedState();
          var incomingStates = state.getIncomingStates();
          var nextPossibleStates = [];
          for (var i=0; i < incomingStates.length; i++) {
            var incomingState = incomingStates[i];
            if (stateStack.isNextPossibleState(incomingState)) {
              nextPossibleStates.push(incomingState);
            }
          }
          while (nextPossibleStates.length > 1) {
            var nextPossibleState = nextPossibleStates.pop();
            var newStateStack = stateStack.clone();
            newStateStack.processState(nextPossibleState);
            metaStack.push(newStateStack);
          }
          stateStack.processState(nextPossibleStates.pop());
        }
        derivations.push(stateStack.getDerivation());
      }
      return derivations;
    },
    
    
    accept : function()
    {
      this.addSet(this._createInitialSet());
      
      var input = this.__input;
      for (var i = 0; i< input.length; i++) 
      {
        var symbol = input[i];
        var generation = i+1;
        
        var set = new earley.Set(symbol, generation);
        this.addSet(set);
        
        this._scan(set, symbol);
        this._completeAndPredict(set);
      }
      
      var lastSet = this.__sets[this.__sets.length-1];
      var startSymbol = this.__grammar.getStartSymbol();
      var isAccepted = lastSet.containsCompletedStateForNonTerminal(startSymbol, 0);
      return isAccepted;
    },
    
    
    _scan : function(set, symbol)
    {
      var previousSet = this.getSetForGeneration(set.getGeneration() - 1);
      var states = previousSet.getStates();
      
      for (var i=0; i<states.length; i++) {
        var state = states[i];
        if (state.getSymbolAfterDot() == symbol) 
        {
          var newState = state.advanceDot();
          set.addState(newState);
          state.addOutgoingState(newState);
        }
      }
    },

    
    _createInitialSet : function()
    {
      var initialSet = new earley.Set(earley.Terminal.epsylon, 0);
      initialSet.addState(new earley.State(this.__grammar.getRuleForStartSymbol(), 0, 0));
      this._completeAndPredict(initialSet);
      return initialSet;
    },
    
    
    _completeAndPredict : function(set)
    {
      var generation = set.getGeneration();
      
      var workQueue = set.getStates();
      while(workQueue.length) 
      {
        var state = workQueue.pop();
        /*complete*/
        var completed = [];
        if (state.isComplete()) 
        {
          var g = state.getGeneration();
          var nt = state.getRule().getLeftHandSide();
          var birthSet = this.getSetForGeneration(g);
          completed = birthSet.complete(nt,generation);
        }
        /*predict*/
        var predicted = [];
        if(state.isNonTerminalAfterDot()) {
          var nt = state.getSymbolAfterDot();
          predicted = this.predict(nt, generation);
        }
        /*processed*/
        set.addState(state);
        /*merge*/
        var newStates = qx.lang.Array.append(predicted, completed);
        for(var i=0; i<newStates.length;i++)
        {
          var newState = newStates[i];
          if(set.contains(newState)) {
            newState = set.lookupState(newState);
          } else {
            workQueue.push(newState);
          }
          state.addOutgoingState(newState);
        }
      }
    }
  }
});