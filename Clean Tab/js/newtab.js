window.onload = function() {
	
	var useDefaultBGs = true;
	var useUnsplashBGs = true;
	var useNotes = true;
	var useApps = true;
	var useClock = true;
	var useAttr = true;
	
	// Options
	function applyOptions() {
		var options = {};
		options = JSON.parse(localStorage.getItem("options"));
		
		if (options) {
			if (options["apps"]) {
				document.getElementById("apps").style.display = "none";
				useApps = false;
			}
			
			if (options["clock"]) {
				document.getElementById("clock").style.display = "none";
				useClock = false;
			}
			
			if (options["search"]) {
				document.getElementById("searchForm").style.display = "none";
			}
			
			if (options["notes"]) {
				document.getElementById("pad").style.display = "none";
				useNotes = false;
			}
			
			if (options["options"]) {
				document.getElementById("options").style.display = "none";
			}
			
			if (options["attr"]) {
				document.getElementById("attr").style.display = "none";
				useAttr = false;
			}
			
			if (options["defaultBG"]) {
				useDefaultBGs = false;
			}
			
			if (options["unsplashBG"]) {
				useUnsplashBGs = false;
			}
		}
	}
	applyOptions()
	
	//Random Background
	var localBGs = 20;
	
	function loadBG(bg) {
		if ((bg) && (typeof bg == "number")) {
			document.body.style.background = "url('bg/"+ bg +".jpg')";
			document.body.style.backgroundSize = "cover";
		} else {
			document.body.style.background = "url('"+ bg +"')";
			document.body.style.backgroundSize = "cover";
		}
	}
	
	var extraBGs = {};
	extraBGs = JSON.parse(localStorage.getItem("extraBGs"));
	
	if (useUnsplashBGs && window.navigator.onLine && window.XMLHttpRequest) {bgType = "unsplash";}
	else if (extraBGs && extraBGs.length > 0 && window.navigator.onLine) {bgType = "extra";}
	else {bgType = "default";}
	
	if (bgType == "unsplash") {			// Load Unsplash Image
		if (localStorage.getItem("unsplashCached")) {
			loadBG(localStorage.getItem("unsplashCached"));
		} else {
			loadBG("https://source.unsplash.com/random/" + window.innerWidth + "x" + window.innerHeight);
		}
		
		cacheUnsplash(window.innerWidth, window.innerHeight);
		
	} else if (bgType == "default") {	// Load Local Image
		loadBG(Math.floor((Math.random() * localBGs) + 1));
		useAttr = false;
	} else if (bgType == "extra") {		// Load Manual Image
		var bg = Math.floor((Math.random() * (extraBGs.length)));
		loadBG(extraBGs[bg]);
		useAttr = false;
	}
	
	// Notes
	var noteDiv = document.getElementById("pad");
	if ((useNotes) && (noteDiv)) {
		
		function loadNotes() {
			var notes = localStorage.getItem("notes");
			noteDiv.textContent = notes;
		}
		loadNotes()
		
		function saveNotes() {
			var notes = noteDiv.textContent;
			if ((notes == "<br>") || (notes == "<div><br></div>")) { notes = "" }
			localStorage.setItem("notes", notes);
		}
		noteDiv.onkeyup = saveNotes;
		
	}
	
	
	// Clock
	if (useClock) {
		function updateClock() {
			var t = new Date();
			var h = checkZero(t.getHours());
			var m = checkZero(t.getMinutes());
			
			document.getElementById("clock").textContent = h +":"+ m;
		}
		
		function checkZero(i) {
			if (i<10) {i = "0" + i};
			return i;
		}
		updateClock()
		setInterval(updateClock, 500)
	}
	
	// Unsplash Attribution
	function displayAttr() {
		document.getElementById("unsplashLink").textContent = localStorage.getItem("unsplashUserName");
		document.getElementById("unsplashLink").href = localStorage.getItem("unsplashUserURL") + "?utm_source=CleanTab&utm_medium=referral";
	}
	
	if (useAttr) {
		displayAttr();
	} else {
		document.getElementById("attr").style.display = "none";
	}
}

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