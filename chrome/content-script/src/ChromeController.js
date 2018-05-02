'use strict';

export default class ChromeController {
	constructor() {
		this.port = null;
		this.onShowCommand = null;
		this.onHideCommand = null;
	}

  search = (query) => {
    this.port.postMessage({command: "search", query: query});
  }

	open = (id) => {
    this.port.postMessage({command: "open", tabId: id});
  }

  onMessage = (message) => {
    console.log(`Command received from event page: ${message.command}`);
    switch (message.command) {
      case "show": {
				if (this.onShowCommand) this.onShowCommand(message.data);
				break;
			}
      case "hide": {
				if (this.onHideCommand) this.onHideCommand();
				break;
			}
      default: break;

    }
  }

  onDisconnect = () => {
    console.log("Port disconnected.");
    console.log(`Last Error: ${chrome.runtime.lastError}`);
    this.port = null;
  }

	onConnect = (port) => {
		console.log("Connection established...");
    this.port = port;
    this.port.onMessage.addListener(this.onMessage);
    this.port.onDisconnect.addListener(this.onDisconnect);
  }

	onHandshake = (message, sender, sendResponse) => {
    // Responding to probe from the extension to check if
    // a content script already exists on the page
    sendResponse("pong");
  }

  init() {
		console.log("Initializing...");
    chrome.runtime.onMessage.addListener(this.onHandshake);
    chrome.runtime.onConnect.addListener(this.onConnect);
		console.log("Ready!");
  }
}
