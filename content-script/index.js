var m = require("mithril")
var App = require("./components/App")

/*
** Render component in a placeholder div to avoid overriding
** existing DOM elements.
*/
var	container = document.createElement("div");

m.mount(container, App);

document.body.appendChild(container.firstElementChild);
