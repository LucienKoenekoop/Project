// Definition of some global variables also shared by the topics.js file
var xTopic = "GDP";
var yTopic = "Employment";
var Update;

window.onload = function () {

	// Definition of some local variables used throughout the scope of this file
	var slider = document.getElementById("myRange");
	var output = document.getElementById("demo");
	var output2 = document.getElementById("demo2");
	var button = document.getElementById("button");
	var year = "2016";
	var currentcounrty = "EU";
	var active = [];
	var index;
	var countries = ["BE", "NL", "LU", "FR", "DE", "IT", "ES", "PT",
					 "AT", "CZ", "PL", "SE", "IE", "DK", "BG", "EE",
					 "GR", "HR", "CY", "LV", "LT", "HU", "MA", "RO",
					 "SI", "SK", "FI", "IS"];
	var Countries = ["Belgium", "Netherlands", "Luxembourg", "France", "Germany", "Italy",
					 "Spain", "Portugal", "Austria", "Czech Republic", "Poland", "Sweden",
					 "Ireland", "Denmark", "Bulgaria", "Estonia", "Greece", "Croatia", 
					 "Cyprus", "Latvia", "Lithuania", "Hungary", "Malta", "Romania",
					 "Slovenia", "Slovakia", "Finland", "Iceland"];
	
	// Changes slider output and updates after the slider is changed
	output.innerHTML = slider.value;
	slider.oninput = function() {
		output.innerHTML = this.value;
		year = this.value;
		
		Update();
	}

	// Changes dropdown output and updates after the a dropdown topic is clicked
	d3.selectAll(".c").on("click", function() { 
		xTopic = this.getAttribute("value");
		button.innerHTML = this.getAttribute("value");
		Update();
	});

	// Shows all countries and stores all countries
	d3.select("#show").on("click", function() {
		svg.selectAll(".dot").style("opacity", 1);
		for (i = 0; i < countries.length; i++) {
			active.push(countries[i]);
		};
	});

	// Hides all countries and discards all countries
	d3.select("#hide").on("click", function() {
		svg.selectAll(".dot").style("opacity", 0);
		active = [];
	});

	// Definitions for the scatterplot variables
	var plotmargin = {top: 10, right: 30, bottom: 20, left: 50},
		plotwidth = 600 - plotmargin.left - plotmargin.right,
		plotheight = 250 - plotmargin.top - plotmargin.bottom;

	var x = d3.scale.linear().range([0, plotwidth]);
	var y = d3.scale.linear().range([plotheight, 0]);
	var r = d3.scale.linear().range([3.5,25]);

	var color = d3.scale.category20();

	// Appends the axes
	var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-plotheight)
		.tickFormat(function(d) { return d + "%"})
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.tickSize(-plotwidth)
		.tickFormat(function(d) { return d + " %"})
		.orient("left");

	// Creates a tooltip for when hovering over a visible country dot
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10,0])
		.html(function(d) {
			if (this.style.opacity != 0 ) {
				return "<strong>Country:</strong> <span>" + d.Country + "</span>";
			};
		});

	// Appends the svg for the scatterplot
	var svg = d3.select("body").select("#plot").append("svg")
		.attr("width", plotwidth + plotmargin.left + plotmargin.right)
		.attr("height", plotheight + plotmargin.top + plotmargin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + plotmargin.left + "," + plotmargin.top + ")");

	svg.call(tip);
	
	// Queues the data files for the main function
	queue()
		.defer(d3.xml, "../data/europe.svg")
		.defer(d3.csv, "../data/" + year + ".csv")
		.await(project);

	// function for drawing the scatterplot and the europe map
	function project(error, xml, data) {

		// Error checking if files are correctly loaded
		if (error) throw error;

		// Converts all stated values into integers
		data.forEach(function(d) {
	    	d.GDP = +d.GDP;
	    	d.Employment = +d.Employment;
	    	d.Asylum = +d.Asylum;
	    	d["R&D"] = +d["R&D"];
	    	d.Population = +d.Population;
	    	d.Healthcare = +d.Healthcare;
	    	d.Emission = +d.Emission;
	    	d.Education = +d.Education;
	  	});

		// Defines the domains with the loaded data
	  	x.domain(d3.extent(data, function(d) { return d[xTopic]; })).nice();
	  	y.domain(d3.extent(data, function(d) { return d[yTopic]; })).nice();
	  	r.domain(d3.extent(data, function(d) { return d.Population; })).nice();

	  	// Appends the axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + plotheight + ")")
			.call(xAxis)
		  .append("text")
		  	.attr("class", "label")
		  	.attr("x", plotwidth)
		  	.attr("y", -6)
		  	.style("text-anchor", "end")
		  	.text(xTopic);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  .append("text")
		  	.attr("class", "label")
	      	.attr("transform", "rotate(-90)")
	      	.attr("y", 6)
	      	.attr("dy", ".71em")
	      	.style("text-anchor", "end")
	      	.text(yTopic);

	    // Appends the country dots, and implements the tooltip functionality
		svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("id", function(d) { return d.Country; })
	      .attr("cx", function(d) { return x(d[xTopic]); })
	      .attr("cy", function(d) { return y(d[yTopic]); })
	      .attr("r", function(d) {return r(d.Population); })
	      .style("opacity", opacity)
	      .style("fill", function(d) { return color(d.Country); })
		  .on("mouseover", tip.show)
	      .on("mouseout", tip.hide);

	    // Function to only show currently selected country dots,
	    // and only shows the Netherlands as starting default
	    function opacity(d) {
	    	if (d.Country == "NL") {
	    		return 1;
	    	}
	    	else if (active.indexOf(d.Country) > -1) {
	    		return 1;
	    	}
	    	else {
	    		return 0;
	    	};
	    };

	    // Turns current country 2 letter id into full country name and outputs this to html,
	    // except if current country is EU
	    if (currentcounrty == "EU") {
	    	output2.innerHTML = currentcounrty;
	    }
	    else {
			i = countries.indexOf(currentcounrty);
			if (i > -1) {
				output2.innerHTML = Countries[i];
			};
	    };

	    // Draws the map
		document.getElementById("mapcontainer").appendChild(xml.documentElement);

		// Colors only the EU countries and implies mouse event functionalities
		for (i = 0; i <= countries.length - 1; i++) {
			country = d3.select("#mapcontainer").select("#" + countries[i])
			.attr("stroke", "white")
			.attr("fill", "rgba(0, 0, 153, 1)")
			.style("opacity", 0.7)
			.on("mouseover", hover)
			.on("mouseout", out)
			.on("click", click);
		}

		// Map country hover heightens opacity
		function hover() {
			d3.select(this)
				.style("opacity", 1);
		};

		// Restores country opacity
		function out() {
			d3.select(this)
				.style("opacity", 0.7);
		};

		// When clicking a country shows/hides country from the scatterplot,
		// updates the donut chart for that specific country and
		// stores/discards that country
		function click() {
   			currentcounrty = event.target.id;
			svg.select("#" + event.target.id)
   				.style("opacity", switcher);
   			
   			var DeleteTopcis = d3.select("#topics").select("svg");
			DeleteTopcis.remove();

			i = countries.indexOf(currentcounrty);
			if (i > -1) {
				output2.innerHTML = Countries[i];
			};
   			
   			// function to draw the donut chart
   			test(year, currentcounrty);

		};

		// Function for switching the opacity of the country dots and updating
		// the stored countries
		function switcher() {

			if (svg.select("#" + event.target.id)[0][0].style.opacity == 1) {
				index = active.indexOf(event.target.id);
				if (index > -1) {
					active.splice(index, 1);
				};
				return 0;
			}
			else {
				active.push(event.target.id);
				return 1;
			};
		};

		test(year, currentcounrty);	

	};

	// Function that deletes all visualizations and redraws them with current (new) input
	Update = function() {

		var DeleteMap = d3.select("body").select("#mapcontainer");
		DeleteMap.selectAll("*").remove();

		var DeletePlot = d3.select("#plot").selectAll("g");
		DeletePlot.selectAll("*").remove();

		var DeleteTopcis = d3.select("#topics").selectAll("svg");
		DeleteTopcis.remove();

		queue()
			.defer(d3.xml, "../data/europe.svg")
			.defer(d3.csv, "../data/" + year + ".csv")
			.await(project);
	};

}

