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

    testCreate : function()
    {
      var parser = new earley.Parser(this.grammar);
      this.assertEquals(this.grammar, parser.getGrammar());
    },

    testPredict : function()
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

    testParse : function()
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