window.onload = function () {

	var slider = document.getElementById("myRange");
	var output = document.getElementById("demo");
	output.innerHTML = slider.value;	
	
	slider.oninput = function() {
		if (this.value == 2018) {
			output.innerHTML = "2020";
		}
		else {
			output.innerHTML = this.value;
		}
	}

	var plotmargin = {top: 50, right: 400, bottom: 150, left: 100},
		plotwidth = 1400 - plotmargin.left - plotmargin.right,
		plotheight = 600 - plotmargin.top - plotmargin.bottom;

	var x = d3.scale.linear().range([0, plotwidth]);
	var y = d3.scale.linear().range([plotheight, 0]);
	var r = d3.scale.linear().range([3.5,50]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-plotheight)
		.orient("bottom")

	var yAxis = d3.svg.axis()
		.scale(y)
		.tickSize(-plotwidth)
		.tickFormat(function(d) { return d + " %"})
		.orient("left");

	var svg = d3.select("body").append("svg")
		.attr("width", plotwidth + plotmargin.left + plotmargin.right)
		.attr("height", plotheight + plotmargin.top + plotmargin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + plotmargin.left + "," + plotmargin.top + ")");
	
	queue()
		.defer(d3.xml, "europe.svg")
		.defer(d3.json, "data/employment.json")
		.defer(d3.json, "data/GDPperCapita.json")
		.defer(d3.csv, "data/population.csv")
		.await(project);

	function project(error, xml, employment, GDP, population) {

		if (error) throw error;

		x.domain(d3.extent(GDP, function(d) { return d[2016]; })).nice();
		y.domain(d3.extent(employment, function(d) { return d[2016]; })).nice();
		r.domain(d3.extent(population, function(d) { return d.Population; })).nice();

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + plotheight + ")")
			.call(xAxis)
		  .append("text")
		  	.attr("class", "label")
		  	.attr("x", plotwidth)
		  	.attr("y", -6)
		  	.style("text-anchor", "end")
		  	.text("GDP per Capita");

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  .append("text")
		  	.attr("class", "label")
	      	.attr("transform", "rotate(-90)")
	      	.attr("y", 6)
	      	.attr("dy", ".71em")
	      	.style("text-anchor", "end")
	      	.text("category")

	    svg.selectAll(".dot")
	    	.data(employment, GDP, population)
	      .enter().append("circle")
	      	.attr("class", "dot")
	      	.attr("cx", function(d) { return x(d)})

		document.getElementById("mapcontainer").appendChild(xml.documentElement);

		var countries = ["#BE", "#NL", "#LU", "#FR", "#DE", "#IT", "#ES", "#PT",
						 "#AT", "#CZ", "#PL", "#SE", "#IE", "#DK", "#BG", "#EE",
						 "#GR", "#HR", "#CY", "#LV", "#LT", "#HU", "#MA", "#RO",
						 "#SI", "#SK", "#FI", "#IS"];

		for (i = 0; i <= countries.length - 1; i++) {
			country = d3.select(countries[i])
			.attr("stroke", "white")
			.attr("fill", "rgba(0, 0, 153, 1)");
		}
	}
}



// selecting the whole file: data
// selecting a specific year: data[year]
// selecting a specific country in a specific year: data[year].country