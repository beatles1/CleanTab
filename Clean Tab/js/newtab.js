window.onload = function() {
	
	var useDefaultBGs = true;
	var useUnsplashBGs = true;
	var useNotes = true;
	var useApps = true;
	var useClock = true;
	var useQuote = true;
	var quoteCat = "";
	
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
			
			if (options["quote"]) {
				document.getElementById("quote").style.display = "none";
				useQuote = false;
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
	
	var bgTypes = [];
	if (useUnsplashBGs && window.navigator.onLine && window.XMLHttpRequest) {bgTypes.push("unsplash");}
	if (useDefaultBGs) {bgTypes.push("default");}
	if (extraBGs && extraBGs.length > 0 && window.navigator.onLine) {bgTypes.push("extra");}
	var bgType = bgTypes[Math.floor(Math.random() * bgTypes.length)];
	
	if (bgType == "unsplash") {			// Load Unsplash Image
		if (localStorage.getItem("unsplashCached")) {
			loadBG(localStorage.getItem("unsplashCached"));
		} else {
			loadBG("https://source.unsplash.com/random/" + window.innerWidth + "x" + window.innerHeight);
		}
		
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				localStorage.setItem("unsplashCached", "data:image/jpeg;base64," + encode64(xmlhttp.responseText));
			}
		}
		xmlhttp.open("GET","https://source.unsplash.com/random/" + window.innerWidth + "x" + window.innerHeight, true);
		xmlhttp.overrideMimeType('text/plain; charset=x-user-defined');
		xmlhttp.send();
		
	} else if (bgType == "default") {	// Load Local Image
		loadBG(Math.floor((Math.random() * localBGs) + 1));
	} else if (bgType == "extra") {		// Load Manual Image
		var bg = Math.floor((Math.random() * (extraBGs.length)));
		loadBG(extraBGs[bg]);
	}
	
	// Notes
	var noteDiv = document.getElementById("pad");
	if ((useNotes) && (noteDiv)) {
		
		function loadNotes() {
			var notes = localStorage.getItem("notes");
			noteDiv.innerHTML = notes;
		}
		loadNotes()
		
		function saveNotes() {
			var notes = noteDiv.innerHTML;
			if ((notes == "<br>") || (notes == "<div><br></div>")) { notes = "" }
			localStorage.setItem("notes", notes);
		}
		noteDiv.onkeyup = saveNotes;
		
	}
	
	// Apps link
	if (useApps) {
		document.getElementById("apps").addEventListener("click", function(){
			chrome.tabs.update({
				url:"chrome://apps"
			});
		});
	}
	
	
	// Clock
	if (useClock) {
		function updateClock() {
			var t = new Date();
			var h = checkZero(t.getHours());
			var m = checkZero(t.getMinutes());
			
			document.getElementById("clock").innerHTML = h +":"+ m;
		}
		
		function checkZero(i) {
			if (i<10) {i = "0" + i};
			return i;
		}
		updateClock()
		setInterval(updateClock, 500)
	}
	
	// Quotes
	function displayQuote() {
		var quote = localStorage.getItem("quote");
		document.getElementById("quote").innerHTML = quote;
	}
	
	if (useQuote) {
		var d = new Date();
		var quoteTime = localStorage.getItem("quoteTime");
		if ((!quoteTime || quoteTime < d.getTime()) && window.navigator.onLine && window.XMLHttpRequest) {
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
						
						displayQuote();
						
						d.setHours(24,0,0,0);
						localStorage.setItem("quoteTime", d.getTime());
					} else {
						displayQuote();
					}
				}
			}
			xmlhttp.open("GET","https://beatles1-forismatic-quotes-v1.p.mashape.com/?method=getQuote&format=json&lang=en", true);
			xmlhttp.setRequestHeader("X-Mashape-Authorization", "K0tj7GVDTJmshC0R86WSEtc9oMNUp1KOCL6jsnYrlynLRg7NqW");
			xmlhttp.send();
		} else {
			displayQuote();
		}
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