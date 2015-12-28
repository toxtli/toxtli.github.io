$(function() {
	$.getJSON('json/data.json', function(data){
		alert(data.picture);
		$('#Image_Profile').attr('src', data.picture);
	});
});