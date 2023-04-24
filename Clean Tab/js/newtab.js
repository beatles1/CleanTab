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
	
	if (useUnsplashBGs && window.navigator.onLine && window.XMLHttpRequest) {bgType = "unsplash";}
	else if (extraBGs && extraBGs.length > 0 && window.navigator.onLine) {bgType = "extra";}
	else {bgType = "default";}
	
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
		useQuote = false;
	} else if (bgType == "extra") {		// Load Manual Image
		var bg = Math.floor((Math.random() * (extraBGs.length)));
		loadBG(extraBGs[bg]);
		useQuote = false;
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
	
	// Quotes
	function displayQuote() {
		document.getElementById("unsplashLink").textContent = localStorage.getItem("unsplashUserName");
		document.getElementById("unsplashLink").href = localStorage.getItem("unsplashUserURL") + "?utm_source=CleanTab&utm_medium=referral";
	}
	
	if (useQuote) {
		displayQuote();
	} else {
		document.getElementById("quote").style.display = "none";
	}
}