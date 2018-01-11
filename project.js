window.onload = function () {

	var slider = document.getElementById("myRange");
	var output = document.getElementById("demo");
	output.innerHTML = slider.value;	
	
	slider.oninput = function() {
		if (this.value == 2018) {
			output.innerHTML = "Target";
		}
		else {
			output.innerHTML = this.value;	
		}
	}
	
	queue()
		.defer(d3.xml, "europe.svg")
		.await(project);

	function project(error, xml) {

		if (error) throw error;

		document.body.appendChild(xml.documentElement);

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