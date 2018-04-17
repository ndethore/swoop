var m = require("mithril")
var App = require("./components/App")

var container = document.getElementById("swoop");
if (!container) {
	container = document.createElement("div");
	container.setAttribute("id", "swoop");
}

m.mount(container, App);

// for (var child of container.children) {
// 	document.body.appendChild(child);
// }

document.body.appendChild(container);
