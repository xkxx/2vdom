var element = require('deku').element;
var h = require('virtual-dom').h;

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
