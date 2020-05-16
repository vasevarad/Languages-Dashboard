
// The svg
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
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeReds[6]);

// Load external data and boot

console.log("maphere")
d3.queue()
  .defer(d3.json, "static/world.geojson")
  .defer(d3.csv, "static/world_population.csv", function(d) { data.set(d.code, +d.pop); })
  .await(ready);

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
  }

  let mouseClick = function(d){
    var country = d3.select(this).attr("id")
    console.log(country)

  }  
  // Draw the map
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
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click", mouseClick)
}





/*

 svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));
  
  svg.append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");




*/




//radial dendrogram
/*
var svg = d3.select("#radial_dendrogram"),
    width = +svg.attr("width"),
    height = +svg.attr("height")
var g = svg.append("g").attr("transform", "translate(" + (width / 2 - 15) + "," + (height / 2 + 25) + ")");

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });
*/

let clickCategory = function(d){
  var country = d3.select(this).text()
  console.log(country)

}  


svg1 = d3.select("#radial_dendrogram")
width = svg1.attr("width"),
height = svg1.attr("height")
svg1 = svg1.append("g").attr("transform", "translate(" + (width / 2 ) + "," + (height / 2 + 25) + ")");

var radius = width/2 - 150
console.log("radius:" + radius)
/*var tree = d3.tree()
.size([2 * Math.PI, radius])
.separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)*/
tree =d3.tree()
.size([2 * Math.PI, radius])
.separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

console.log("here1")
d3.json("static/families.json", function(error, data) {
  if (error) {
  throw error;}
  console.log(data)
  const root = tree(d3.hierarchy(data))
  .sort((a, b) => d3.ascending(a.data.name, b.data.name))
  path = svg1.append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
.selectAll("path")
.data(root.links())
.enter().append("path").attr("d", d3.linkRadial()
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
  .attr("fill", d => d.children ? "#555" : "#999")
  .attr("r", 2.5);

svg1.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 3)
.selectAll("text")
.data(root.descendants())
.enter().append("text")
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
.clone(true).lower()
  .attr("stroke", "white");
 /* THIS WORKS
  svg.style("background-color", "black")
      .style("width", "100%")
      .style("height", "auto")
      .style("padding", "10px")
      .style("box-sizing", "border-box")
      .style("font", "10px sans-serif");
  
  const g = svg.append("g");

  const root = tree(d3.hierarchy(data)
  .sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name)));
 
    
  const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .enter().append("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));

 
  
  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants().reverse())
    .enter().append("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);
  
  node.append("circle")
      .attr("fill", d => d.children ? "red" : "blue")
      .attr("r", 2.5);
  
  
  document.body.appendChild(svg.node());

  */
/*
  const box = g.node().getBBox();

  svg.remove()
      .attr("width", box.width)
      .attr("height", box.height)
      .attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);

 /* data = d3.hierarchy(data)
  .sort((a, b) => d3.ascending(a.data.name, b.data.name))
  const root = tree(data) 

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));
  
  svg.append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");
/*
  svg.append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
.selectAll("path")
.data(root.links())
.join("path")
  .attr("d", d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y));

svg.append("g")
.selectAll("circle")
.data(root.descendants())
.join("circle")
  .attr("transform", d => `
    rotate(${d.x * 180 / Math.PI - 90})
    translate(${d.y},0)
  `)
  .attr("fill", d => d.children ? "#555" : "#999")
  .attr("r", 2.5);

svg.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 3)
.selectAll("text")
.data(root.descendants())
.join("text")
  .attr("transform", d => `
    rotate(${d.x * 180 / Math.PI - 90}) 
    translate(${d.y},0) 
    rotate(${d.x >= Math.PI ? 180 : 0})
  `)
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .text(d => d.data.name)
.clone(true).lower()
  .attr("stroke", "white");
  /*
  var root = tree(stratify(data)
      .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); }));

  var link = g.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
      });

  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

  node.append("circle")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", ".31em")
      .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
      .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
      .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
      .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });*/
      
});

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}



//sunburst
/*
var width = 960,
    height = 700,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

var y = d3.scaleSqrt()
    .range([0, radius]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var partition = d3.partition();

var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });


var svg = d3.select("#radial_dendrogram")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

d3.json("static/languages.json", function(error, root) {
  if (error) throw error;
  root = d3.hierarchy(root); 
  console.log(partition(root).descendants())
  root.sum(function(d) { return d.value? 1: 0; });
  svg.selectAll("path")
      .data(partition(root).descendants())
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { val =  color((d.children ? d : d.parent).data.name);  return val; })
      .on("click", click)
    .append("title")
      .text(function(d) { return d.data.name ; });
});

function click(d) {
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
}

d3.select(self.frameElement).style("height", height + "px");
*/