const resources = [
	{font: {name: "mono", family: "Inconsolata-Bold", spaceWidth: 1, urls: ["./assets/Inconsolata-Bold.ttf"]}},
	{font: {name: "standard", family: "Orbitron-Bold", spaceWidth: 1, urls: ["./assets/Orbitron-Bold.ttf"], popup: true}},
	{sound: {name: "bounce1", url: "./assets/bounce1.wav"}},
	{sound: {name: "bounce2", url: "./assets/bounce2.wav"}},
	{sound: {name: "bounce3", url: "./assets/bounce3.wav"}},
	{sound: {name: "count_down", url: "./assets/count_down.wav"}},
	{sound: {name: "count_go", url: "./assets/count_go.wav"}},
	{sound: {name: "credits", url: "./assets/credits.ogg"}},
	{sound: {name: "goal", url: "./assets/goal.wav"}},
	{sound: {name: "level1", url: "./assets/level1.ogg"}},
	{sound: {name: "level2", url: "./assets/level2.ogg"}},
	{sound: {name: "level3", url: "./assets/level3.ogg"}},
	{sound: {name: "level4", url: "./assets/level4.ogg"}},
	{sound: {name: "menu", url: "./assets/menu.ogg"}},
	{sound: {name: "menu_click", url: "./assets/menu_click.wav"}},
	{sound: {name: "menu_hover", url: "./assets/menu_hover.wav"}},
	{sound: {name: "shatter", url: "./assets/shatter.wav"}},
	{file: {name: "frag", url: "./assets/frag.glsl"}},
	{file: {name: "vert", url: "./assets/vert.glsl"}}
];

// State
var viewportWidth;
var viewportHeight;
var useFullscreen;
var containerId = null;
var canvas2;
var canvas3;
var ctx2;
var ctx3;
var currentBgm;
var currentBgmVolume=1;

function gameInit(id) {
	containerId = id;
	let params = (new URL(window.location.href)).searchParams;
	viewportWidth = parseInt(params.get("w")||640);
	viewportHeight = parseInt(params.get("h")||360);
	useFullscreen = params.get("f")=="true";
	let container = document.getElementById(containerId);
	canvas2 = document.createElement("canvas");
	canvas3 = document.createElement("canvas");
	let layers = [canvas2, canvas3];
	window.onresize = ()=>resizeFunc(layers);
	resizeFunc(layers);
	for(let layer of layers) {
		layer.width = viewportWidth;
		layer.height = viewportHeight;
		layer.style.position = "absolute";
		layer.style.margin = "auto";
		layer.style.left = "0";
		layer.style.right = "0";
		layer.style.top = "0";
		layer.style.bottom = "0";
		container.appendChild(layer);
	}
	ctx2 = canvas2.getContext("2d");
	ctx3 = canvas3.getContext("3d");
	showProgress(0);
	loadResources(resources, doRunGame, showProgress);
}

var windowTallLast = null;
function resizeFunc(layers) {
	let windowWidth = document.body.clientWidth;
	let windowHeight = document.body.clientHeight;
	let menuAspect = viewportWidth/viewportHeight;
	let windowAspect = windowWidth/windowHeight;
	let windowTall = windowAspect < menuAspect;
	if(windowTall != windowTallLast) {
		for(let layer of layers) {
			if(windowTall) {
				layer.style.width = "100%";
				layer.style.height = "";
			} else {
				layer.style.width = "";
				layer.style.height = "100%";
			}
		}
		windowTallLast = windowTall;
	}
}

function showProgress(val) {
	ctx2.fillStyle = "#ffffff";
	ctx2.fillRect(0, 0, viewportWidth, viewportHeight);
	ctx2.strokeStyle = "#000000";
	ctx2.lineWidth = 2;
	ctx2.strokeRect(3, viewportHeight-25, viewportWidth-6, 22);
	ctx2.fillStyle = "#000000";
	ctx2.fillRect(6, viewportHeight-22, (viewportWidth-12)*val, 16);
}

function doRunGame() {
	ctx2.fillStyle="white";
	ctx2.fillRect(0,0,viewportWidth,viewportHeight);
	showProgress(1);
	setBgmVolume(0.5);
	setBgm("menu");
}

function setBgm(name) {
	if(currentBgm != name) {
		if(currentBgm) stopSound(currentBgm);
		if(name && sounds[name]) playSound(name, currentBgmVolume, true);
		currentBgm = name;
	}
}

function setBgmVolume(vol) {
	currentBgmVolume = vol;
	if(currentBgm) sounds[currentBgm].volume = vol;
}
