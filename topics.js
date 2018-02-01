function test(year, country) {

	d3.select("input[value=\"total\"]").property("checked", true);

	var margin = {top: 10, right: 10, bottom: 20, left: 10},
		width = 400 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var svg = d3.select("#topics").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")

	svg.append("g")
		.attr("class", "slices");

	var donutwidth = 300,
	    donutheight = 300,
		radius = Math.min(donutwidth, donutheight) / 2;

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3.svg.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.4);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	var legendRectSize = radius * 0.05;
	var legendSpacing = radius * 0.02;

	svg.attr("transform", "translate(" + donutwidth / 2 + "," + donutheight / 2 + ")");

	var colorRange = d3.scale.category20();
	var color = d3.scale.ordinal()
		.range(colorRange.range());

	var file;

	if (country != "EU") {
		file = "data/" + year + ".csv";
	}
	else {
		file = "data/EU.csv";
	};

	d3.csv(file, function(error, data) {
		if (error) throw error;

		if (file == "data/EU.csv") {
			data.forEach(function(d) {
				if (d.Year == year) {
					d.GDP = +d.GDP;
			    	d.Employment = +d.Employment;
			    	d.Asylum = +d.Asylum;
			    	d["R&D"] = +d["R&D"];
			    	d.Population = +d.Population;
			    	d.Emission = +d.Emission;
			    	d.Education = +d.Education;

					dataset = [
						{label:"Employment", value:d.Employment}, 
		        		{label:"R&D", value:d["R&D"]}, 
		        		{label:"Asylum", value:d.Asylum},
		        		{label:"Healthcare", value:d.Healthcare},
		        		{label:"Education", value:d.Education},
		        		{label:"Emission", value:d.Emission}
		        	];
				}
			})
		}
		else if (file == "data/" + year + ".csv") {
			data.forEach(function(d) {
				if (d.Country == country) {
					d.GDP = +d.GDP
					d.Employment = +d.Employment;
					d.Asylum = +d.Asylum;
					d["R&D"] = +d["R&D"];
					d.Population = +d.Population;
					d.Healthcare = +d.Healthcare;
					d.Emission = +d.Emission;
					d.Education = +d.Education;

					dataset = [
						{label:"Employment", value:d.Employment}, 
		        		{label:"R&D", value:d["R&D"]}, 
		        		{label:"Asylum", value:d.Asylum},
		        		{label:"Healthcare", value:d.Healthcare},
		        		{label:"Education", value:d.Education},
		        		{label:"Emission", value:d.Emission}
		        	];
				}
			})
		};

	    change(dataset);
	});

	function change(data) {

		/* ------- PIE SLICES -------*/
		var slice = svg.select(".slices").selectAll("path.slice")
	        .data(pie(data), function(d){ return d.data.label });

	    slice.enter()
	        .insert("path")
	        .style("fill", function(d) { return color(d.data.label); })
	        .style("opacity", 0.8)
	        .attr("class", "slice")
	        .attr("id", function(d) { return d.data.label; });

	    slice
	        .transition().duration(1000)
	        .attrTween("d", function(d) {
	            this._current = this._current || d;
	            var interpolate = d3.interpolate(this._current, d);
	            this._current = interpolate(0);
	            return function(t) {
	                return arc(interpolate(t));
	            };
	        })
	    slice
	        .on("click", function(d) {
	        	console.log(event.target.id);
	        	yTopic = event.target.id;
	        	Update();
	        });
	    slice
	        .on("mouseover", function(d) {
				d3.select(this)
					.style("opacity", 1);
	        });
	    slice
	    	.on("mouseout", function(d) {
			d3.select(this)
				.style("opacity", 0.8);	    		
	    	})

	    slice.exit()
	        .remove();

	    var legend = svg.selectAll('.legend')
	        .data(color.domain())
	        .enter()
	        .append('g')
	        .attr('class', 'legend')
	        .attr('transform', function(d, i) {
	            var height = legendRectSize + legendSpacing;
	            var offset =  height * color.domain().length / 2;
	            var horz = -3 * legendRectSize;
	            var vert = i * height - offset;
	            return 'translate(' + horz + ',' + vert + ')';
	        });

	    legend.append('rect')
	        .attr('width', legendRectSize)
	        .attr('height', legendRectSize)
	        .style('fill', color)
	        .style('stroke', color);

	    legend.append('text')
	        .attr('x', legendRectSize + legendSpacing)
	        .attr('y', legendRectSize - legendSpacing)
	        .text(function(d) { return d; });

	};

}