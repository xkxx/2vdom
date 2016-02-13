var htmlparser = require('htmlparser2');
var assert = require('assert');
var debuglog = require('util').debuglog('2vdom');

var VDomHandler = function(jsxHandler) {
  this.jsxHandler = jsxHandler;
  this.treeStack = [];
  this.resultTree = null;
}

VDomHandler.prototype = {
  onopentag: function(name, attribs) {
    debuglog('open tag:', name, attribs);
    this.treeStack.push([name, attribs]);
  },
  ontext: function(text) {
    debuglog('text:', text);
    var treeStack = this.treeStack;
    assert.notEqual(treeStack.length, 0,
      "HTML root level cannot contain text node");

    var parent = treeStack[treeStack.length - 1];
    parent.push(text);
  },
  onclosetag: function(name) {
    var treeStack = this.treeStack;
    assert.notEqual(treeStack.length, 0,
      "Can't close tags without opening one");

    var nodeArgs = treeStack.pop();

    assert.equal(name, nodeArgs[0],
      "Opening and closing tagname must match");

    var vnode = this.jsxHandler.apply(null, nodeArgs);

    if (treeStack.length === 0) {
      this.resultTree = vnode;
    }
    else {
      var parent = treeStack[treeStack.length - 1];
      parent.push(vnode);
    }
  },
  // TODO: how to handle doctype?
  onprocessinginstruction: function(name, data) {
    debuglog('directive: ', name, data);
  },
};

var parse = function parse(jsxHandler, html) {
  var vDomHandler = new VDomHandler(jsxHandler);
  var parser = new htmlparser.Parser(vDomHandler);
  parser.write(html);
  parser.end();

  return vDomHandler.resultTree;
};

parse.stream = function parseStream(jsxHandler, stream) {
  return new Promise(function(resolve, reject) {
    var vDomHandler = new VDomHandler(jsxHandler);
    var parser = new htmlparser.Parser(vDomHandler);
    stream.on('data', function(data) {
      try {
        parser.write(data);
      }
      catch (err) {
        reject(err);
      }
    });
    stream.on('error', function(err) {
      reject(err);
    });
    stream.on('end', function() {
      try {
        parser.end();
        resolve(vDomHandler.resultTree);
      }
      catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = parse;
