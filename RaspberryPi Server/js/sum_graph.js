

// https://www.d3-graph-gallery.com/line.html
var parseDateTime = d3.timeParse("%Y-%m-%d %H:%M:%S"); //https://github.com/d3/d3-time-format
var formatHour = d3.timeFormat("%H");
var formatDate = d3.timeFormat("%Y-%m-%d");

var height = 100;
var width = 500;
var margin = {left:75,right:50,top:25,bottom:0};
var between = 25;

var Colors = ['blue','red','green'];

d3.json("/php/sample_data.json",function(error, data){
//d3.json("/php/read_data.php",function(error, data){
  if(error) console.log("error fetching data");

  data.forEach(function(d) {
    d.DateTime = parseDateTime(d.DateTime);
    d.Value = parseFloat(d.Value);

    d.Date = formatDate(d.DateTime);
    d.Hour = formatHour(d.DateTime);
  });

//console.log(data);

//http://learnjsdata.com/group_data.html
var databyhour = d3.nest()
  //.key(function(d) { return d.Hour + d.MeasureType; })
  .key(function(d) { return d.MeasureType; })
  .key(function(d) { return d.Hour; })
  .rollup(function(v) { return {
    Hour: d3.mean(v, function(d) { return d.Hour; }),
    mean: d3.mean(v, function(d) { return d.Value; }),
    sd: d3.deviation(v, function(d) { return d.Value; })
  }; })
  .entries(data);
  console.log(databyhour);

//https://stackoverflow.com/questions/35851383/d3-flatten-nested-data
var flat_data= []
databyhour.forEach(function(Measure) {
  Measure.values.forEach(function(Hour) {
    flat_data.push({
      Measure: Measure.key,
      Hour: parseFloat(Hour.key),
      Mean: Hour.value.mean,
      StDev: Hour.value.sd
    });
  });
});

flat_data.sort(function(a, b) {return +a.Hour - +b.Hour});
console.log(flat_data);

  //console.log(JSON.stringify(databyhour));

  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Measure;})
    .entries(flat_data);

    // color palette
  //var res = sumstat.map(function(d){ return d.key }) // list of group names
  var res = ["light","temperature","humidity"]
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(Colors);

//console.log(res);
//console.log(data);
  var svg = d3.select("#summary_graph")
              .append("svg")
              .attr("height","100%")
              .attr("width","100%");
  var chartGroup = svg.append("g")
                      .attr("transform",
                            "translate("+margin.left+","+margin.top+")");

// console.log(
//   [d3.extent(data,function(d){return d.DateTime;})[0] - parseHour(5),
// d3.extent(data,function(d){return d.DateTime;})[1]]
// );

  var x = d3.scaleLinear() //scaleTime()
            .domain([0,24])
            .range([0,width]);

  var y1 = d3.scaleLinear() //light
            .domain([0,1000])
            .range([height,0]);
  var y2 = d3.scaleLinear() // temp
             .domain([10,25])
             .range([height,0]);
  var y3 = d3.scaleLinear() // humidity
             .domain([25,75])
             .range([height,0]);

var yticks = 4;
  var yAxis1 = d3.axisLeft(y1).ticks(yticks);
  var yAxis2 = d3.axisLeft(y2).ticks(yticks);
  var yAxis3 = d3.axisLeft(y3).ticks(yticks);
  var xAxis  = d3.axisBottom(x);

  // Add X axis label:
chartGroup.append("text")
    .attr("class","AxisText")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height * 3 + 2 * between + margin.top + 20)
    .text("Time");

    // Y axis label:
  chartGroup.append("text")
            .attr("class","AxisText")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -1.5 * height)
            .text("Values")

  // legend
  chartGroup.append("text").selectAll("tspan")
            .data(res)
            .enter().append("tspan")
                    .attr("class", "text legend")
                    .attr("text-anchor", "begin")
                    .attr("stroke",function(d,i){return Colors[i];})
                    .attr("stroke-width","1")
                    .attr("x", width + 50 )
                    .attr("y", function(d,i){return 0.5 * height + (i * height) + (i * between)} )
                    .text(function(d){return d;});

  chartGroup.append("g")
            .attr("class", "text axis axisX")
            .attr("transform","translate(0,"+(height * 3+ between * 2)+")")
            .call(xAxis);

  chartGroup.append("g")
            .attr("class", "text axis axisY1")
            .call(yAxis1);

  chartGroup.append("g")
            .attr("class", "text axis axisY2")
            .attr("transform","translate(0,"+(height + between)+")")
            .call(yAxis2);

  chartGroup.append("g")
            .attr("class", "text axis axisY3")
            .attr("transform","translate(0,"+(height * 2 + between * 2)+")")
            .call(yAxis3);

  chartGroup.append('line')
            .attr("class","help_line")
            .attr("x1",0)
            .attr("y1",height)
            .attr("x2",width)
            .attr("y2",height)
  chartGroup.append('line')
            .attr("class","help_line")
            .attr("x1",0)
            .attr("y1",2*height+between)
            .attr("x2",width)
            .attr("y2",2*height+between)

  // var valueline2 = d3.line()
  //                   .x(function(d,i) { return x(d.DateTime);})
  //                   .y(function(d,i) { return y1(d.Value);});

//https://stackoverflow.com/questions/39059870/d3-js-access-data-nested-2-level-down
//https://bl.ocks.org/blahah/1071760

// var circlesGroups = svg.selectAll(".circlesGroups")
// 	.data(databyhour)
// 	.enter()
// 	.append("g")
// 	.attr("fill", function(d){ return (d.key == "temperature") ? "blue" : "red"});
//
// var circles = circlesGroups.selectAll(".circles")
// 	.data(function(d){ return d.values})
// 	.enter()
// 	.append("circle");
//
// circles.attr("r", 10)
// 	.attr("cx", function(d){ return x(d.Hour)})
// 	.attr("cy", function(d){ return y1(d.mean)});

console.log(sumstat);

chartGroup.selectAll('.line')
            //.data(function(d){ return d.values})
          .data(sumstat)
          .enter().append("path")
                  .attr("fill", "none")
                  .attr("stroke", function(d){ return color(d.key)})
                  .attr("stroke-width", 1.5)
                  .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.Hour); })
            .y(function(d) { if (d.Measure == "light") {return y1(d.Mean)}
                             else if (d.Measure =="temperature"){return y2(d.Mean) + height + between}
                             else {return y3(d.Mean)+ 2 * height + 2* between}
              ; })
            (d.values)
        });


  var area = d3.area()
               .x(function(d,i){return x(d.Hour);})
               .y0( y1(0))
               //.y0(function(d,i){return y1(d.Mean - d.StDev);})
               .y0(function(d) { if (d.Measure == "light") {return y1(d.Mean - d.StDev)}
                                             else if (d.Measure =="temperature"){return y2(d.Mean - d.StDev) + height + between}
                                             else {return y3(d.Mean - d.StDev)+ 2 * height + 2* between}
                              ; })
               //.y1( y1(1000));
               //.y1(function(d,i){return y1(d.Mean );});
               .y1(function(d) { if (d.Measure == "light") {return y1(d.Mean + d.StDev)}
                                             else if (d.Measure =="temperature"){return y2(d.Mean + d.StDev) + height + between}
                                             else {return y3(d.Mean + d.StDev)+ 2 * height + 2* between}
                              ; })


 chartGroup.selectAll('.path')

           .data(sumstat)
           .enter().append("path")
           .attr("class","SD_area")
           .attr("fill",   function(d){ return color(d.key)})
           .attr("stroke", function(d){ return color(d.key)})
        //  .attr("stroke-width", 1.5)
          .attr("d", function(d) {return area(d.values); });
          // .attr("d",area(d.values));


});
