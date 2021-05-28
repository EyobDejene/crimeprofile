

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


function getChart(dataFile,age,gender) {

  d3.json(dataFile).then(function(data){


    console.log(getFilterdData(data,age, gender));


    function getFilterdData(data, age, gender) {
      const dataRaw = data.filter(
          item => item.Leeftijd === age && item.Geslacht === gender);
      const transformedData = dataRaw.map(item => {
        return {
          vermogensmisdrijven: item['vermogensmisdrijven'],
          vernielingOpenbareOrde: item['vernielingen'],
          geweldsmisdrijven: item['geweldsmisdrijven'],
          verkeersmisdrijven: item['verkeersmisdrijven'],
          drugsmisdrijven: item['drugsmisdrijven'],
          // vuurwapenmisdrijven: item['vuurwapenmisdrijven'],
        }
      });

      data = transformedData;
      return data[0];
    }





    // Parse the Data
    data = data.map(function(d) {
        let arr = [];
        for( item in d.Category) {
          arr.push(d.Category[Object.keys(d.Category)[item]]);
        }
        let Categories = [];
        for(let i=0; i < arr.length; i++){
          let newObject = {
            "category":Object.keys(arr[i])[0],
            "total": d.Totaal,
            "count":arr[i][Object.keys(arr[i])[0]]
          }
          Categories.push(newObject);
        }
        return Categories;
      });
//console.log(data);

   const cat = data.map(function(d) {
     let arr = [];
     for (i in d) {
       arr.push(d[i].category);
     }
     return arr;
   });



// X axis
      var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(cat[0])
      .padding(0.2);
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

// Add Y axis
      var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0]);
      svg.append("g")
      .call(d3.axisLeft(y));

    //
    // const count = data.map(function(d) {
    //   let arr = [];
    //   for (i in d) {
    //     arr.push(d[i].count);
    //   }
    //   return arr;
    // });

// Bars
      svg.selectAll("mybar")
      .data(data[0])
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.category); })
      .attr("y", function(d) { return y(100 / d.total * d.count ); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(100 / d.total * d.count ); })
      .attr("fill", "#69b3a2")

  });

}

