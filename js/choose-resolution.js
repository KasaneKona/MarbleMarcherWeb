const resolutions = [
	{width:320,  height:180,  info:"I have potato?"},
	{width:640,  height:360,  info:"GTX 960 or lower:"},
	{width:960,  height:540,  info:"GTX 970 or similar:"},
	{width:1280, height:720,  info:"GTX 980 or similar:"},
	{width:1600, height:900,  info:"GTX 1080 or similar:"},
	{width:1920, height:1080, info:"GTX 1080 Ti or similar:"},
	{width:2560, height:1440, info:"RTX 2080 Ti or higher:"}
];

const resources = [
	{font: {name: "mono", family: "Inconsolata-Bold", spaceWidth: 1, urls: ["./assets/Inconsolata-Bold.ttf"]}},
	{sound: {name: "menu_hover", url: "./assets/menu_hover.wav"}}
];

// GUI settings
const colorBackground = "black";
const colorTitle = "white";
const colorSelected = "white";
const colorUnselected = "gray";
const menuWidth = 640;
const menuHeight = 600;

// State
var useFullscreen = false;
var listGenId = null;

function chooseResolutionInit(id) {
	listGenId = id;
	loadResources(resources, doGenerate);
}

function fullscreenText() {
	return "Full Screen [" + (useFullscreen ? "X" : " ") + "]";
}

function playHoverSound() {
	playSound("menu_hover", 2/3);
}

var windowTallLast = null;
function resizeFunc() {
	const listContainer = document.getElementById(listGenId);
	const windowWidth = document.body.clientWidth;
	const windowHeight = document.body.clientHeight;
	var menuAspect = menuWidth/menuHeight;
	var windowAspect = windowWidth/windowHeight;
	var windowTall = windowAspect < menuAspect;
	if(windowTall != windowTallLast) {
		if(windowTall) {
			// Window taller than menu
			listContainer.style.fontSize = (100/menuWidth)+"vw"; // em
			listContainer.style.width = "100vw";
			listContainer.style.height = (100*menuHeight/menuWidth)+"vw";
		} else {
			// Window wider than menu
			listContainer.style.fontSize = (100/menuHeight)+"vh"; // em
			listContainer.style.width = (100*menuWidth/menuHeight)+"vh";
			listContainer.style.height = "100vh";
		}
		windowTallLast = windowTall;
	}
}

function doGenerate() {
	// Container
	const listContainer = document.getElementById(listGenId);
	listContainer.textContent = "";
	listContainer.className = "disableSelect";
	listContainer.style.background = colorBackground;
	//listContainer.style.width = menuWidth+"px";
	//listContainer.style.height = menuHeight+"px";
	listContainer.style.margin = "auto";
	listContainer.style.position = "absolute";
	listContainer.style.left = "0";
	listContainer.style.right = "0";
	listContainer.style.top = "0";
	listContainer.style.bottom = "0";
	listContainer.style.fontFamily = fonts["mono"].family;
	window.onresize = ()=>{
		resizeFunc();
	}
	resizeFunc();
	const letterSpacing = sfmlLetterSpacing(fonts["mono"].spaceWidth, 0.8)+"em";
	// Content
	const listTitle = newDiv();
	listTitle.style.width = "100%";
	listTitle.style.color = "white";
	listTitle.style.fontSize = "48em";
	listTitle.style.textAlign = "center";
	listTitle.style.letterSpacing = letterSpacing;
	listTitle.style.paddingTop = (16/48)+"em";
	listTitle.style.paddingBottom = (30/48)+"em";
	listTitle.innerText = "Select Resolution";
	listContainer.appendChild(listTitle);
	for(var i = 0; i < resolutions.length; i++) {
		const res = resolutions[i];
		const resRow = newDiv();
		resRow.className = "hoverColored"
		resRow.style.width = "100%";
		resRow.style.height = "48em";
		resRow.style.marginBottom = "12em";
		resRow.style.position = "relative";
		const resInfo = newDiv();
		const resDims = newDiv();
		resInfo.innerText = res.info;
		resDims.innerText = res.width + " x " + res.height;
		resInfo.style.fontSize = "32em";
		resInfo.style.position = "absolute";
		resInfo.style.left = (20/32)+"em";
		resInfo.style.top = (4/32)+"em";
		resInfo.style.letterSpacing = letterSpacing;
		resDims.style.fontSize = "42em";
		resDims.style.position = "absolute";
		resDims.style.left = (390/42)+"em";
		resDims.style.top = "0";
		resDims.style.letterSpacing = letterSpacing;
		resRow.appendChild(resInfo);
		resRow.appendChild(resDims);
		resRow.addEventListener("mouseenter", e => playHoverSound());
		resRow.addEventListener("click", e => {
			startGame(res.width, res.height, useFullscreen);
		});
		listContainer.appendChild(resRow);
	}
	const fullscreenCheck = newDiv();
	fullscreenCheck.className = "hoverColored";
	fullscreenCheck.style.width = "100%";
	fullscreenCheck.style.fontSize = "40em";
	fullscreenCheck.style.textAlign = "center";
	fullscreenCheck.style.letterSpacing = letterSpacing;
	fullscreenCheck.style.paddingTop = (5/40)+"em";
	fullscreenCheck.innerText = fullscreenText();
	fullscreenCheck.addEventListener("mouseenter", e => playHoverSound());
	fullscreenCheck.addEventListener("click", e => {
		useFullscreen = !useFullscreen;
		fullscreenCheck.innerText = fullscreenText();
	});
	listContainer.appendChild(fullscreenCheck);
}

function startGame(width, height, fullscreen) {
	//alert("Selected resolution: "+width+"x"+height+", fullscreen="+fullscreen);
	const gameUrl = "./game.html";
	var urlFlags = "?w="+width+"&h="+height;
	if(fullscreen) urlFlags += "&f=true";
	window.location.href = gameUrl+urlFlags;
}
