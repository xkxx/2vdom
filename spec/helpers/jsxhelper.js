var babel = require("babel-core");
var vm = require("vm");
var element = require('deku').element;
var _ = require('lodash');

var babelOptions = {
  plugins: [
    ["transform-react-jsx", { "pragma": "element" }]
  ]
};
var vmContext = vm.createContext({element: element});


beforeEach(function() {
  jasmine.addMatchers({
    toBeJSX: function() {
      return {
        compare: function(actual, expected) {
          var expectedJSX = babel.transform(expected, babelOptions).code;
          var expectedResult = vm.runInContext(expectedJSX, vmContext);

          return {pass: _.isEqual(actual, expectedResult)};
        }
      }
    }
  });
});
