qx.Class.define("earley.test.Set",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    testCreate : function()
    {
      var terminal = earley.Terminal.create("a");
      var generation = 3;
      var set = new earley.Set(terminal, generation);
      this.assertEquals(terminal, set.getTerminal());
      this.assertEquals(generation, set.getGeneration());
    },
    
    testAddStates : function()
    {
      var A = earley.NonTerminal.create("A");
      var a = earley.Terminal.create("a");
      var rule = earley.Rule.create(A, []);
      
      var state = new earley.State(rule, 0, 0);
      var set = new earley.Set(a, 0);
      
      this.assertFalse(set.contains(state));
      set.addState(state);
      this.assertTrue(set.contains(state));
      this.assertArrayEquals([state], set.getStates());
      
      var state2 = new earley.State(rule, 0, 1);
      set.addState(state2);
      this.assertArrayEquals([state, state2].sort(), set.getStates().sort());

      set.addState(state2);
      this.assertArrayEquals([state, state2].sort(), set.getStates().sort());
    },
    
    testLookupState : function() {
      var A = earley.NonTerminal.create("A");
      var a = earley.Terminal.create("a");
      var rule = earley.Rule.create(A, []);
      
      var state1 = new earley.State(rule, 0, 0);
      var state2 = new earley.State(rule, 0, 0);
      var state3 = new earley.State(rule, 0, 1);
      var set = new earley.Set(a, 0);
      set.addState(state1);
      this.assertEquals(state1, set.lookupState(state1));
      this.assertEquals(state1, set.lookupState(state2));
      this.assertNull(set.lookupState(state3));
    },
    
    testComplete : function() 
    {
      var Rule = earley.Rule;
      var B = earley.NonTerminal.create("B");
      var A = earley.NonTerminal.create("A");
      var a = earley.Terminal.create("a");
      
      var state1 = new earley.State(Rule.create(A, [a,a,B]), 0, 2);
      var state2 = new earley.State(Rule.create(A, [a,A,B]), 0, 1);
      var state3 = new earley.State(Rule.create(A, [a,A,B]), 3, 2);
      var set = new earley.Set(a, 3);
      set.addState(state1);
      set.addState(state2);
      set.addState(state3);
      
      var completed = set.complete(A);
      this.assertEquals(1, completed.length);
      this.assertEquals("A->a A [.] B, 0", completed[0].toString());

      var completed = set.complete(B);
      this.assertEquals(2, completed.length);
      this.assertArrayEquals(
        ["A->a a B [.], 0", "A->a A B [.], 3"].sort(),
        completed.map(function(a) {return a.toString()}).sort()
      );
    },
    
    testScan : function()
    {
      var Rule = earley.Rule;
      var A = earley.NonTerminal.create("A");
      var a = earley.Terminal.create("a");
      var b = earley.Terminal.create("b");
      
      var state1 = new earley.State(Rule.create(A, [a,a,A]), 0, 0);
      var state2 = new earley.State(Rule.create(A, [a,b,A]), 0, 1);
      var state3 = new earley.State(Rule.create(A, [a,A,A]), 2, 0);
      var set = new earley.Set(a, 3);
      set.addState(state1);
      set.addState(state2);
      set.addState(state3);

      var scanned = set.scan(a);
      this.assertArrayEquals(
          ["A->a [.] a A, 0", "A->a [.] A A, 2"].sort(),
          scanned.map(function(a) {return a.toString()}).sort()
      );
      
      var scanned = set.scan(b);
      this.assertEquals(1, scanned.length);
      this.assertEquals("A->a b [.] A, 0", scanned[0].toString());
    },
    
    testContainsCompletedStateForNonTerminal : function() 
    {
      var Rule = earley.Rule;
      var S = earley.NonTerminal.create("C");
      var A = earley.NonTerminal.create("A");
      var a = earley.Terminal.create("a");
      var b = earley.Terminal.create("b");
      

      var set = new earley.Set(a, 3);
      set.addState(new earley.State(Rule.create(A, [a,a,A]), 0, 0));
      set.addState(new earley.State(Rule.create(A, [a,b,A]), 0, 1));
      set.addState(new earley.State(Rule.create(S, [a,A,A]), 2, 3));
      set.addState(new earley.State(Rule.create(S, [a,A,A]), 1, 2));
      
      this.assertTrue(set.containsCompletedStateForNonTerminal(S, 2));
      this.assertFalse(set.containsCompletedStateForNonTerminal(S, 1));
      this.assertFalse(set.containsCompletedStateForNonTerminal(A, 1));
    } 
    
  }
});