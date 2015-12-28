$(function() {
	$.getJSON('json/data.json', function(data){
		alert(JSON.stringify(data));
	});
});