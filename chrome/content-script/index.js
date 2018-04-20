var m = require("mithril")
var App = require("./components/App")

/*
** Render component in a placeholder div to avoid overriding
** existing DOM elements.
*/
var	slot = document.getElementById("swoop-slot");
if (!slot) {
	slot = document.createElement("div");
	slot.setAttribute("id", "swoop-slot");
	document.body.appendChild(slot);
}
m.mount(slot, App);
