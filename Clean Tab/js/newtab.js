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
	if (useDefaultBGs || !window.navigator.onLine) {bgTypes.push("default");}
	if (extraBGs && extraBGs.length > 0 && window.navigator.onLine) {bgTypes.push("extra");}
	var bgType = bgTypes[Math.floor(Math.random() * bgTypes.length)];
	
	if (bgType == "unsplash") {			// Load Unsplash Image
		if (localStorage.getItem("unsplashCached")) {
			loadBG(localStorage.getItem("unsplashCached"));
		} else {
			loadBG("https://source.unsplash.com/random/" + window.innerWidth + "x" + window.innerHeight);
		}
		
		browser.runtime.getBackgroundPage(function(bp) {
			if (bp) {
				bp.cacheUnsplash(window.innerWidth, window.innerHeight);
			};
		});
		
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
		displayQuote();
		var d = new Date();
		var quoteTime = localStorage.getItem("quoteTime");
		if ((!quoteTime || quoteTime < d.getTime()) && window.navigator.onLine && window.XMLHttpRequest) {
			browser.runtime.getBackgroundPage(function(bp) {
				if (bp) {
					bp.loadQuote();
				};
			});
		}
	}
}