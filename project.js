window.onload = function () {

	var slider = document.getElementById("myRange");
	var output = document.getElementById("demo");
	output.innerHTML = slider.value;
	var year = "2016";
	
	slider.oninput = function() {
		if (this.value == 2018) {
			output.innerHTML = "2020";
			year = "2020";
		}
		else {
			output.innerHTML = this.value;
			year = this.value;
		}
		Update();
	}

	var plotmargin = {top: 10, right: 50, bottom: 20, left: 30},
		plotwidth = 600 - plotmargin.left - plotmargin.right,
		plotheight = 250 - plotmargin.top - plotmargin.bottom;

	var x = d3.scale.linear().range([0, plotwidth]);
	var y = d3.scale.linear().range([plotheight, 0]);
	var r = d3.scale.linear().range([3.5,25]);

	var color = d3.scale.category20()

	var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-plotheight)
		.orient("bottom")

	var yAxis = d3.svg.axis()
		.scale(y)
		.tickSize(-plotwidth)
		.tickFormat(function(d) { return d + " %"})
		.orient("left");

	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10,0])
		.html(function(d) {
			return "<strong>Country:</strong> <span>" + d.Country + "</span>"; 
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
	  	});

	  	x.domain(d3.extent(data, function(d) { return d.GDP; })).nice();
	  	y.domain(d3.extent(data, function(d) { return d["Employment"]; })).nice();
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
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("id", function(d) { return d.Country; })
	      .attr("cx", function(d) { return x(d.GDP); })
	      .attr("cy", function(d) { return y(d["Employment"]); })
	      .attr("r", function(d) {return r(d.Population); })
	      .style("opacity", opacity)
	      .style("fill", function(d) { return color(d.Country); })
		  .on("mouseover", tip.show)
	      .on("mouseout", tip.hide);

	    function opacity(d) {
	    	if (d.Country != "NL") {
	    		return 0;
	    	}
	    }

		document.getElementById("mapcontainer").appendChild(xml.documentElement);

		var countries = ["#BE", "#NL", "#LU", "#FR", "#DE", "#IT", "#ES", "#PT",
						 "#AT", "#CZ", "#PL", "#SE", "#IE", "#DK", "#BG", "#EE",
						 "#GR", "#HR", "#CY", "#LV", "#LT", "#HU", "#MA", "#RO",
						 "#SI", "#SK", "#FI", "#IS"];

		for (i = 0; i <= countries.length - 1; i++) {
			country = d3.select("#mapcontainer").select(countries[i])
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
   			console.log(event.target.id);
			svg.select("#" + event.target.id)
   				.style("opacity", switcher);
		};

		function switcher(){
			
			console.log(svg.select("#FR")[0][0].style.opacity);

			if (svg.select("#" + event.target.id)[0][0].style.opacity == 1) {
				return 0;
			}
			else {
				return 1;
			}
		}

	}

	function Update() {

		// var DeleteMap = d3.selectAll

		var DeleteMap = d3.select("body").select("#mapcontainer");
		DeleteMap.selectAll("*").remove();

		var DeletePlot = d3.select("#plot").select("g");
		DeletePlot.selectAll("*").remove();

		queue()
			.defer(d3.xml, "europe.svg")
			.defer(d3.csv, "data/" + year + ".csv")
			.await(project);
	}

	test(year);

}



// selecting the whole file: data
// selecting a specific year: data[year]
// selecting a specific country in a specific year: data[year].country