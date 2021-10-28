
var margin = {top: 20, right: 20, bottom:20, left: 20},
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

var svg = d3.select(".map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 let traits_ranges = {
   'chl_a_mmol_m2':[100,500],
   'calcium':[.5,2],
   'lma_g_m2':[50,120],
   'lignin':[5,20],
   'nitrogen':[1.25,3.5],
   'potassium':[.4,1.75],
   'phosphorus':[.1,.35],
   'tot_phenolics': [4,17]};
 
let color_map = ['#000000',
'#6d009c',
'#002fdd',
'#00a4bb',
'#009b13',
'#00e200',
'#ccf900',
'#ffad00',
'#e40000',
'#cccccc'];

//xScale.domain([d3.min(data, function(d) { return d.wave; }), d3.max(data, function(d) { return d.wave; })]);
xScale.domain([0, 63]);
//yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
yScale.domain([50,0]);

data_json ="map/data3.csv";

//initial variable setup
var window_size = "136";
var trait = "calcium";
var variable1 = "x_index";
var variable2 = "y_index";

var colors = d3.scaleQuantize()
.domain(traits_ranges[trait])
.range(color_map);

// change window size
d3.select("#date").on("input", function() {
  window_size = this.value;
  update();
});

//setup dropdown menu for coloring
var dropDown = d3.select("#dropdown");

dropDown.on("change", function() {
    trait = this.value;
    console.log(trait);
    colors = d3.scaleQuantize()
    .domain(traits_ranges[trait])
    .range(color_map);
    
    update();
            });

function update() {

    d3.csv(data_json, function(data_file) {
        data = data_file.map(function(d)
            {
            x = d[variable1]
            y = d[variable2]
            color = d[trait +'_'+ window_size]
            
            return {"x": x, "y":y, "color":color};
            })

    var dots = svg.selectAll(".dot")
      .data(data);

    dots.enter().append("rect")
      .attr("class", "dot")
      .attr("x", function(d) { return xScale(d.x); })
      .attr("y", function(d) { return yScale(d.y); })
      .attr("width", 9)
      .attr("height", 11)
      .style("fill", d=>colors(d.color))
      .style("stroke", '#1e1c1c')
      .style("stroke-width", .5);

    dots.data(data)
    .style("fill", function(d) { return colors(d.color); })
    .style("stroke", '#1e1c1c')
    .style("stroke-width", .5);

    dots.exit().remove();

})
}


svg.on("mousedown", function() {
  d3.csv(data_json, function(data_file) {
      data = data_file.map(function(d)
          {
          x = d[variable1]
          y = d[variable2]
          species = d["species"]

          return {"x": x, "y":y,"species": species};
          })

  var dots = svg.selectAll(".dot")
    .data(data);

  dots.enter().append("rect")
    .attr("class", "dot")
    .attr("x", function(d) { return xScale(d.x); })
    .attr("y", function(d) { return yScale(d.y); })
    .attr("width", 8)
    .attr("height", 10)

  dots.data(data)
     .style("fill", function(d) { return d.species; });

  dots.exit().remove();

})
})

svg.on("mouseup", function() {
    update();
  })

update();
