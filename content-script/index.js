var m = require("mithril")
var App = require("./components/App")

var placeholder = document.createElement("div");
m.mount(placeholder, App);

for (var child of placeholder.children) {
	document.body.appendChild(child);
}
