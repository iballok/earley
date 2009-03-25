qx.Class.define("earley.test.State",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    setUp : function()
    {
      var A = this.A = earley.NonTerminal.create("A");
      var B = this.B = earley.NonTerminal.create("B");
      var a = this.a = earley.Terminal.create("a");
      var b = this.b = earley.Terminal.create("b");

      this.rule1 = earley.Rule.create(A, [ A, a, b ]);
      this.rule2 = earley.Rule.create(A, [ b ]);
    },

    testCreate : function()
    {
      var rule = this.rule1;
      var generation = 0;
      var dotPosition = 0;
      var state = new earley.State(rule, generation, dotPosition);

      this.assertEquals(generation, state.getGeneration());
      this.assertEquals(dotPosition, state.getDotPosition());
      this.assertEquals(rule, state.getRule());
    },
      
    testToString : function()
    {
      var Rule = earley.Rule;
      var A = this.A;
      var a = this.a;

      var state = new earley.State(Rule.create(A, [a,a,a]), 0, 0);
      this.assertEquals("A->[.] a a a, 0", state.toString());
      
      var state = new earley.State(Rule.create(A, [a,a,a]), 2, 1);
      this.assertEquals("A->a [.] a a, 2", state.toString());
      
      var state = new earley.State(Rule.create(A, [a,A,a]), 5, 3);
      this.assertEquals("A->a A a [.], 5", state.toString());
    },
    
    
    testIsSymbolAfterDot : function()
    {
      var Rule = earley.Rule;
      var A = this.A;
      var a = this.a;
      var b = this.b;
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 0);
      this.assertTrue(state.isSymbolAfterDot(a));
      this.assertFalse(state.isSymbolAfterDot(b));
      this.assertFalse(state.isSymbolAfterDot(A));

      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 2);
      this.assertFalse(state.isSymbolAfterDot(a));
      this.assertFalse(state.isSymbolAfterDot(b));
      this.assertTrue(state.isSymbolAfterDot(A));

      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 3);
      this.assertFalse(state.isSymbolAfterDot(a));
      this.assertFalse(state.isSymbolAfterDot(b));
      this.assertFalse(state.isSymbolAfterDot(A));
    },
    
    testIsNonTerminalAfterDot : function() {
      var Rule = earley.Rule;
      var A = this.A;
      var a = this.a;
      var b = this.b;
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 0);
      this.assertFalse(state.isNonTerminalAfterDot());
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 2);
      this.assertTrue(state.isNonTerminalAfterDot());
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 3);
      this.assertFalse(state.isNonTerminalAfterDot());
    },
    
    testGetSymbolAfterDot : function() {
      var Rule = earley.Rule;
      var A = this.A;
      var a = this.a;
      var b = this.b;
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 0);
      this.assertEquals(a, state.getSymbolAfterDot());
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 2);
      this.assertEquals(A, state.getSymbolAfterDot());
      
      var state = new earley.State(Rule.create(A, [a,b,A]), 0, 3);
      this.assertEquals(null, state.getSymbolAfterDot());
    },


    testConnectOneToOne : function()
    {
      var rule1 = this.rule1;
      var rule2 = this.rule2;
      var source = new earley.State(rule1, 0, 0);
      var destination = new earley.State(rule2, 0, 0);

      source.addOutgoingState(destination);
      this.assertArrayEquals( [ destination ], source.getOutgoingStates());
      this.assertArrayEquals( [ source ], destination.getIncomingStates());
    },

    testConnectOneToMany : function()
    {
      var rule1 = this.rule1;
      var source = new earley.State(rule1, 0, 0);
      var destination1 = new earley.State(rule1, 0, 0);
      var destination2 = new earley.State(rule1, 0, 0);

      source.addOutgoingState(destination1);
      source.addOutgoingState(destination2);
      this.assertArrayEquals( [ destination1, destination2 ].sort(), source
          .getOutgoingStates().sort());
      this.assertArrayEquals( [ source ], destination1.getIncomingStates());
      this.assertArrayEquals( [ source ], destination2.getIncomingStates());
    },

    testConnectManyToOne : function()
    {
      var rule1 = this.rule1;
      var source1 = new earley.State(rule1, 0, 0);
      var source2 = new earley.State(rule1, 0, 0);
      var destination = new earley.State(rule1, 0, 0);

      source1.addOutgoingState(destination);
      source2.addOutgoingState(destination);
      this.assertArrayEquals( [ destination ].sort(), source1
          .getOutgoingStates().sort());
      this.assertArrayEquals( [ destination ].sort(), source2
          .getOutgoingStates().sort());
      this.assertArrayEquals( [ source1, source2 ].sort(), destination
          .getIncomingStates().sort());
    },

    testConnectManyToMany : function()
    {
      var rule1 = this.rule1;
      var source1 = new earley.State(rule1, 0, 0);
      var source2 = new earley.State(rule1, 0, 0);
      var destination1 = new earley.State(rule1, 0, 0);
      var destination2 = new earley.State(rule1, 0, 0);

      source1.addOutgoingState(destination1);
      source1.addOutgoingState(destination2);
      source2.addOutgoingState(destination1);
      source2.addOutgoingState(destination2);

      this.assertArrayEquals( [ destination1, destination2 ].sort(), source1
          .getOutgoingStates().sort());
      this.assertArrayEquals( [ destination1, destination2 ].sort(), source2
          .getOutgoingStates().sort());
      this.assertArrayEquals( [ source1, source2 ].sort(), destination1
          .getIncomingStates().sort());
      this.assertArrayEquals( [ source1, source2 ].sort(), destination2
          .getIncomingStates().sort());
    },

    testDotPosition : function()
    {
      var A = earley.NonTerminal.create("A");
      var B = earley.NonTerminal.create("B");
      var a = earley.Terminal.create("a");
      var b = earley.Terminal.create("b");

      var state = new earley.State(earley.Rule.create(A, []), 0, 1);
      this.assertTrue(state.isComplete());
      
      this.assertException(function(){
        state.advanceDot();
      });
      
      var newGeneration = 3;
      var state = new earley.State(earley.Rule.create(A, [a]), 0, 0);
      var next = state.advanceDot();
      this.assertEquals(0, next.getGeneration());
      this.assertEquals(1, next.getDotPosition());
      this.assertTrue(next.isComplete());
    }
  }
});