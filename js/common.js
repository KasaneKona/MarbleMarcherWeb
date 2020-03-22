// Resources
const fonts = {};
const sounds = {};
const files = {};

var askedSoundPermission = false;
var totalResources = 0;
var resourcesToLoad = 0;
var loadProgressCallback;
var allLoadedCallback;

function loadResources(resources, callback, progressCallback=null) {
	allLoadedCallback = callback;
	loadProgressCallback = progressCallback;
	totalResources = resources.length
	resourcesToLoad = totalResources;
	if(document.readyState !== "complete") {
		resourcesToLoad++; totalResources++; // Fake resource
		window.onload = () => resourceLoaded(); // Fake resource
	}
	for(let r of resources) {
		if(r.font) {
			let rf = r.font;
			let urlStr = "";
			for(let url of rf.urls) {
				if(urlStr) urlStr += ", ";
				urlStr += "url("+url+")";
			}
			let fontTemp = new FontFace(rf.family, urlStr);
			fontTemp.load().then(function(loadedFont) {
				document.fonts.add(loadedFont);
				fonts[rf.name] = {face:loadedFont, family:rf.family, spaceWidth:rf.spaceWidth};
				resourceLoaded("font:"+rf.name);
			});
		} else if(r.sound) {
			let rs = r.sound;
			let soundTemp = new Audio(rs.url);
			soundTemp.oncanplay = function() {
				soundTemp.oncanplay = null;
				sounds[rs.name] = soundTemp;
				if(!askedSoundPermission) {
					askedSoundPermission = true;
					getSoundPermission();
				}
				resourceLoaded("sound:"+rs.name);
			};
		} else if(r.file) {
			let rf = r.file;
			let xhr = new XMLHttpRequest();
			xhr.addEventListener("load", function(data) {
				files[rf.name] = data.target.response;
				resourceLoaded("file:"+rf.name);
			});
			xhr.open("GET", rf.url);
			xhr.send();
		}
	}
}

resourceLoaded = function(name) {
	if(name) console.log("Loaded "+name);
	resourcesToLoad--;
	if(loadProgressCallback) loadProgressCallback((totalResources-resourcesToLoad)/totalResources);
	if(!resourcesToLoad) {
		allLoadedCallback();
	}
}

function playSound(name, volume=1, loop=false) {
	let s = sounds[name];
	s.currentTime = 0;
	s.volume = volume;
	s.loop = loop;
	s.play();
}

function stopSound(name) {
	let s = sounds[name];
	s.volume = 0;
	s.pause();
}

function silence() {
	for(let name in sounds) {
		stopSound(name);
	}
}

function sfmlLetterSpacing(spaceWidth, factor) {
	return ((spaceWidth / 3) * (factor - 1)) / 2;
}

function newDiv() {
	return document.createElement("div");
}
function getSoundPermission() {
	resourcesToLoad++; totalResources++; // Fake resource
	var soundList = Object.values(sounds);
	if(soundList.length == 0) {
		console.log("No sounds, ignoring permission request");
		return;
	}
	var soundTemp = soundList[0];
	soundTemp.volume = 0.01; // Nonzero to trigger blocking, but hopefully 1% is inaudible
	soundTemp.currentTime = 0;
	var promise = soundTemp.play();
	if(promise) { // Blockable
		promise.then(() => { // Granted automatically
			soundTemp.pause();
			resourceLoaded(); // Fake resource
		}).catch(error => { 
			// Not granted, request user interaction
			if(error.name === "NotAllowedError") enableSoundPopup();
			// Some other error
			else alert(error);
		})
	} else { // Most likely not blockable
		gotSoundPermission = true;
	}
}

function enableSoundPopup() {
	var soundPopupWindow = newDiv();
	soundPopupWindow.className = "disableSelect";
	soundPopupWindow.style.width = "100vw";
	soundPopupWindow.style.height = "100vh";
	soundPopupWindow.style.background = "rgba(0,0,0,0.67)";
	soundPopupWindow.style.opacity = "0";
	soundPopupWindow.style.transition = "opacity 0.25s linear";
	setTimeout(()=>{
		soundPopupWindow.style.opacity = "1";
	}, 100); // Trigger later
	soundPopupWindow.style.position = "fixed";
	soundPopupWindow.style.left = 0;
	soundPopupWindow.style.top = 0;
	document.body.appendChild(soundPopupWindow);
	soundPopupWindow.addEventListener("click", e => {
		setTimeout(()=>{
			document.body.removeChild(soundPopupWindow);
			soundPopupWindow = null;
		}, 260);
		soundPopupWindow.style.opacity = "0";
		resourceLoaded(); // Fake resource
	});
	let soundPopupText = newDiv();
	soundPopupText.innerHTML =
		"<div style='font-size:8vmin'>Click to allow audio</div>"+
		"<div style='font-size:4vmin'>Playing audio requires page interaction</div>";
	soundPopupText.style.fontFamily = fonts["mono"].family;
	soundPopupText.style.color = "white";
	soundPopupText.style.textAlign = "center";
	soundPopupText.style.paddingTop = "50vh";
	soundPopupText.style.marginTop = "-6vmin";
	soundPopupText.style.textShadow = "black 0 0 1vmin, black 0 0 1vmin";
	soundPopupWindow.appendChild(soundPopupText);
}
