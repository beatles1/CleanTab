var avaliableOptions = ["clock", "search", "notes", "quote", "options", "defaultBG", "unsplashBG"];

window.onload = function() {
	
	function saveOptions() {
		var options = {};
		
		for (var i = 0; i < avaliableOptions.length; i++) {
			var id = avaliableOptions[i];
			var elem = document.getElementById(id +"Opt");
			if (elem) {
				var val = elem.checked;
				if (typeof val != "undefined") {
					options[id] = val
				}
			}
		}
		
		var extraElem = document.getElementById("extraURLs");
		if (extraElem) {
			var urls = extraElem.value.split(",");
			
			if (urls[0] == "") { urls = []; }
			
			var valid = true;
			for (var i = 0; i < urls.length; i++) {
				if ((urls[i].length > 1) && (urls[i].indexOf("http") == -1)) {
					valid = false;
					break;
				} else {
					urls[i] = urls[i].trim();
				}
			}
			
			if (valid) {
				localStorage.setItem("extraBGs", JSON.stringify(urls));
			} else {
				alert("URLs invalid. Please check again.");
			}
		}
		
		localStorage.setItem("options", JSON.stringify(options));
		
		var status = document.getElementById("statusDiv");
		status.textContent = "Options saved.";
		setTimeout(function() {
			status.textContent = "";
		}, 1000);
		
		localStorage.setItem("quoteTime", 0);
	}
	
	function loadOptions() {
		var options = {};
		options = JSON.parse(localStorage.getItem("options"));
		
		for (var id in options) {
			if (id != "quoteCat") {
				var val = options[id]
				document.getElementById(id +"Opt").checked = val;
			}
		}
		
		var urls = {};
		urls = JSON.parse(localStorage.getItem("extraBGs"));
		
		if (urls) {
			var urlStr = urls.join(",");
			
			document.getElementById("extraURLs").value = urlStr;
		}
	}
	
	document.getElementById("saveBtn").onclick = saveOptions;
	loadOptions()
}