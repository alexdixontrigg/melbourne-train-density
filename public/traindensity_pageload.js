function genLineEntities(lineDataset, socket)
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

	LEBehaviorBinder();
	LEUpdateSocketBinder(socket);
}

// generates the alphabet label divs, into which line entities are sorted
function genAlphaSubs(lineDataset)
{
	var alphaSubSource = $('#alpha-sub-wrapper-template').html();
	var alphaSubTemplate = Handlebars.compile(alphaSubSource);
	
	var alphaCache = -1;
	
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

// assigns to a class of divs a subclass .light/.dark, alternately
function colorAlternate(elementName)
{
	var i = 1;
	$.each($(elementName), function()
	{
		i % 2 == 0 ? $(this).addClass('light') : $(this).addClass('dark');
		i++;
	});
}

// this *should* only need to be called once
function LEUpdateSocketBinder(socket)
{
	$('.line-entity').click(function(e)
	{
		nsp = String('/' + $(this).data('id'));
		if (nsp != null)
		{
			updateSocket(socket, nsp);
		}
	});
}

// changes socket to new namespace nsp, and rebinds generalized socket behavior
function updateSocket(socket, nsp)
{
	socket = io(nsp);
	socketBehaviorBinder(socket);
}

// this has to be called *every time* the socket is redefined with io()
function socketBehaviorBinder(socket)
{
	socket.on('connect', function()
	{
		console.log('connected on socket ' + socket.id);
	});
}

// binds to each line-entity all the behaviors that only need to be assigned once, at initialization
function LEBehaviorBinder()
{
	$('.line-entity').click(function(e)
	{
		LEExpandCollapseBinder($(this));
		//localStorage.setItem("favourite", $(this).attr('data-id'));
	});
}

function LEExpandCollapseBinder(line_entity)
{
	if (line_entity.hasClass('expanded'))
	{
		line_entity.height(200);
		line_entity.addClass('expanded');
	} else {
		line_entity.height(60);
		line_entity.removeClass('expanded');
	}
}

function highlightFavourite()
{
	var favouriteID = localStorage.getItem("favourite");
	$('[data-id="' + favouriteID + '"]').css('background-color', '#a0c5de');
}

// PAGELOAD
$(function() {

	var socket = io();

	
	socket.on('init_data', function(data)
	{
		genAlphaSubs(data);
		genLineEntities(data, socket);
		
		colorAlternate('.line-entity');
		colorAlternate('.alpha-sub-wrapper');

		console.log(data);
	});

	var searchbuffer = '';

	$('#search-filter').on('input', function(event)
	{
		var searchterm = $('#search-filter').val();
		if (searchterm != searchbuffer)
		{
			console.log(searchterm);
		}
		searchbuffer = searchterm;
	});

	
});

