function RemoveFromFavourite(user, pcat) {
	var soapMessage = '<?xml version="1.0" encoding="utf-8"?>';
	soapMessage += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	soapMessage += '<soap:Body>';
	soapMessage += '<DelFav xmlns="http://e-xim.dev/favwebservice/">';
	soapMessage += '<cntid>' + user + '</cntid>';
	soapMessage += '<pcatid>' + pcat + '</pcatid>';
	soapMessage += '</DelFav>';
	soapMessage += '</soap:Body>';
	soapMessage += '</soap:Envelope>';
	
	jq.ajax({
	url: '/SDMFav/SDMFavService.asmx?op=DelFav',
	type: "POST",
	dataType: "xml",
	data: soapMessage,
	contentType: "text/xml; charset=\"utf-8\"",
	success: function() {
		jq('[entity_id="' + pcat + '"]').attr("favService", "false");
		jq('[entity_id="' + pcat + '"]').attr("src", "/CAisd/sitemods/img/favourite_disable.png");
		jq('[entity_id="' + pcat + '"]').attr("alt", "Dodaj do ulubionych");
	},
	error: function(result) { alert(result.Status + " " + result.statusText); }
	});
 
	return false;
}

function AddAsFavourite(user, pcat) {
	var soapMessage = '<?xml version="1.0" encoding="utf-8"?>';
	soapMessage += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	soapMessage += '<soap:Body>';
	soapMessage += '<AddFav xmlns="http://e-xim.dev/favwebservice/">';
	soapMessage += '<cntid>' + user + '</cntid>';
	soapMessage += '<pcatid>' + pcat + '</pcatid>';
	soapMessage += '</AddFav>';
	soapMessage += '</soap:Body>';
	soapMessage += '</soap:Envelope>';
	
	jq.ajax({
	url: '/SDMFav/SDMFavService.asmx?op=AddFav',
	type: "POST",
	dataType: "xml",
	data: soapMessage,
	contentType: "text/xml; charset=\"utf-8\"",
	success: function() {
		jq('[entity_id="' + pcat + '"]').attr("favService", "true");
		jq('[entity_id="' + pcat + '"]').attr("src", "/CAisd/sitemods/img/favourite_enable.png");
		jq('[entity_id="' + pcat + '"]').attr("alt", "Usuń z ulubionych");
	},
	error: function(result) { alert(result.Status + " " + result.statusText); }
	});
 
	return false;
}