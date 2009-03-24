qx.Class.define("earley.Grammar",
{
  extend :qx.core.Object,

  construct : function(startSymbol)
  {
    this.base(arguments);
    this.__startSymbol = startSymbol;
    this.__rules =
    {};

    this.__nonTerminals =
    {};
    this.__terminals =
    {};
  },

  members :
  {
    getStartSymbol : function()
    {
      return this.__startSymbol;
    },

    addRule : function(rule)
    {
      this.__rules[rule.toString()] = rule;

      var terminals = rule.getTerminals();
      for ( var i = 0; i < terminals.length; i++)
      {
        var terminal = terminals[i];
        this.__terminals[terminal.toString()] = terminal;
      }

      var nonTerminals = rule.getNonTerminals();
      for ( var i = 0; i < nonTerminals.length; i++)
      {
        var nt = nonTerminals[i];
        this.__nonTerminals[nt.toString()] = nt;
      }
    },

    getRules : function()
    {
      return qx.lang.Object.getValues(this.__rules);
    },

    getRulesForNonTerminal : function(nonTerminal)
    {
      var rules = [];
      for ( var key in this.__rules)
      {
        var rule = this.__rules[key];
        if (rule.getLeftHandSide() == nonTerminal)
        {
          rules.push(rule);
        }
      }
      return rules;
    },

    getRuleForStartSymbol : function()
    {
      var rules = this.getRulesForNonTerminal(this.getStartSymbol());
      if (rules.length != 1)
        throw new Error("There must be 1 rule for the start symbol");
      return rules[0];
    },

    getNonTerminals : function()
    {
      return qx.lang.Object.getValues(this.__nonTerminals);
    },

    getTerminals : function()
    {
      return qx.lang.Object.getValues(this.__terminals);
    }
  }
});