var xTopic = "GDP";
var yTopic = "Employment";
var Update;

window.onload = function () {

	var slider = document.getElementById("myRange");
	var output = document.getElementById("demo");
	var output2 = document.getElementById("demo2");
	var button = document.getElementById("button");
	output.innerHTML = slider.value;
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
	
	slider.oninput = function() {
		output.innerHTML = this.value;
		year = this.value;
		
		Update();
	}

	d3.selectAll(".c").on("click", function() { 
		xTopic = this.getAttribute("value");
		button.innerHTML = this.getAttribute("value");
		Update();
	});

	d3.select("#show").on("click", function() {
		svg.selectAll(".dot").style("opacity", 1);
		for (i = 0; i < countries.length; i++) {
			active.push(countries[i])
		};
		console.log(active);
	});

	d3.select("#hide").on("click", function() {
		svg.selectAll(".dot").style("opacity", 0);
		active = [];
		console.log(active);
	});

	var plotmargin = {top: 10, right: 30, bottom: 20, left: 50},
		plotwidth = 600 - plotmargin.left - plotmargin.right,
		plotheight = 250 - plotmargin.top - plotmargin.bottom;

	var x = d3.scale.linear().range([0, plotwidth]);
	var y = d3.scale.linear().range([plotheight, 0]);
	var r = d3.scale.linear().range([3.5,25]);

	var color = d3.scale.category20()

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

	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10,0])
		.html(function(d) {
			if (this.style.opacity != 0 ) {
				return "<strong>Country:</strong> <span>" + d.Country + "</span>";
			}
		})

	var svg = d3.select("body").select("#plot").append("svg")
		.attr("width", plotwidth + plotmargin.left + plotmargin.right)
		.attr("height", plotheight + plotmargin.top + plotmargin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + plotmargin.left + "," + plotmargin.top + ")");

	svg.call(tip);
	
	queue()
		.defer(d3.xml, "europe.svg")
		.defer(d3.csv, "data/" + year + ".csv")
		.await(project);


	function project(error, xml, data) {

		if (error) throw error;

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

	  	x.domain(d3.extent(data, function(d) { return d[xTopic]; })).nice();
	  	y.domain(d3.extent(data, function(d) { return d[yTopic]; })).nice();
	  	r.domain(d3.extent(data, function(d) { return d.Population; })).nice()

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

	    function opacity(d) {
	    	if (d.Country == "NL") {
	    		return 1;
	    	}
	    	else if (active.indexOf(d.Country) > -1) {
	    		return 1;
	    	}
	    	else {
	    		return 0;
	    	}
	    }


	    output2.innerHTML = currentcounrty;

		document.getElementById("mapcontainer").appendChild(xml.documentElement);

		for (i = 0; i <= countries.length - 1; i++) {
			country = d3.select("#mapcontainer").select("#" + countries[i])
			.attr("stroke", "white")
			.attr("fill", "rgba(0, 0, 153, 1)")
			.style("opacity", 0.7)
			.on("mouseover", hover)
			.on("mouseout", out)
			.on("click", click);
		}

		function hover() {
			d3.select(this)
				.style("opacity", 1);
		};

		function out() {
			d3.select(this)
				.style("opacity", 0.7);
		};

		function click() {
   			console.log(svg.selectAll(".dot"));
   			currentcounrty = event.target.id;
			svg.select("#" + event.target.id)
   				.style("opacity", switcher);
   			
   			var DeleteTopcis = d3.select("#topics").select("svg");
			DeleteTopcis.remove();

			i = countries.indexOf(currentcounrty);
			if (i > -1) {
				output2.innerHTML = Countries[i];
			};
   			
   			test(year, currentcounrty);

		};

		function switcher() {

			if (svg.select("#" + event.target.id)[0][0].style.opacity == 1) {
				index = active.indexOf(event.target.id);
				if (index > -1) {
					active.splice(index, 1);
				}
				return 0;
			}
			else {
				active.push(event.target.id);
				return 1;
			}
		}

		test(year, currentcounrty);	

	};

	Update = function() {

		var DeleteMap = d3.select("body").select("#mapcontainer");
		DeleteMap.selectAll("*").remove();

		var DeletePlot = d3.select("#plot").selectAll("g");
		DeletePlot.selectAll("*").remove();

		var DeleteTopcis = d3.select("#topics").selectAll("svg");
		DeleteTopcis.remove();

		queue()
			.defer(d3.xml, "europe.svg")
			.defer(d3.csv, "data/" + year + ".csv")
			.await(project);
	}

}

