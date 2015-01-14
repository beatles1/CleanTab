window.onload = function() {
	
	var useDefaultBGs = true;
	var useNotes = true;
	var useApps = true;
	var useClock = true;
	var useQuote = true;
	var keepQuote = true;
	
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
			
			if (options["quote"]) {
				document.getElementById("quote").style.display = "none";
				useQuote = false;
			}
			
			if (options["newQuote"]) {
				keepQuote = false;
			}
			
			if (options["defaultBG"]) {
				useDefaultBGs = false;
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
	
	var urls = {};
	urls = JSON.parse(localStorage.getItem("extraBGs"));
	if (urls) {
		var bg = Math.floor((Math.random() * (localBGs + urls.length)) + 1);
		if (!(useDefaultBGs) || (bg > localBGs)) {
			bg = bg - localBGs - 1;
			loadBG(urls[bg]);
		} else {
			loadBG(bg);
		}
	} else {
		loadBG(Math.floor((Math.random() * localBGs) + 1));
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
		if ((!keepQuote || (!quoteTime || quoteTime < d.getTime())) && window.navigator.onLine) {
			var xmlhttp;
			if (window.XMLHttpRequest){
				xmlhttp=new XMLHttpRequest();
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
					var data = xmlhttp.responseText;
					
					var quoteJSON = JSON.parse(data);
					var quote = '"'+ quoteJSON["quote"] +'" - '+ quoteJSON["author"];
					localStorage.setItem("quote", quote);
					
					displayQuote();
					
					d.setHours(24,0,0,0);
					localStorage.setItem("quoteTime", d.getTime());
				}
			}
			xmlhttp.open("GET","https://andruxnet-random-famous-quotes.p.mashape.com/cat=famous",true);
			xmlhttp.setRequestHeader("X-Mashape-Key", "K0tj7GVDTJmshC0R86WSEtc9oMNUp1KOCL6jsnYrlynLRg7NqW");
			xmlhttp.send();
		} else {
			displayQuote();
		}
	}
}