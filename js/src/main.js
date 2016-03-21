'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('./assets/styles.css');

// using lodash for random data
var dataSet = _lodash2['default'].map(_lodash2['default'].range(25), function () {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: Math.random() * 40
  };
});

// all d3 code below
var margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50
};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = _d32['default'].select('#content').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var yScale = _d32['default'].scale.linear().domain([0, _d32['default'].max(dataSet, function (data) {
  return data.y;
})]).range([height, 0]);

var xScale = _d32['default'].scale.linear().domain([0, 100]).range([0, width]);

svg.selectAll('circle').data(dataSet).enter().append('circle').attr('class', 'bubble').attr('cx', function (data) {
  return xScale(data.x);
}).attr('cy', function (data) {
  return yScale(data.y);
}).attr('r', function (data) {
  return data.radius;
});

var xAxis = _d32['default'].svg.axis().scale(xScale).orient('bottom').ticks(10).innerTickSize(10).outerTickSize(0).tickPadding(5);

svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + (height + 0) + ')').call(xAxis);

var yAxis = _d32['default'].svg.axis().scale(yScale).orient('left').ticks(10).innerTickSize(10).outerTickSize(0).tickPadding(5);

svg.append('g').attr('class', 'y axis').attr('transform', 'translate(0, ' + 0 + ')').call(yAxis);

/*
* ignore this code below - it's for webpack to know that this
* code needs to be watched and not to append extra elements
*/
var duplicateNode = document.querySelector('svg');
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function () {
    duplicateNode.parentNode.removeChild(duplicateNode);
  });
}
//# sourceMappingURL=/Users/Tree/Projects/hack-university/HMR-Express/src/main.js.map