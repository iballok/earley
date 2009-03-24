qx.Class.define("earley.test.Grammar",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    testTerminal : function()
    {
      var terminal = earley.Terminal.create("a");
      this.assertEquals("a", terminal.getValue());
      this.assertEquals("a", terminal.toString());
      
      this.assertEquals(terminal, earley.Terminal.create("a"));

      this.assertException(function() {
        earley.Terminal.create("A");
      });
    },
    
    
    testEpsylon : function() 
    {
      this.assertEquals("<epsylon>", earley.Terminal.epsylon.toString());
    },
    
    
    testNonTerminal : function()
    {
      var nt = earley.NonTerminal.create("A");
      this.assertEquals("A", nt.getValue());
      this.assertEquals("A", nt.toString());
      
      this.assertEquals(nt, earley.NonTerminal.create("A"));
            
      this.assertException(function() {
        earley.NonTerminal.create("a");
      });
    },
    
    
    testRule : function()
    {
      var A = earley.NonTerminal.create("A");
      var B = earley.NonTerminal.create("B");
      var a = earley.Terminal.create("a");
      var b = earley.Terminal.create("b");
      
      var rule = earley.Rule.create(A, []);
      this.assertEquals("A-><epsylon>", rule.toString());
      this.assertArrayEquals([A], rule.getNonTerminals());
      this.assertArrayEquals([earley.Terminal.epsylon], rule.getTerminals());

      var rule = earley.Rule.create(A, [A, a, A, B, b]);
      this.assertEquals("A->A a A B b", rule.toString());
      this.assertArrayEquals([A, B].sort(), rule.getNonTerminals().sort());
      this.assertArrayEquals([a, b].sort(), rule.getTerminals().sort());
    
      var rule = earley.Rule.create(A, [A]);
      this.assertEquals("A->A", rule.toString());
      this.assertArrayEquals([A], rule.getNonTerminals());
      this.assertArrayEquals([], rule.getTerminals());

      var rule = earley.Rule.create(A, [a]);
      this.assertEquals("A->a", rule.toString());
      this.assertArrayEquals([A], rule.getNonTerminals());
      this.assertArrayEquals([a], rule.getTerminals());
    },
    
    
    testGrammar : function()
    {
      var S = earley.NonTerminal.create("S");
      
      var E = earley.NonTerminal.create("E");
      var plus = earley.Terminal.create("+");
      var a = earley.Terminal.create("a");
      
      var grammar = new earley.Grammar(S);
      grammar.addRule(earley.Rule.create(S, [E]));
      grammar.addRule(earley.Rule.create(E, [E, plus, E]));
      grammar.addRule(earley.Rule.create(E, [a]));
      
      this.assertEquals(S, grammar.getStartSymbol());
      
      this.assertArrayEquals( [ "S->E","E->E + E", "E->a" ].sort(),
          grammar.getRules().map( function(a)
          {
            return a + ""
          }).sort());
      
      this.assertEquals(
        "S->E", grammar.getRulesForNonTerminal(S).join(", ")
      );
      this.assertEquals(
        ["E->a", "E->E + E"].sort().join(", "), grammar.getRulesForNonTerminal(E).sort().join(", ")
      );
      this.assertArrayEquals(
        [S, E].sort(), grammar.getNonTerminals().sort()
      );
      this.assertArrayEquals(
        [a, plus].sort(), grammar.getTerminals().sort()
      );
    },
    
    testStartSymbolRule : function() {
      var S = earley.NonTerminal.create("S");
      
      var E = earley.NonTerminal.create("E");
      var plus = earley.Terminal.create("+");
      var a = earley.Terminal.create("a");
      
      var grammar = new earley.Grammar(S);
      grammar.addRule(earley.Rule.create(S, [E]));
      grammar.addRule(earley.Rule.create(E, [E, plus, E]));
      grammar.addRule(earley.Rule.create(E, [a]));

      rule = grammar.getRuleForStartSymbol();
      this.assertEquals("S->E", rule.toString());
      
      this.assertException(function(){
        grammar.addRule(earlay.Rule.create(S, [E, E]));
      });
    }
  }
});
