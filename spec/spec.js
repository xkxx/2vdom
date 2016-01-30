var element = require('deku').element;

describe("2vdom", function() {
  var parse = require('../');

  function testNode(html) {
    expect(parse(element, html)).toBeJSX(html);
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

  it("parses a nested tree", function() {
    testNode("<div><p>Hello</p><br/><p>World</p></div>");
  });

  it("parses a nested tree with text frags", function() {
    testNode("<div><p>Hello</p>,<br/><p>World</p></div>");
  });

  // doesn't work
  // it("parses doctype", function() {
  //   var body = parse(element, "<!DOCTYPE html>");
  //   expect(body.type).toBe('!DOCTYPE');
  // });
});
