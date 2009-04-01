qx.Class.define("earley.test.Tokenizer",
{
  extend :qx.dev.unit.TestCase,

  members :
  {
    testArithmeticTokenizer : function()
    {
      var input = "3+ (5 * 14 )";
      var arithmeticTokenizer = new earley.arithmetic.Tokenizer(input);
      var tokenStream = arithmeticTokenizer.tokenize();
      this.assertTrue(tokenStream.hasNext());
      
      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals("3",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.NUMBER));

      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals("+",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.PLUS));
      
      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals("(",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.LPAREN));
      
      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals("5",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.NUMBER));
      
      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals("*",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.MULT));
      
      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals("14",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.NUMBER));
      
      var token = tokenStream.next();
      this.assertInstance(token, earley.Token);
      this.assertEquals(")",token.toString());
      this.assertTrue(token.matches(earley.arithmetic.Grammar.RPAREN));
    }
  }
});