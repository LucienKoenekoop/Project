window.onload = function () {
	
	queue()
		.defer(d3.xml, "europe.svg")
		.await(project);

	function project(error, xml) {

		if (error) throw error;

		document.body.appendChild(xml.documentElement);
	}
}