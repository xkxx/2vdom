var element = require('deku').element;
var h = require('virtual-dom').h;
var fs = require('fs');

describe("2vdom", function() {
  var parse = require('../');

  function testNode(html) {
    expect(parse(element, html)).toBeJSX(html);
  }

  function hPragma(tagname, attrs) {
    return h(tagname, attrs, [].slice.call(arguments, 2));
  }

  it("parses an empty tree", function() {
    expect(parse(element, "")).toEqual(null);
  });

  it("parses a self-closing tag", function() {
    testNode("<br/>");
  });

  it("parses a tag-pair", function() {
    testNode("<head></head>");
  });

  it("parses a tag with text content", function() {
    testNode("<p>Hello</p>");
  });

  it("parses a tag with attrs", function() {
    testNode('<a href="#">Hello</a>');
  });

  it("parses a nested tree", function() {
    testNode("<div><p>Hello</p><br/><p>World</p></div>");
  });

  it("parses a nested tree with text frags", function() {
    testNode("<div><p>Hello</p>,<br/><p>World</p></div>");
  });

  it("ignores html doctype", function() {
    var tree = parse(element, '<!doctype html><html></html>');
    expect(tree.type).toBe('html');
  });

  it("ignores xml pragma", function() {
    var tree = parse(element,
      '<?xml version="1.0" encoding="UTF-8"?>' +
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML+RDFa 1.0//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd'>" +
      '<html></html>');
    expect(tree.type).toBe('html');
  });

  it("ignores leading and trailing whitespace", function() {
    testNode("  <html> </html> \t\n ");
  });

  it("parses non-self-closing tags properly", function() {
    var tree = parse(element, "<p>Hello<br><br>World</p>");
  });

  it("parses hacker news homepage", function() {
    parse(element, fs.readFileSync('spec/hacker-news.html', 'utf-8'));
  });

  it("parses xhtml test page", function() {
    parse(element, fs.readFileSync('spec/xhtml-test.html', 'utf-8'));
  });

  it("parses buffer", function() {
    var tree = parse(element, new Buffer("<html></html>"));
    expect(tree.type).toBe('html');
  });

  it("parses xhtml test page as a stream", function(done) {
    var result = parse.stream(element, fs.createReadStream('spec/xhtml-test.html'));
    result.then(function(tree) {
      expect(tree.type).toBe('html');
      done();
    }).catch(function(err) {
      fail(err);
      done();
    });
  });

  it("works with hyperscript", function() {
    var vdom = parse(hPragma, '<div><p>Hello</p><img src="#" alt=" "/></div>');
    expect(vdom.tagName).toBe("DIV");
    expect(vdom.children.length).toBe(2);
  });

  // #wontfix
  // it("parses doctype", function() {
  //   var body = parse(element, "<!DOCTYPE html>");
  //   expect(body.type).toBe('!DOCTYPE');
  // });
});
