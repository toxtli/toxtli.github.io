$(function() {
	$.getJSON('json/data.json', function(data){
		$('#Image_Profile').attr('src', data.picture);
	});
});