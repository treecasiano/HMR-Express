import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';

const margin = {
  top: 20,
  right: 50,
  bottom: 30,
  left: 70
};

const width = 1200 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const parseDate = d3.time.format('%Y-%m-%d').parse;

const line = d3.svg.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.amount);
    })
    .interpolate('linear');

const svg = d3
    .select('#content')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const x = d3.time.scale().range([0, width]);
const y = d3.scale.linear().range([height-2, 0]);

const xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(12);
const yAxis = d3.svg.axis().scale(y)
    .orient('left').ticks(10);

let fetchData = id => {
  let url = 'http://54.213.83.132/hackoregon/http/current_candidate_transactions_in/' + id + '/';
  let fetchedData = new Promise((resolve, reject) => {
    $.getJSON(url, json => {
      resolve(json);
    })
  });
  return fetchedData;
};

let sortByDates = (a, b) => { return a.date - b.date };

let formatData = data => {
  let dataSet = data.map((item) => {
    return {
      date: parseDate(item.tran_date),
      amount: item.amount
    };
  });
  dataSet.sort(sortByDates);
  return dataSet;
};

let visualize = data => {
  console.log('visualizing');
  let dates = _.map(data, 'date');
  let amounts = _.map(data, 'amount');

  y.domain(d3.extent(amounts));
  x.domain(d3.extent(dates));

  let updateSvg = d3.select("#content").transition();

  updateSvg.select(".line")
      .duration(500)
      .attr("d", line(data));
  updateSvg.select(".x.axis")
      .duration(500)
      .call(xAxis);
  updateSvg.select(".y.axis")
      .duration(500)
      .call(yAxis);

};

$('select').on('change', (e, i, v) => {
  let filerId = $('select option:selected').val();
  fetchData(filerId)
      .then(value => {
        return formatData(value)
      })
      .then(value => {
        return visualize(value)
      })
});

let initialize = id => {
  let url = 'http://54.213.83.132/hackoregon/http/current_candidate_transactions_in/' + id + '/';
  d3.json(url, (json) => {
    let dataSet = formatData(json);

    svg.append('path')
        .attr('class', 'line')
        .attr('d', line(dataSet));
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    visualize(dataSet);
  })
};

initialize(931);

/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
const duplicateNode = document.querySelector ('svg');
if (module.hot) {
  module.hot.accept ();
  module.hot.dispose (() => {
    duplicateNode.parentNode.removeChild (duplicateNode);
  });
}
