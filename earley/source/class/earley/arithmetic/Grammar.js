qx.Class.define("earley.arithmetic.Grammar",
{
  statics : {
    NUMBER : earley.Terminal.create("a"),
    PLUS : earley.Terminal.create("+"),
    MULT : earley.Terminal.create("*"),
    LPAREN : earley.Terminal.create("("),
    RPAREN : earley.Terminal.create(")")
  }
});