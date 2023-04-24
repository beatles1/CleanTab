function cacheUnsplash(w, h) {
	if (window.navigator.onLine && window.XMLHttpRequest && w && h) {
		// Get Random photo from API
		var xmlhttp1;
		xmlhttp1=new XMLHttpRequest();
		xmlhttp1.onreadystatechange = function() {
			if (xmlhttp1.readyState==4 && xmlhttp1.status==200) {
				var data = xmlhttp1.responseText;
				var photoJSON = JSON.parse(data);

				// Cache photo
				var photoURL = photoJSON["urls"]["raw"]
				photoURL = photoURL + "&w=" + w

				var xmlhttp;
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState==4 && xmlhttp.status==200) {
						localStorage.setItem("unsplashCached", "data:image/jpeg;base64," + encode64(xmlhttp.responseText));

						localStorage.setItem("unsplashUserName", photoJSON["user"]["name"]);
						localStorage.setItem("unsplashUserURL", photoJSON["user"]["links"]["html"]);
					}
				}
				xmlhttp.open("GET", photoURL, true);
				xmlhttp.overrideMimeType('text/plain; charset=x-user-defined');
				xmlhttp.send();
			}
		}
		var o = "landscape"
		if (Math.abs(w - h) <  (w*0.1)) {
			o = "squarish"
		} else if (h > w) {
			o = "portrait"
		}
		xmlhttp1.open("GET","https://api.unsplash.com/photos/random/?client_id=FMW1rcXsHnhHmYehuiteTs2ZOsOcLvXiseaYvHIHpUs&orientation=" + o, true);
		// xmlhttp1.overrideMimeType('text/plain; charset=x-user-defined');
		xmlhttp1.send();
	}
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