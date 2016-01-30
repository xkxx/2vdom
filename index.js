var htmlparser = require('htmlparser2');
var assert = require('assert');

var parse = function (jsxHandler, html) {
  var tree_stack = [];
  var result_tree = null;

  var vDomHandler = {
    onopentag: function(name, attribs) {
      console.info(name, attribs)
      tree_stack.push([name, attribs]);
    },
    ontext: function(text) {
      console.info(text);
      assert.notEqual(tree_stack.length, 0,
        "HTML root level cannot contain text node");

      var parent = tree_stack[tree_stack.length - 1];
      parent.push(text);
    },
    onclosetag: function(name) {
      assert.notEqual(tree_stack.length, 0,
        "Can't close tags without opening one");

      var node_args = tree_stack.pop();

      assert.equal(name, node_args[0],
        "Opening and closing tagname must match");

      var vnode = jsxHandler.apply(null, node_args);

      if (tree_stack.length === 0) {
        result_tree = vnode;
      }
      else {
        var parent = tree_stack[tree_stack.length - 1];
        parent.push(vnode);
      }
    },
    // TODO: how to handle doctype?
    onprocessinginstruction: function(name, data) {
      console.info(name, data);
    }
  }

  var parser = new htmlparser.Parser(vDomHandler);
  parser.write(html);
  parser.end();

  return result_tree;
}

module.exports = parse;
