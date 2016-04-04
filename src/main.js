import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';


// TODO: add promise/error handling
// TODO: fix line chart so that it displays a sum of transactions for each date


const margin = {
  top: 20,
  right: 50,
  bottom: 30,
  left: 70
};

const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const filerIdInput = document.getElementById ("filerIdInput");
const filerIdSubmit = document.getElementById ("filerIdSubmit");
let filerId = parseInt (filerIdInput.value);

filerIdSubmit.addEventListener ("click", () => {
  if (document.getElementById ("mySVG")) {
    d3.select ("#mySVG").remove ();
  }

  filerId = parseInt (filerIdInput.value);

  let url = 'http://54.213.83.132/hackoregon/http/current_candidate_transactions_in/' + filerId + '/';

  d3.json (url, json => {

    let dataSet = json.map (item => {
      return {
        date: item.tran_date,
        amount: +item.amount
      }
    });

    // const parseDate = d3.time.format ('%Y-%m-%d').parse;

    var nestedDataSet = d3.nest ()
      .key (d => {
        return d.date;
      })
      .rollup (v => {
        return d3.sum (v, d => {
          return d.amount;
        });
      })
      .entries (dataSet);


    // using lodash to create an array of dates
    let dates = _.map (nestedDataSet, 'key');
    let amounts = _.map (nestedDataSet, 'values');

    let newDates = [];
    let finalData = [];

    for (let i = 0; i < nestedDataSet.length; i++) {
      newDates[i] = new Date (dates[i]);
    }

    for (let i = 0; i < nestedDataSet.length; i++) {
      finalData.push (
        {date: newDates[i], amount: amounts[i]});
    }

    dataSet = finalData;

    dataSet.sort ( (a, b) => {
      return a.date.getTime () - b.date.getTime ()
    });

    // defining the x and y values
    let x = d3.time.scale () // determined through d3.time.scale function
      .domain (d3.extent (newDates)) // using the extent method on dates array
      .range ([0, width]);
    let y = d3.scale.linear () // determined through d3.scale.linear function
      .domain (d3.extent (amounts))
      // .domain(d3.extent(amounts)) // we had this in an array in class like
      // [d3.extent...] and it should not have been
      .range ([height, 0]);

    // we didn't get to this in class but this should be familiar
    let xAxis = d3.svg.axis ().scale (x)
      .orient ('bottom').ticks (6);
    let yAxis = d3.svg.axis ().scale (y)
      .orient ('left').ticks (10);

    // we attach the svg to the html here
    let svg = d3.select ('#content').append ('svg')
      .attr ('width', width + margin.left + margin.right)
      .attr ('height', height + margin.top + margin.bottom)
      .attr ("id", "mySVG")
      .append ('g')
      .attr ("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    /***** Start of path definition *****/

    // defining path function to draw the line
    let path = d3.svg.line () // using d3's line layout here
      .x (d => {
        return x (d.date); // Mistake was we had return d.date
      })
      .y (d => {
        return y (d.amount); // Mistake was we had return d.amount
      })

      .interpolate ('basis');

    /***** End of path definition *****/

    svg.append ('path') // if you append path above, this should be just svg
      // .datum(dataSet) // if you append the path above, you HAVE to do this
      .attr ('class', 'line')
      .attr ('d', path (dataSet));// if you append the path above, you only pass in
    // path
    // function like .attr('d', path)

    // append axes
    svg.append ("g")
      .attr ("class", "x axis")
      .attr ("transform", "translate(0," + height + ")")
      .call (xAxis);
    svg.append ("g")
      .attr ("class", "y axis")
      .call (yAxis)
  });

});


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
