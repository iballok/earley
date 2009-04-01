qx.Class.define("earley.test.Token",
{
  extend :qx.dev.unit.TestCase,

  members :
  {
    testTokenCreate : function()
    {
      var input = "3 + ( 5 * 14 )";
      var tokenStream = new earley.TokenStream(input);

      var token = new earley.Token(0, 1, tokenStream);
      this.assertEquals("3", token.toString());
      this.assertEquals(tokenStream, token.getTokenStream());
      var tag = earley.Terminal.create("a");

      var token = new earley.Token(1, 3, tokenStream);
      this.assertEquals(" + ", token.toString());
    },
    
    testTag : function()
    {
      var input = "3 + ( 5 * 14 )";
      var tokenStream = new earley.TokenStream(input);

      var a = earley.Terminal.create("a");
      var b = earley.Terminal.create("b");
      
      var token = new earley.Token(0, 1, tokenStream);
      token.addTag(a);
      
      this.assertTrue(token.matches(a));
      this.assertFalse(token.matches(b));
    }
  }
});