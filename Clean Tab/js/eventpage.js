browser.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install"){
		localStorage.setItem("quote", "Welcome to Clean Tab!");
	}
});

function cacheUnsplash(w, h) {
	if (window.navigator.onLine && window.XMLHttpRequest && w && h) {
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				localStorage.setItem("unsplashCached", "data:image/jpeg;base64," + encode64(xmlhttp.responseText));
			}
		}
		xmlhttp.open("GET","https://source.unsplash.com/random/" + w + "x" + h, true);
		xmlhttp.overrideMimeType('text/plain; charset=x-user-defined');
		xmlhttp.send();
	}
}

function loadQuote() {
	var d = new Date();
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var data = xmlhttp.responseText;
			
			var quoteJSON = JSON.parse(data);
			if (typeof quoteJSON["error"] === 'undefined') {
				
				var quote = '"'+ quoteJSON["quoteText"] +'"';
				if (quoteJSON["quoteAuthor"] && quoteJSON["quoteAuthor"] != "") {
					quote += ' - '+ quoteJSON["quoteAuthor"];
				}
				localStorage.setItem("quote", quote);
				
				d.setHours(23,0,0,0);
				localStorage.setItem("quoteTime", d.getTime());
			}
		}
	}
	xmlhttp.open("GET","https://beatles1-forismatic-quotes-v1.p.rapidapi.com/?method=getQuote&format=json&lang=en", true);
	xmlhttp.setRequestHeader("x-rapidapi-key", "K0tj7GVDTJmshC0R86WSEtc9oMNUp1KOCL6jsnYrlynLRg7NqW");
	xmlhttp.send();
}

function encode64(inputStr) 
{
   var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var outputStr = "";
   var i = 0;
   
   while (i<inputStr.length)
   {
      //all three "& 0xff" added below are there to fix a known bug 
      //with bytes returned by xhr.responseText
      var byte1 = inputStr.charCodeAt(i++) & 0xff;
      var byte2 = inputStr.charCodeAt(i++) & 0xff;
      var byte3 = inputStr.charCodeAt(i++) & 0xff;

      var enc1 = byte1 >> 2;
      var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
	  
	  var enc3, enc4;
	  if (isNaN(byte2))
	   {
		enc3 = enc4 = 64;
	   }
	  else
	  {
      	enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
		if (isNaN(byte3))
		  {
           enc4 = 64;
		  }
		else
		  {
	      	enc4 = byte3 & 63;
		  }
	  }

      outputStr +=  b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
   } 
   
   return outputStr;
}