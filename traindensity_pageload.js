function genLineEntities(lineDataset)
{
	var lineEntitySource = $('#line-entity-wrapper-template').html();
	var lineEntityTemplate = Handlebars.compile(lineEntitySource);
	
	var lineCache = '';
	
	// IF no line entity exists: make line entity
	$.each(lineDataset, function(i, line)
	{
		var lineName = line["name"];
		var lineAlpha = lineName.charAt(0);
		
		if (lineName != lineCache)
		{
			// generate line entity and add it to correct alpha-sub-wrapper
			$('[data-char="' + lineAlpha + '"]').find('.line-entity-wrapper').append(lineEntityTemplate(line));
			
			lineCache = lineName;	// marks line as added
		}
		
	});
}

function genAlphaSubs(lineDataset)
{
	var alphaSubSource = $('#alpha-sub-wrapper-template').html();
	var alphaSubTemplate = Handlebars.compile(alphaSubSource);
	
	var alphaCache = 0;
	
	$.each(lineDataset, function(i, line)
	{
		var lineName = line["name"];
		var alphaCode = lineName.charCodeAt(0);
		
		if (alphaCode > alphaCache)
		{
			var alphaCodeObject = {"alphaCode": lineName.charAt(0)};		// handlebars requires assoc. array object
		
			// gen alphasubwrapper
			$('#line-select-wrapper').append(alphaSubTemplate(alphaCodeObject));
			
			alphaCache = alphaCode;		// marks alpha char as added
		}
	});
}

function colorAlternate(elementName)
{
	var i = 1;
	$.each($(elementName), function()
	{
		i % 2 == 0 ? $(this).addClass('light') : $(this).addClass('dark');
		i++;
	});
}


// PAGELOAD
$(function() {

	$.ajax({
		type: 'GET',
		url: '../api/get_trainlines.php',
		success: function(lineJSON) {			
		
			genAlphaSubs(lineJSON);
			genLineEntities(lineJSON);

			colorAlternate('.line-entity');	
			colorAlternate('.alpha-sub-wrapper');
			
			$.each(lineJSON, function(i, line) {		
				
			});
		}
	});
	
});