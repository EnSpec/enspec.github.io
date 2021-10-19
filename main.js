
var margin = {top: 10, right: 20, bottom: 60, left: 60},
width = 600 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var yScale = d3.scaleLinear()
    .range([height,0]);

var xScale = d3.scaleLinear()
    .range([0,width]);

var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("0000"));

var yAxis = d3.axisLeft()
    .scale(yScale);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//xScale.domain([d3.min(data, function(d) { return d.wave; }), d3.max(data, function(d) { return d.wave; })]);
xScale.domain([0, 2.5]);

//yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
yScale.domain([0, 20]);

// text label for the x axis
svg.append("text")
    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
    .style("text-anchor", "middle")
    .style("font-family","sans-serif")
    .style("font-size","18px")
    .text("Transformed Transmittance");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-family","sans-serif")
    .style("font-size","18px")
    .text("LMA (g/m2)");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .style("font-size","16px")
    .style('stroke-width', '2px')
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .style("font-size","16px")
    .style('stroke-width', '2px')
    .call(yAxis);


data_json ="data3.csv";

//initial variable setup
var window_size = "136";
var color_points = "color";
var variable1 = "potassium_";
var variable2 = "tot_phenolics_";

//generate intial figure

// change window size
d3.select("#diameter").on("input", function() {
  window_size = this.value;
  update();
});

//setup color dropbown box
var color_options = [
{ value: "color",
  text: "Species" },
{ value: "color",
  text: "Year" }];

//setup dropdown menu for coloring
d3.select("#dropdown")
      .selectAll("option")
      .data(color_options)
      .enter()
      .append("option")
      .attr("value", function(option) { return option.value; })
      .text(function(option) { return option.text; });

var dropDown = d3.select("#dropdown");

dropDown.on("change", function() {
            //console.log(this.value);
            color_points = this.value;
            update();
            });

// create regression line path
var reg_line = d3.line()
.x(function(d) { return xScale(d.x); })
.y(function(d) { return yScale(d.y_pred); });

//create text group for regression metrics
gtext = svg.append("g")
    .attr("transform", "translate(" + 30 + "," + 30 + ")");


function update() {

d3.csv(data_json, function(data_file) {

    data = data_file.map(function(d)
        {
        x = +d[variable1 + window_size]
        y = +d[variable2 + window_size]
        color = d[color_points]

        //console.log(variable + window);
        return {"x": x, "y":y, "color":color};
        })

     reg_data = data_file.map(function(d)
        {
        x = +d[variable1 + window_size]
        y = +d[variable2 + window_size]
        return [x,y];
        })

    //calculate linear regressoin
//    var regress = ss.linearRegression(reg_data);
//   var regressionLine = ss.linearRegressionLine(regress);
//    var r2 = ss.rSquared(reg_data, regressionLine);

    //calculate residuals
//    var error = reg_data.map(function(d)
//                 {error = regressionLine(d[0]) - d[1]
//                  return error});
    //calculate RMSE
//    var rmse = ss.rootMeanSquare(error);

    //convert to string
//    r2 = "R-squared: " + (Math.round(r2*100)/100).toString();
//    area = "Window: " + window_size.toString() + " m";
//    rmse = "RMSE: " + (Math.round(rmse*100)/100).toString() + " g/m2";

    //combine metrics into an array
//    textArray = new Array(area, r2,rmse);

    //generate regression line
//    reg_data = new Array(-7,7).map(function(d)
//        {
//        x = +d;
//       y_pred = x*regress.m + regress.b;
//       return {"x": x, "y_pred":y_pred};
//       })

    //console.log(rmse);

    var dots = svg.selectAll(".dot")
      .data(data);

    dots.enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .style("fill", function(d) { return d.color; })

    dots.on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

    dots.exit().remove();

    dots.data(data)
    .transition()
    .duration(100)
    .ease(d3.easeQuad)
    .attr("cx", function(d) { return xScale(d.x); })
    .attr("cy", function(d) { return yScale(d.y); })
    .style("fill", function(d) { return d.color; });




    // Add the valueline path.
    var line = svg.append("path")
      .data(reg_data)
      .attr("class", "line")
      .attr("d", reg_line);

    line.exit().remove();

  svg.select(".line")
    .data([reg_data])
    .transition()// change the line
    .duration(100)
    .attr("d", reg_line);


  var text = gtext.selectAll("text")
    .data(textArray);

  text.attr("class", "enter");

  text.enter().append("text")
    .attr("class", "enter")
    .attr("dy", ".35em")
    .attr("y", function(d, i) { return i * 20;})
    .merge(text)
    .text(function(d) { return d;});

  text.exit().remove();

})
}

// Create Event Handlers for mouse ov
function handleMouseOver(d, i) {  // Add interactivity
    console.log("color");
    // Use D3 to select element, change color and size
    d3.select(this).attr({
      fill: "orange",
      r: 10
    });

  }


function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr({
      fill: this.color,
      r: 5
    });

  }




update();





