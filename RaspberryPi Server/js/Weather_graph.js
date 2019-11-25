

// https://www.d3-graph-gallery.com/line.html
var parseDateTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
//var parseHour = d3.timeParse("%H");

var height = 100;
var width = 600;
var margin = {left:75,right:50,top:25,bottom:0};

var Colors = ['blue','red','green'];

// d3.json("/php/sample_data.json",function(error, data){
d3.json("/php/read_data.php",function(error, data){
  if(error) console.log("error fetching data");

  data.forEach(function(d) {
    d.DateTime = parseDateTime(d.DateTime);
    d.Value = parseFloat(d.Value);
  });

//console.log(data);

  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.MeasureType;})
    .entries(data);

    // color palette
  //var res = sumstat.map(function(d){ return d.key }) // list of group names
  var res = ["light","temperature","humidity"]
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(Colors);

console.log(res);
//console.log(data);
  var svg = d3.select("#line_graph")
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

  var x = d3.scaleTime() //scaleTime()
            .domain(d3.extent(data,function(d){return d.DateTime;}))
            .range([0,width]);

  var y1 = d3.scaleLinear() //light
            .domain([0,1100])
            .range([height,0]);
  var y2 = d3.scaleLinear() // temp
             .domain([0,40])
             .range([height,0]);
  var y3 = d3.scaleLinear() // humidity
             .domain([0,100])
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
    .attr("y", height * 3 + margin.top + 20)
    .text("Date & Time");

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
                    .attr("y", function(d,i){return 0.5 * height + (i * height)} )
                    .text(function(d){return d;});

  chartGroup.append("g")
            .attr("class", "text axis axisX")
            .attr("transform","translate(0,"+height * 3+")")
            .call(xAxis);

  chartGroup.append("g")
            .attr("class", "text axis axisY1")
            .call(yAxis1);

  chartGroup.append("g")
            .attr("class", "text axis axisY2")
            .attr("transform","translate(0,"+height+")")
            .call(yAxis2);

  chartGroup.append("g")
            .attr("class", "text axis axisY3")
            .attr("transform","translate(0,"+height * 2+")")
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
            .attr("y1",2*height)
            .attr("x2",width)
            .attr("y2",2*height)

  var valueline2 = d3.line()
                    .x(function(d,i) { return x(d.DateTime);})
                    .y(function(d,i) { return y1(d.Value);});

chartGroup.selectAll('.line')
          .data(sumstat)
          .enter().append("path")
                  .attr("fill", "none")
                  .attr("stroke", function(d){ return color(d.key)})
                  .attr("stroke-width", 1.5)
                  .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.DateTime); })
            .y(function(d) { if (d.MeasureType == "light") {return y1(d.Value)}
                             else if (d.MeasureType =="temperature"){return y2(d.Value) + height}
                             else {return y3(d.Value)+ 2 * height}
              ; })
            //.y(function(d) { return y3(d.Value); })
            (d.values)
        });

            // chartGroup.append("path")
            //           .attr("class", "line")
            //           .attr("stroke", function(d){ return color(d.city)})
            //           .attr("d",valueline2(data));

});
