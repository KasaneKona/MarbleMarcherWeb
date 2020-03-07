const resolutions = [
	{width:320,  height:180,  info:"I have potato?"},
	{width:640,  height:360,  info:"GTX 960 or lower:"},
	{width:960,  height:540,  info:"GTX 970 or similar:"},
	{width:1280, height:720,  info:"GTX 980 or similar:"},
	{width:1600, height:900,  info:"GTX 1080 or similar:"},
	{width:1920, height:1080, info:"GTX 1080 Ti or similar:"},
	{width:2560, height:1440, info:"RTX 2080 Ti or higher:"}
];

// GUI settings
const colorBackground = "black";
const colorTitle = "white";
const colorSelected = "white";
const colorUnselected = "gray";
const letterSpacing = 0.8; // sfml factor
const menuWidth = 640;
const menuHeight = 600;

// Font properties
const fontMonoSpaceWidth = 1; // width of one space character, in em units
const fontMonoYOffset = 0.2195; // Y offset to top of text in sfml, relative to font size

// State
var useFullscreen = false;
var useSound = null;
var listGenId = null;
var resourcesToLoad = 0;

// Resources
resourcesToLoad++;
const fontMono = new FontFace('Inconsolata-Bold', 'url(./assets/Inconsolata-Bold.ttf)');
fontMono.load().then(function(loadedFont) {
	resourceLoaded("fontMono");
});

resourcesToLoad++;
const soundHover = new Audio("./assets/menu_hover.wav");
soundHover.oncanplay = function(){
	resourceLoaded("soundHover");
	soundHover.oncanplay = null;
}

function resourceLoaded(name) {
	console.log("Loaded "+name);
	resourcesToLoad--;
	if(!resourcesToLoad) doGenerate();
}

function generateList(id) {
	listGenId = id;
}

function sfmlLetterSpacing(spaceWidth, factor) {
	return ((spaceWidth / 3) * (factor - 1)) / 2;
}

function fullscreenText() {
	return "Full Screen [" + (useFullscreen ? "X" : " ") + "]";
}


function newDiv() {
	return document.createElement("div");
}

function playHoverSound() {
	soundHover.volume = 2/3;
	soundHover.currentTime = 0;
	soundHover.play();
}

function tsc(value) {
	return sc(value)*100 + "vh"; // value/600 * 100 + "vh";
}
function sc(value) {
	return value/menuHeight;
}

function doGenerate() {
	// Container
	const listContainer = document.getElementById(listGenId);
	listContainer.textContent = "";
	listContainer.className = "disableSelect";
	listContainer.style.background = colorBackground;
	listContainer.style.width = tsc(menuWidth);
	listContainer.style.height = tsc(menuHeight);
	listContainer.style.margin = "0 auto";
	listContainer.style.position = "relative";
	listContainer.style.fontFamily = fontMono.family;
	const letterSpacing = sfmlLetterSpacing(fontMonoSpaceWidth, 0.8);
	// Content
	const listTitle = newDiv();
	listTitle.style.width = "100%";
	listTitle.style.color = "white";
	listTitle.style.fontSize = tsc(48);
	listTitle.style.textAlign = "center";
	listTitle.style.letterSpacing = (letterSpacing*sc(48))+"px";
	listTitle.style.paddingTop = tsc(16);
	listTitle.style.paddingBottom = tsc(30);
	listTitle.innerText = "Select Resolution";
	listContainer.appendChild(listTitle);
	for(var i = 0; i < resolutions.length; i++) {
		const res = resolutions[i];
		const resRow = newDiv();
		resRow.className = "hoverColored"
		resRow.style.width = "100%";
		resRow.style.fontSize = tsc(42);
		resRow.style.height = tsc(48);
		resRow.style.marginBottom = tsc(12);
		resRow.style.position = "relative";
		const resInfo = newDiv();
		const resDims = newDiv();
		resInfo.innerText = res.info;
		resDims.innerText = res.width + " x " + res.height;
		resInfo.style.fontSize = tsc(32);
		resInfo.style.position = "absolute";
		resInfo.style.left = tsc(20);
		resInfo.style.top = tsc(4);
		resInfo.style.letterSpacing = (letterSpacing*sc(32))+"px";
		resDims.style.position = "absolute";
		resDims.style.left = tsc(390);
		resDims.style.top = "0px";
		resDims.style.letterSpacing = (letterSpacing*sc(42))+"px";
		resRow.appendChild(resInfo);
		resRow.appendChild(resDims);
		resRow.addEventListener("mouseenter", e => playHoverSound());
		resRow.addEventListener("click", e => {
			alert("Selected resolution: "+resDims.innerText+", fullscreen = "+useFullscreen);
		});
		listContainer.appendChild(resRow);
	}
	const fullscreenCheck = newDiv();
	fullscreenCheck.className = "hoverColored";
	fullscreenCheck.style.width = "100%";
	fullscreenCheck.style.fontSize = tsc(40);
	fullscreenCheck.style.textAlign = "center";
	fullscreenCheck.style.letterSpacing = (letterSpacing*sc(40))+"px";
	fullscreenCheck.style.paddingTop = tsc(5);
	fullscreenCheck.innerText = fullscreenText();
	fullscreenCheck.addEventListener("mouseenter", e => playHoverSound());
	fullscreenCheck.addEventListener("click", e => {
		useFullscreen = !useFullscreen;
		fullscreenCheck.innerText = fullscreenText();
	});
	listContainer.appendChild(fullscreenCheck);
	if(useSound == null) enableSoundPopup();
}

function enableSoundPopup() {
	var soundPopupWindow = newDiv();
	soundPopupWindow.style.width = "100vw";
	soundPopupWindow.style.height = "100vh";
	soundPopupWindow.style.background = "rgba(0,0,0,0.67)";
	soundPopupWindow.style.opacity = "0";
	soundPopupWindow.style.transition = "opacity 0.25s linear";
	setTimeout(()=>{soundPopupWindow.style.opacity = "1"},0); // Trigger later
	soundPopupWindow.style.position = "fixed";
	soundPopupWindow.style.left = 0;
	soundPopupWindow.style.top = 0;
	document.body.appendChild(soundPopupWindow);
	soundPopupWindow.addEventListener("click", e => {
		setTimeout(()=>{
			document.body.removeChild(soundPopupWindow);
			soundPopupWindow = null;
		},260);
		soundPopupWindow.style.opacity = "0";
	});
	var soundPopupText = newDiv();
	soundPopupText.innerHTML =
		"<div style='font-size:48px'>Click to allow audio</div>"+
		"<div style='font-size:16px'>Playing audio requires page interaction</div>";
	soundPopupText.style.fontFamily = fontMono.family;
	soundPopupText.style.color = "white";
	soundPopupText.style.textAlign = "center";
	soundPopupText.style.paddingTop = "50vh";
	soundPopupText.style.marginTop = "-24px";
	soundPopupWindow.appendChild(soundPopupText);
}