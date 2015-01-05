window.onload = function() {
	
	var useDefaultBGs = true;
	var useNotes = true;
	var useApps = true;
	var useClock = true;
	
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
				document.getElementById("padCon").style.display = "none";
				useNotes = false;
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
}

function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback.call(this, dataURL);
        canvas = null; 
    };
    img.src = url;
}