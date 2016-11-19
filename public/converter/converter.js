var worker = new Worker("worker.js");

worker.onmessage = function (e) {
  var blob = e.data.csv;
  var url = window.URL.createObjectURL(blob);
  window.open(url);
}

var dropbox = document.getElementById("dropbox");
var fileInput = document.getElementById("file-input");

dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
dropbox.addEventListener("click", simulateClick, false);

fileInput.addEventListener("change", change, false);

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	var dt = e.dataTransfer;
	var files = dt.files;

	analyze(files);
}

function simulateClick(e) {
	e.stopPropagation();
	e.preventDefault();

	var evObj = document.createEvent("MouseEvents");
	evObj.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	fileInput.dispatchEvent(evObj);
}

function change(e) {
	e.stopPropagation();
	e.preventDefault();

	var t = e.target;
	var files = t.files;

	analyze(files);
}

function analyze(files) {
  for (var i = 0; i < files.length; i++) {
    worker.postMessage({action : "processFile", file: files[i]});
  }
}
