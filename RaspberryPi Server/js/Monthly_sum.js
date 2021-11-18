

// https://www.d3-graph-gallery.com/line.html
var parseTime  = d3.timeParse("%H:%M:%S"); //https://github.com/d3/d3-time-format
var parseMonth = d3.timeParse("%Y-%m");

var formatTime  = d3.timeFormat("%H:%M");
var formatMonth = d3.timeFormat("%Y-%m");
//var formatDate = d3.timeFormat("%Y-%m-%d");

var height_m = 350;
var width = 500;
var margin = {left:75,right:50,top:25,bottom:0};
var between = 25;

//d3.json("/php/sample_month_data.json",function(error, data){
d3.json("/php/Combine_Month_data.php",function(error, data){
  if(error) console.log("error fetching data");

  data.forEach(function(d) {
    d.Month = formatMonth(parseMonth(d.Month));
    //d.Time = formatTime(parseTime(d.Time));
    d.Time = parseTime(d.Time).getHours() + parseTime(d.Time).getMinutes() / 60;
    d.Value_mean = parseFloat(d.Value_mean);
    d.Value_std = parseFloat(d.Value_std);
  });

//console.log(data);


  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Month;})
    .entries(data);

//console.log(sumstat);
//console.log(JSON.stringify(sumstat));

//console.log(d3.values(sumstat));
months = d3.values(sumstat).map(function(d) { return d.key; });
var color = d3.scaleOrdinal(d3.schemeCategory10);

var Colors = ['blue','red','green'];

//var Colors = ['blue','red','green'];
//  var res = ["light","temperature","humidity"]
  //var colorScale = d3.scaleOrdinal(d3[categorical[0].name])
//  var color = d3.scaleOrdinal()
//    .domain(function(d) { return d.Month; })
//    .range(["#2D4057", "#7C8DA4", "#B7433D", "#2E7576", "#EE811D"])



//console.log(color);

  var svg = d3.select("#monthly_graph")
              .append("svg")
              .attr("height","100%")
              .attr("width","100%");
  var chartGroup = svg.append("g")
                      .attr("transform",
                            "translate("+margin.left+","+margin.top+")");

  var x = d3.scaleLinear() //scaleTime()
            .domain([0,24])
            .range([0,width]);

  var y = d3.scaleLinear() //light
            .domain([0,1000])
            .range([height_m,0]);


  var yticks = 4;
  var yAxis = d3.axisLeft(y).ticks(yticks);
  var xAxis  = d3.axisBottom(x);
//
//   // Add X axis label:
chartGroup.append("text")
    .attr("class","AxisText")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height_m + margin.top + 20)
    .text("Time");
//
//     // Y axis label:
  chartGroup.append("text")
            .attr("class","AxisText")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -.5 * height_m)
            .text("Light intensity")

  chartGroup.append("g")
            .attr("class", "text axis axisX")
            .attr("transform","translate(0,"+(height_m)+")")
            .call(xAxis);

  chartGroup.append("g")
            .attr("class", "text axis axisY")
            .call(yAxis);

var valueline3 = d3.line()
                   .x(function(d,i) { return x(d.Time);})
                   .y(function(d,i) { return y1(d.Value_mean);});

 chartGroup.selectAll('.line')
             //.data(function(d){ return d.values})
           .data(sumstat)
           .enter().append("path")
                   .attr("fill", "none")
                   .attr("stroke", function(d){ return color(d.key)})
                   .attr("stroke-width", 1.5)
                   .attr("d", function(d){
           return d3.line()
             .x(function(d) { return x(d.Time); })
             .y(function(d) { return y(d.Value_mean); })
             (d.values)
         });

 // legend
 chartGroup.append("text").selectAll("tspan")
           .data(sumstat)
           //.data(months)
           .enter().append("tspan")
                   .attr("class", "text legend")
                   .attr("text-anchor", "begin")
                   .attr("stroke", function(d){ return color(d.key)})
                   .attr("stroke-width","1")
                   .attr("x", width + 50 )
                   .attr("y", function(d,i){return 0.25 * i * height } )
                   .text(function(d){return d.key;});


//
//   // var valueline2 = d3.line()
//   //                   .x(function(d,i) { return x(d.DateTime);})
//   //                   .y(function(d,i) { return y1(d.Value);});
//
// //https://stackoverflow.com/questions/39059870/d3-js-access-data-nested-2-level-down
// //https://bl.ocks.org/blahah/1071760
//
// // var circlesGroups = svg.selectAll(".circlesGroups")
// // 	.data(databyhour)
// // 	.enter()
// // 	.append("g")
// // 	.attr("fill", function(d){ return (d.key == "temperature") ? "blue" : "red"});
// //
// // var circles = circlesGroups.selectAll(".circles")
// // 	.data(function(d){ return d.values})
// // 	.enter()
// // 	.append("circle");
// //
// // circles.attr("r", 10)
// // 	.attr("cx", function(d){ return x(d.Hour)})
// // 	.attr("cy", function(d){ return y1(d.mean)});
//
// console.log(sumstat);
//


//
//
//   var area = d3.area()
//                .x(function(d,i){return x(d.Hour);})
//                .y0( y1(0))
//                //.y0(function(d,i){return y1(d.Mean - d.StDev);})
//                .y0(function(d) { if (d.Measure == "light") {return y1(d.Mean - d.StDev)}
//                                              else if (d.Measure =="temperature"){return y2(d.Mean - d.StDev) + height + between}
//                                              else {return y3(d.Mean - d.StDev)+ 2 * height + 2* between}
//                               ; })
//                //.y1( y1(1000));
//                //.y1(function(d,i){return y1(d.Mean );});
//                .y1(function(d) { if (d.Measure == "light") {return y1(d.Mean + d.StDev)}
//                                              else if (d.Measure =="temperature"){return y2(d.Mean + d.StDev) + height + between}
//                                              else {return y3(d.Mean + d.StDev)+ 2 * height + 2* between}
//                               ; })
//
//
//  chartGroup.selectAll('.path')
//
//            .data(sumstat)
//            .enter().append("path")
//            .attr("class","SD_area")
//            .attr("fill",   function(d){ return color(d.key)})
//            .attr("stroke", function(d){ return color(d.key)})
//         //  .attr("stroke-width", 1.5)
//           .attr("d", function(d) {return area(d.values); });
//           // .attr("d",area(d.values));
//
//
});
