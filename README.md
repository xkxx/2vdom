2vdom
=====

[![npm version](https://badge.fury.io/js/2vdom.svg)](https://badge.fury.io/js/2vdom)

A node library for parsing HTML into vdom of your choice.

Differences from [html-virtualize](https://github.com/alexmingoia/html-virtualize):

* 2vdom doesn't restrict you to [virtual-dom](https://github.com/Matt-Esch/virtual-dom).
  Pass in the jsx-compatible pragma function from your framework (or write one),
  and it just generates the right vdom for you.
* html-virtualize depends on [vtree](https://github.com/Matt-Esch/vtree), which
  is an obsolete implementation of virtual-dom. 2vdom doesn't depend on any
  specific vdom implementation, so it doesn't get obsolete as long as jsx doesn't.
* As a result, 2vdom has much fewer dependencies. It only depends on
  [htmlparser2](https://github.com/fb55/htmlparser2).

Usage
-----

### Installation

```bash
> npm install 2vdom
```

### Top-level API

#### parse(pragma, html | buffer)

* `pragma`: jsx-compatible pragma function, e.g. React.createElement
* `html`: html to parse. May be an ordinary js string or Node.js Buffer
* *Returns*: parsed tree produced by your pragma function

#### parse.stream(pragma, stream)

* stream: Node.js ReadStream containing the html to be parsed
* *Returns*: a `Promise` that resolves to the parsed tree.

### Usage with React / Deku / ...

```js
let parse = require('2vdom');

let html = "<html>...</html>";
let pragma = React.createElement || deku.element || <some jsx pragma fn>;

let vdom = parse(pragma, html);
// Buffer works too:
parse(pragma, fs.readFileSync('<filename>'))
```

### Usage with virtual-dom (hyperscript)

```js
let pragma = (tagname, attrs, ...children) =>
  h(tagname, attrs, children);

// carry on as usual ...
let vdom = parse(pragma, html);
```

### Usage with node.js streams

```js
let fileStream = fs.createReadStream('<filename>');

parse.stream(pragma, fileStream)
.then(function(vdom) {
  // your code here ...
});
```

### Limitations

There's a number of limitations of 2vdom that should not affect normal usage.
However, if you encounter them in any actual use case or if you have good ideas
for overcoming them, please issue or PR.

* 2vdom doesn't currently preserve comments. So if you rely on IE conditional
  comments, you are in a bit of a trouble here. This is an inherent limitation
  of JSX, because there's no way of conveying comments to vdom pragma functions.
* 2vdom doesn't currently preserve HTML directives e.g. `<!doctype>` Again,
  because there's no way of conveying these to pragma functions.
* 2vdom expects a single element (i.e. `<html>`) at document root. If you have
  multiple ones, 2vdom throws away every one but the last element. This is not
  a technical limitation, so let me know if you need this feature.

Testing
-------

```bash
> jasmine
```

License
-------

2-Clause BSD
