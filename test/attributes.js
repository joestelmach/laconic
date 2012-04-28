$(document).ready(function() {
  module("Attributes");

  test("class attribute names", function() {
    var results = [];
    _(['class', 'CLASS', 'classname', 'className', 'CLASSNAME']).each(function(name) {
      var attributes = {};
      attributes[name] = 'foo';
      results.push($.el.div(attributes, 'bar').outerHTML);
    });

    equal(_(results).uniq().length, 1, 
      "class name attribute may be specified with 'class' or 'classname', and should be case-insensitive");
  });

  test("style attribute names", function() {
    var results = [];
    _(['style', 'cssText', 'CSSTEXT']).each(function(name) {
      var attributes = {};
      attributes[name] = 'display:block;';
      results.push($.el.div(attributes, 'bar').outerHTML);
    });

    equal(_(results).uniq().length, 1, 
      "style attribute may be specified with 'style' or 'cssText', and should be case-insensitive");
  });

  test("for and type attribute", function() {
    var results = [];

    _(['for', 'htmlFor', 'FOR', 'HTMLFOR']).each(function(forName) {
      var inputAttributes = {};
      var input = $.el.input({type : 'text', name : 'foo'});

      var labelAttributes = {};
      labelAttributes[forName] = 'foo';
      var label = $.el.label(labelAttributes);


      equal(input.getAttribute('name'), 'foo');
      equal(input.getAttribute('type'), 'text');

      equal((label.getAttribute('for') || label.getAttribute('htmlFor')), 'foo');
    });
  });
});
