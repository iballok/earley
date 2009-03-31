qx.Class.define("earley.StateStack",
{
  extend : qx.core.Object,

  construct : function(acceptingState)
  {
    this.base(arguments);
    
    if (acceptingState)
    {
      this.__stack = [acceptingState];
      this.__derivation = [acceptingState.getRule()];
      this.__lastProcessedState = acceptingState;
    } 
    else
    {
      if (!this.constructor.$$clone) {
        throw new qx.core.AssertionError("Argument 'acceptingState' required!");
      }
    }
  },
  
  
  members :
  {
    isNextPossibleState : function(state) 
    {
      if (this.__stack.length == 0) {
        return false;
      }
      
      var top = this.__stack[this.__stack.length-1];
      
      return (
        state.isComplete() ||
        state.isDotAdvanced(top)
      );
    },
    
    getLastProcessedState : function () {
      return this.__lastProcessedState;
    },
    
    
    processState : function(state)
    {
      if (!this.isNextPossibleState(state)) {
        throw new qx.core.AssertionError("State is no possible next state!");
      }
      this.__lastProcessedState = state;
      
      if (state.isComplete()) 
      {
        this.__stack.push(state);
        this.__derivation.push(state.getRule());
      }
      else
      {
        var top = this.__stack.pop();
        if (state.getDotPosition() != 0) {
          this.__stack.push(state);
        }
      }
    },
    
    
    _getDerivation : function() {
      return this.__derivation;
    },
    
    
    _getStack : function() {
      return this.__stack;
    },
    
    
    clone : function() 
    {
      var clazz = this.constructor;
      
      clazz.$$clone = true;
      var clone = new clazz();
      delete clazz.$$clone;
      
      clone.__derivation = qx.lang.Array.clone(this.__derivation);
      clone.__stack = qx.lang.Array.clone(this.__stack);
      clone.__lastProcessedState = this.__lastProcessedState;
      return clone;
    },
    
    isDerivationComplete : function() {
      return this.__stack.length == 0;
    },

    
    getDerivation : function() 
    {
      if (!this.isDerivationComplete()) {
        throw new qx.core.AssertionError("State stack is in intermediate state.");
      }
      return this._getDerivation();
    }
  }
});