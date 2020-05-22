
function updateChoropleth(countries){
var svg = d3.select("#my_dataviz"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoEquirectangular()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
.domain([0,5,10,15,50,100,100,500,1000, 1200, 1500])
  .range(d3.schemeOranges[9]);

// Load external data and boot

d3.queue()
  .defer(d3.json, "static/world.geojson")
  .defer(d3.csv, "static/world_population.csv")//, function(d) { data.set(d.code, +d.pop); })
  .await(ready);

  var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background-color", "#fff")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("tooltip");

function ready(error, topo) {


  let mouseOver = function(d) {
    
    
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
    return tooltip.style("visibility", "visible").text(d3.select(this).attr("id"));
  }

  let mouseLeave = function(d) {
    
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "")
    
      return tooltip.style("visibility", "hidden")
  }
//console.log("Here")
  let mouseClick = function(d){
    var country = d3.select(this).attr("id")
    console.log(country)

  }  
  // Draw the map
  svg.selectAll("*").remove()
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    .attr("id", function(d){return d.properties["name"]})
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        //console.log(countries)
        if(countries){
          if(countries.includes(d.properties["name"])){
            return colorScale(1500);
          }
          else if ( countries.includes("All"))
            return colorScale(1500);
          else return colorScale(5)
        }
        //console.log(d)
        //d.total = data.get(d.id) || 0;
        return colorScale(1500);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("mousemove", function(){return tooltip.style("top",
      (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");}) 
      .on("click", mouseClick)
}

}

category = "Families"

function updateDendrogram(category, hover_allowed = true,filtered_families=[]){
hover_allowed = true
if(filtered_families.length > 0) hover_allowed = false;
console.log(hover_allowed)

d3.json("static/"+ category+".json", function(error, data) {

  if (error) {
  throw error;}
  const root = tree(d3.hierarchy(data))
  .sort((a, b) => d3.ascending(a.data.name, b.data.name))
  svg1.selectAll("*").remove()
  path = svg1.append("g")
  .attr("fill", "none")
  .attr("stroke", "#fdd0a2")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
.selectAll("path")
.data(root.links())
.enter().append("path").transition().duration(200).attr("d", d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y));

svg1.append("g")
.selectAll("circle")
.data(root.descendants())
.enter().append("circle")
  .attr("transform", d => `
    rotate(${d.x * 180 / Math.PI - 90})
    translate(${d.y},0)
  `)
  .attr("fill", d => d.children ? "#e6550d" : "#fdae6b")
  .attr("r", 2.5);

svg1.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 8)
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 3)
  .selectAll("text")
  .data(root.descendants())
  .enter().append("text").attr("font-color", "#fdae6b").attr("class", "graph_path")
  .attr("transform", d => `
    rotate(${d.x * 180 / Math.PI - 90}) 
    translate(${d.y},0) 
    rotate(${d.x >= Math.PI ? 180 : 0})
  `)
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .text(d => d.data.name)
  .on("click", clickCategory)
  .on("mouseover", treehover)
  .on("mouseout", treeleave)
.clone(true).lower()
  .attr("stroke", "white");
if(hover_allowed == false){
  d3.selectAll(".graph_path")
  .transition()
  .duration(200)
  .style("opacity", .2)

  svg1.selectAll("text").attr('font-size', 10)
  d3.selectAll(".graph_path")
  .transition()
  .duration(200)
  .style("opacity", function(d){if(filtered_families.includes(d.data.name)) return 1;})
}    
});

}

currentCategory = ""

let clickCategory = function(){
  
  var category = d3.select(this).text()
  //console.log(category)
  if(currentCategory == category || category == "Families"){ 
    updateDendrogram("Families"); 
    updateChoropleth();
  }
  else if(["Africa", "Australia", "North America", "South America", "Eurasia", "Papunesia"].includes(category)){
    currentCategory = category;

  updateDendrogram(category, hover_allowed=true);
  updateChoropleth()
}

  else{
    updateDendrogram(currentCategory, hover_allowed=true)
    $.post("", {'data': 'get_info', "family":category}, function(data_infunc){
      data2 = JSON.parse(data_infunc.data)
        countries = data2[0]['Countries'].split('|')
        updateChoropleth(countries)
      });
 }

}  
var transform;

let treehover =  function(){
  d3.selectAll(".graph_path")
  .transition()
  .duration(200)
  .style("opacity", .2)

  svg1.selectAll("text").attr('font-size', 8)
  d3.select(this)
  .transition()
  .duration(200)
  .style("opacity", 1)
  .attr("font-size", 14)

}

let treeleave = function(){
  d3.selectAll(".graph_path")
  .transition()
  .duration(200)
  .style("opacity", 1)
  //console.log(transform)
  d3.select(this)
  .transition()
  .duration(200)
  .style("opacity", 1)
  .attr("font-size", 8)
}

svg1 = d3.select("#radial_dendrogram")
width = 900,
height = svg1.attr("height")
svg1 = svg1.append("g").attr("transform", "translate(" + (width / 2 ) + "," + (height / 2 + 25) + ")");


var radius = width/2 - 170

tree =d3.tree()
.size([2 * Math.PI, radius])
.separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

updateDendrogram("families")

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}


function scatterplot(onBrush) {
  var margin = { top: 10, right: 15, bottom: 40, left: 75 }
  var width = 600 - margin.left - margin.right
  var height = 350 - margin.top - margin.bottom

  var x = d3.scaleLinear()
      .range([0, width])
  var y = d3.scalePow().exponent(0.25)
      .range([height, 0])

  var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.format(''))
  var yAxis = d3.axisLeft()
      .scale(y)
      .tickFormat(d3.format(''))

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "#fff")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("tooltip");

  var brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on('start brush', function () {

          var selection = d3.event.selection

          //console.log(selection)
          

          var x0 = x.invert(selection[0][0])
          var x1 = x.invert(selection[1][0])
          var y0 = y.invert(selection[1][1])
          var y1 = y.invert(selection[0][1])

          //console.log(x0 + " " + x1 + " "  + y0 + " " + y1)


          onBrush(x0, x1, y0, y1)
      })

  var svg2 = d3.select('#scatterplot')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  

  var bg = svg2.append('g')
  var gx = svg2.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
  var gy = svg2.append('g')
      .attr('class', 'y axis')

  gx.append('text')
      .attr('x', width)
      .attr('y', 35)
      .style('text-anchor', 'end')
      .style('fill', '#000')
      .style('font-weight', 'bold')
      .text('Families')

  gy.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', -40)
      .style('text-anchor', 'end')
      .style('fill', '#000')
      .style('font-weight', 'bold')
      .text('Number of children languages')

  svg2.append('g')
      .attr('class', 'brush')
      .call(brush)

  return function update(data) {
    var colorScale = d3.scaleThreshold()
.domain([0,10, 100,500, 1000, 1600])
  .range(d3.schemeOranges[6]);

  console.log(d3.schemeOranges[6])
  
      x.domain(d3.extent(data, function (d) {  return d.index })).nice()
      y.domain(d3.extent(data, function (d) { return d.child_language_countName })).nice()

      gx.call(xAxis)
      gy.call(yAxis)

      var bgRect = bg.selectAll('rect')
          .data(d3.pairs(d3.merge([[y.domain()[0]], colorScale.domain(), [y.domain()[1]]])))
      bgRect.exit().remove()
      bgRect.enter().append('rect')
          .attr('x', 0)
          .attr('width', width)
          .merge(bgRect)
          .attr('y', function (d) { return y(d[1]) })
          .attr('height', function (d) { return y(d[0]) - y(d[1]) })
          .style('fill', function (d) { return colorScale(d[0]) })

      var circle = svg2.selectAll('circle')
          .data(data, function (d) { return d.name })
      circle.exit().remove()
      circle.enter().append('circle')
          .attr('r', 4)
          .style('stroke', '#fff')
          .merge(circle)
          .attr('cx', function (d) { return x(d.index) })
          .attr('cy', function (d) { return y(d.child_language_countName) })
          .style('fill', "#a63603")//function (d) { return colorScale(d.child_language_countName) })
          .style('opacity', function (d) { return d.filtered ? 0.2 : 1 })
          .style('stroke-width', '1px')//function (d) { return d.filtered ? 1 : 2 })
        .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d['Name']+ ", " +d.index + ", "+d.child_language_countName);})
      .on("mousemove", function(){return tooltip.style("top",
          (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
  }
}




//scatterplot()
updateChoropleth()
initialize(data)

function initialize(results) {

  var components = [
      //choropleth(features),
      scatterplot(onBrush)
  ]

  function update() {
       components.forEach(function (component) { component(data) })
  }


  function onBrush(x0, x1, y0, y1) {
      filtered_families = []
      var clear = x0 === x1 || y0 === y1
      data.forEach(function (d) {
          d.filtered = clear ? false : !(d.index < x0 || d.index > x1 || d.child_language_countName < y0 || d.child_language_countName > y1)
          if(d.filtered){
            filtered_families.push(d['Name'])
          }
      })
      

      
      update()

      countries = []
      if(clear) updateChoropleth();
      for(i =0; i <filtered_families.length; i++){
        $.post("", {'data': 'get_info', "family":filtered_families[i]}, function(data_infunc){
          data2 = JSON.parse(data_infunc.data)
            countrie = data2[0]['Countries'].split('|')
            countries = countries.concat(countrie)
            updateChoropleth(countries)
          });
  
      }

  }

  update()
}