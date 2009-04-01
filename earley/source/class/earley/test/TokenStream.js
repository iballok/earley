qx.Class.define("earley.test.TokenStream",
{
  extend :qx.dev.unit.TestCase,

  members :
  {
    testCreate : function()
    {
      var input = "3 + ( 5 * 14 )";
      var tokenStream = new earley.TokenStream(input);      
      this.assertEquals(input, tokenStream.getInput());
    },
    
    testGetTokenString : function() {      
      var input = "3 + ( 5 * 14 )";
      var tokenStream = new earley.TokenStream(input);
      this.assertEquals("3 +", tokenStream.getTokenString(0, 3));
      this.assertEquals("+ ( 5", tokenStream.getTokenString(2, 5));
    },
    
    testSetTokens : function() 
    {
      var input = "3 + ( 5 * 14 )";
      var tokenStream = new earley.TokenStream(input);

      var a = new earley.Token(0, 1, tokenStream);
      var plus = new earley.Token(2, 1, tokenStream);
      
      tokenStream.addToken(a);
      tokenStream.addToken(plus);
      
      this.assertTrue(tokenStream.hasNext());
      this.assertEquals(a, tokenStream.next());

      this.assertTrue(tokenStream.hasNext());
      this.assertEquals(plus, tokenStream.next());

      this.assertFalse(tokenStream.hasNext());
    }
  }
});