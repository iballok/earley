qx.Class.define("earley.test.Parser",
{
  extend :qx.dev.unit.TestCase,

  members :
  {
    setUp : function()
    {
      var S = this.S = earley.NonTerminal.create("S");

      var E = this.E = earley.NonTerminal.create("E");
      var plus = this.plus = earley.Terminal.create("+");
      var a = this.a = earley.Terminal.create("a");

      var Rule = earley.Rule;
      var grammar = this.grammar = new earley.Grammar(S);
      grammar.addRule(Rule.create(S, [ E ]));
      grammar.addRule(Rule.create(E, [ E, plus, E ]));
      grammar.addRule(Rule.create(E, [ a ]));
    },

    
    getArithmeticGrammar : function() 
    {
      var NT = earley.NonTerminal.create;
      var Terminal = earley.Terminal.create;
      var R = earley.Rule.create;
      
      var S = NT("S");

      var E = NT("E");
      var T = NT("T");
      var F = NT("F");
      var plus = Terminal("+");
      var mult = Terminal("*");
      var lparen = Terminal("(");
      var rparen = Terminal(")");
      var a = Terminal("a");

      var grammar = new earley.Grammar(S);
      grammar.addRule(R(S, [ E ]));
      grammar.addRule(R(E, [ T, plus, E ]));
      grammar.addRule(R(E, [ T ]));
      grammar.addRule(R(T, [ F, mult, T ]));
      grammar.addRule(R(T, [ F ]));
      grammar.addRule(R(F, [ lparen, E, rparen ]));
      grammar.addRule(R(F, [ a ]));
      
      return grammar;
    },
    
    
    testCreate : function()
    {
      var parser = new earley.Parser(this.grammar);
      this.assertEquals(this.grammar, parser.getGrammar());
    },

    _testPredict : function()
    {
      var parser = new earley.Parser(this.grammar);
      var S = this.S;
      var E = this.E;
      var generation = 5;
      var predictions = parser.predict(S, generation);
      this.assertEquals(1, predictions.length);
      this.assertEquals("S->[.] E, 5", predictions[0].toString());

      var predictions = parser.predict(E, generation);
      this.assertArrayEquals( [ "E->[.] E + E, 5", "E->[.] a, 5" ].sort(),
          predictions.map( function(a)
          {
            return a + ""
          }).sort());
    },
    
    
    testAccept : function() 
    {
      var a = this.a;
      var plus = this.plus;
      
      var input = [a, plus, a];
      var parser = new earley.Parser(this.grammar, input);
      this.assertTrue(parser.accept());

      var input = [a, plus, a, plus, a];
      var parser = new earley.Parser(this.grammar, input);
      this.assertTrue(parser.accept());

      var input = [a, plus];
      var parser = new earley.Parser(this.grammar, input);
      this.assertFalse(parser.accept());
    },
    

    testCreateInitialSet : function()
    {
      var parser = new earley.Parser(this.grammar, []);
      var set = parser._createInitialSet();
      
      this.assertEquals(
        ["S->[.] E, 0", "E->[.] E + E, 0", "E->[.] a, 0" ].sort().join("; "),
        set.getStates().map( function(a)
        {
          return a + ""
        }).sort().join("; ")
      );
    },
    
    
    testCompletePredict : function()
    {
      var parser = new earley.Parser(this.grammar, []);
      
      var set = new earley.Set(this.a, 0);
      
      parser._completeAndPredict(set);
      this.assertEquals(0, set.getStates().length);
      
      set.addState(new earley.State(earley.Rule.create(this.S, [ this.E ]), 0, 0));
      parser._completeAndPredict(set);
      this.assertEquals(
          ["S->[.] E, 0", "E->[.] E + E, 0", "E->[.] a, 0" ].sort().join("; "),
          set.getStates().map( function(a)
              {
            return a + ""
              }).sort().join("; ")
      );
    },
    
    
    testAddSet : function()
    {
      var grammar = this.getArithmeticGrammar();
      var parser = new earley.Parser(grammar, []);
      
      var set = new earley.Set(this.a, 0); 
      parser.addSet(set);
      this.assertEquals(set, parser.getSetForGeneration(0));

      var set = new earley.Set(this.a, 1); 
      parser.addSet(set);
      this.assertEquals(set, parser.getSetForGeneration(1));
    },
    
    
    testCompletePredictAdvanced : function()
    {
      var NT = earley.NonTerminal.create;
      var Terminal = earley.Terminal.create;
      var R = earley.Rule.create;
      
      var S = NT("S");

      var E = NT("E");
      var T = NT("T");
      var F = NT("F");
      var plus = Terminal("+");
      var mult = Terminal("*");
      var lparen = Terminal("(");
      var rparen = Terminal(")");
      var a = Terminal("a");
      
      var grammar = this.getArithmeticGrammar();
      var parser = new earley.Parser(grammar, []);
      
      var set = new earley.Set(this.a, 0);
      set.addState(new earley.State(earley.Rule.create(S, [ E ]), 0, 0));
      parser.addSet(set);
      parser._completeAndPredict(set);

      this.assertEquals(
        [
          "S->[.] E, 0",
          "E->[.] T + E, 0",
          "E->[.] T, 0",
          "T->[.] F * T, 0",
          "T->[.] F, 0",
          "F->[.] ( E ), 0",
          "F->[.] a, 0"
        ].sort().join("; "),
        set.getStates().map( function(a)
        {
          return a + ""
        }).sort().join("; ")
      );

      var set = new earley.Set(a, 1);
      set.addState(new earley.State(earley.Rule.create(F, [ a ]), 0, 1));
      parser.addSet(set);
      parser._completeAndPredict(set);
      
      this.assertEquals(
        [
         "F->a [.], 0",
         "T->F [.] * T, 0",
         "T->F [.], 0",
         "E->T [.] + E, 0",
         "E->T [.], 0",
         "S->E [.], 0"
         ].sort().join("; "),
         set.getStates().map( function(a)
         {
           return a + ""
         }).sort().join("; ")
      );
      
      var set = new earley.Set(plus, 2);
      set.addState(new earley.State(earley.Rule.create(E, [ T, plus, E ]), 0, 2));
      parser.addSet(set);
      parser._completeAndPredict(set);
      
      this.assertEquals(
          [
            "E->T + [.] E, 0",
            "E->[.] T + E, 2",
            "E->[.] T, 2",
            "T->[.] F * T, 2",
            "T->[.] F, 2",
            "F->[.] a, 2",
            "F->[.] ( E ), 2"
           ].sort().join("; "),
           set.getStates().map( function(a)
               {
             return a + ""
               }).sort().join("; ")
      );
      
      var set = new earley.Set(a, 3);
      set.addState(new earley.State(earley.Rule.create(F, [ a ]), 2, 1));
      parser.addSet(set);
      parser._completeAndPredict(set);
      
      this.assertEquals(
          [
           "F->a [.], 2",
           "T->F [.] * T, 2",
           "T->F [.], 2",
           "E->T [.] + E, 2",
           "E->T [.], 2",
           "E->T + E [.], 0",
           "S->E [.], 0"
           ].sort().join("; "),
           set.getStates().map( function(a)
               {
             return a + ""
               }).sort().join("; ")
      );
    },    
    
    
    _testParse : function()
    {
      var grammar = this.grammar;
      var a = this.a;
      var plus = this.plus;
      var parser = new earley.Parser(grammar);
      var input = [ a, plus, a ];
      var derivations = parser.parse(input);
      this.assertEquals(1, derivations.length);
      this.assertArrayEquals( [ "S->E", "E->E + E", "E->a", "E->a" ],
          derivation.map( function(a)
          {
            return a + ""
          }));
    }
  }
});