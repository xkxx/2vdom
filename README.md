2vdom
=====

A node library for Parsing HTML into the vdom of your choice.

Differences from (html-virtualize)[https://github.com/alexmingoia/html-virtualize]:

* 2vdom doesn't restrict you to [virtual-dom](https://github.com/Matt-Esch/virtual-dom).
  Pass in the jsx-compatible pragma function from your framework (or write one),
  and it just generates the right vdom for you.
* html-virtualize depends on [vtree](https://github.com/Matt-Esch/vtree), which
  is an obsolete implementation of virtual-dom. 2vdom doesn't depend on any
  specific vdom implementation, so it doesn't get obsolete as long as jsx doesn't.
* As a result, 2vdom has much fewer dependencies. It only depends on
  [htmlparser2](https://github.com/fb55/htmlparser2).

Usage

```bash
> npm install 2vdom
```

```js
let html = "<html>...</html>";
let pragma = React.createElement || deku.element || <some jsx pragma fn>;
let parse = require('2vdom');
let vdom = parse(pragma, html);
```

Testing
-------

```bash
> jasmine
```

License
-------

2-Clause BSD
