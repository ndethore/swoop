var m = require("mithril")
import App from './src/components/App.jsx'
import ChromeController from './src/ChromeController.js'

var controller = new ChromeController();
// controller.init();
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

m.mount(slot, {view: function () {return m(App, {controller: controller})}})
