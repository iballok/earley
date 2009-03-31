qx.Class.define("earley.test.StateStack",
{
  extend :qx.dev.unit.TestCase,

  members :
  {
    testEmptyStack : function() 
    {
      var S = earley.NonTerminal.create("S");
      var E = earley.NonTerminal.create("E");
      var a = earley.Terminal.create("a");
      var plus = earley.Terminal.create("+");
    
      var Rule = earley.Rule.create;
      
      var state = new earley.State(Rule(S, [E]), 0, 1);
      var stack = new earley.StateStack(state);
      this.assertEquals(state, stack.getLastProcessedState());
      
      this.assertException(function() {
        stack.getDerivation();
      });
      
      var state = new earley.State(Rule(S, [E]), 0, 0);
      stack.processState(state);
      this.assertEquals(
        [Rule(S, [E])].join(),
        stack._getDerivation().join()
      );
      this.assertEquals(state, stack.getLastProcessedState());
      
      // stack is empty
      this.assertException(function() {
        stack.processState(state);
      });
      this.assertFalse(stack.isNextPossibleState(state));
    },
    

    testConstructFail : function() 
    {
      this.assertException(function() {
        new earley.StateStack();
      });
    },
    
    
    testClone : function()
    {
      var S = earley.NonTerminal.create("S");
      var E = earley.NonTerminal.create("E");
      var a = earley.Terminal.create("a");
      var plus = earley.Terminal.create("+");
    
      var Rule = earley.Rule.create;
      
      var state = new earley.State(Rule(S, [E]), 0, 1);
      
      var stack = new earley.StateStack(state);
      var clone = stack.clone();
      
      this.assertNotIdentical(stack._getStack(), clone._getStack());
      this.assertArrayEquals(stack._getStack(), clone._getStack());

      this.assertNotIdentical(stack._getDerivation(), clone._getDerivation());
      this.assertArrayEquals(stack._getDerivation(), clone._getDerivation());

      this.assertEquals(stack.getLastProcessedState(), clone.getLastProcessedState());
    },
    
    
    testAdvanced : function() 
    {
      
      var S = earley.NonTerminal.create("S");
      var E = earley.NonTerminal.create("E");
      var a = earley.Terminal.create("a");
      var plus = earley.Terminal.create("+");

      var Rule = earley.Rule.create;
      
      var state = new earley.State(Rule(S, [E]), 0, 1);
      var stack = new earley.StateStack(state);
      this.assertEquals(
        [Rule(S, [E])].join(),
        stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [E, plus, E]), 0, 3);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
            Rule(S, [E]),
            Rule(E, [E, plus, E])
          ].join(),
          stack._getDerivation().join()
      );
      
      var state = new earley.State(Rule(E, [E, plus, E]), 2, 3);
      this.assertTrue(stack.isNextPossibleState(state));      

      var state = new earley.State(Rule(E, [a]), 4, 1);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );
      
      var state = new earley.State(Rule(E, [a]), 4, 0);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );
      
      var state = new earley.State(Rule(E, [E, plus, E]), 4, 0);
      this.assertFalse(stack.isNextPossibleState(state));      

      var state = new earley.State(Rule(E, [E, plus, E]), 2, 2);
      this.assertFalse(stack.isNextPossibleState(state));      
      
      var state = new earley.State(Rule(E, [E, plus, E]), 0, 2);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
        [
         Rule(S, [E]),
         Rule(E, [E, plus, E]),
         Rule(E, [a])
         ].join(),
         stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [E, plus, E]), 0, 1);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [E, plus, E]), 0, 3);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [a]), 2, 1);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [a]), 2, 0);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [E, plus, E]), 2, 0);
      this.assertFalse(stack.isNextPossibleState(state));      
      
      var state = new earley.State(Rule(E, [E, plus, E]), 0, 2);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [E, plus, E]), 0, 1);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );
      
      var state = new earley.State(Rule(E, [a]), 0, 1);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [a]), 0, 0);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );

      var state = new earley.State(Rule(E, [E, plus, E]), 0, 0);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );
      
      var state = new earley.State(Rule(E, [E, plus, E]), 0, 0);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );
      this.assertFalse(stack.isDerivationComplete());
      
      var state = new earley.State(Rule(S, [E]), 0, 0);
      this.assertTrue(stack.isNextPossibleState(state));
      stack.processState(state);
      this.assertEquals(
          [
           Rule(S, [E]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [E, plus, E]),
           Rule(E, [a]),
           Rule(E, [a])
           ].join(),
           stack._getDerivation().join()
      );
      
      this.assertTrue(stack.isDerivationComplete());
      
      this.assertEquals(
      [
       Rule(S, [E]),
       Rule(E, [E, plus, E]),
       Rule(E, [a]),
       Rule(E, [E, plus, E]),
       Rule(E, [a]),
       Rule(E, [a])
       ].join(),
       stack.getDerivation().join()
      );      
    }
  }
});