var windowId = -1;
var openTabs = [];
var port = null;

function initialize(_) {
	chrome.windows.getCurrent(function (window) {
		// windowId = chrome.windows.WINDOW_ID_CURRENT;
		windowId = window.id;
		console.log("WindowId: " + windowId);
		console.log("Loading open tabs...");
		chrome.tabs.query({'windowId': windowId}, function(tabs) {
			if (tabs.length > 0) {
				console.log("Restoring tabs!");

			}
			openTabs = tabs;
		});

	});
}

function onConnect(_port) {
	console.log("Accepting connection...");
	console.assert(_port.name == "swoop");
	port = _port;

	console.log("Accepted. Listening to incoming messages...");
	port.onMessage.addListener(handleMessage);
	port.onDisconnect.addListener(function() {
		console.log("Port disconnected.");
		port = null;
	});
}

function handleMessage(msg) {
	console.log("New message received.")
	if (msg.command == "get_all")
		port.postMessage({command: "get_all", "data": JSON.stringify(openTabs.map((element) => { return {id: element.id, favIconUrl: element.favIconUrl, title: element.title, url: element.url} }))});
	else if (msg.command == "open") {
		chrome.tabs.update(msg.tabId, {active: true})
	}
}

function onTabCreated(tab) {
	console.log(`Tab ${tab.id} created.`);
	openTabs.push(tab);
}

function onTabAttached(tabId, attachInfo) {
	console.log(`Tab ${tabId} attached.`);
	if (attachInfo.windowId == windowId) {
		chrome.tabs.get(tabId, function(tab) {
			openTabs.splice(attachInfo.newPosition, 0, tab);
		});
	}
}

function onTabMoved(tabId, moveInfo) {
	console.log(`Moving tab ${tabId} from ${moveInfo.fromIndex} to ${moveInfo.toIndex}.`);
	if (moveInfo.windowId == windowId) {
		console.log("windowcheck ok");

		var removed = openTabs.splice(moveInfo.fromIndex, 1);
		openTabs.splice(moveInfo.toIndex, 0, removed[0]);
			console.log(`Tab ${tabId} moved.`);
	}
}

function onTabUpdated(tabId, changeInfo, tab) {
	console.log(`Updating tab ${tabId} - windowId: ${tab.windowId}...`);
	if (tab.windowId == windowId) {
		openTabs[tab.index] = tab;
		console.log(`Tab ${tabId} updated.`);
	}
}

function onTabDetached(tabId, detachInfo) {
	console.log(`Tab ${tabId} detached.`);
	if (detachInfo.oldWindowId == windowId) {
		openTabs.splice(detachInfo.ldPosition, 1);
	}
}

function onTabRemoved(tabId, removeInfo) {
	console.log(`Tab ${tabId} removed.`);
	if (removeInfo.windowId == windowId) {
		chrome.tabs.get(tabId, function(tab) {
			let index = openTabs.indexOf(tab);
			if (index != -1) {
				openTabs.splice(index, 1);
			}
		});
	}
}

console.log("Starting up...");
if (chrome.runtime && chrome.runtime.onStartup) {
	chrome.runtime.onInstalled.addListener(initialize);
	chrome.runtime.onStartup.addListener(initialize);
	chrome.runtime.onConnect.addListener(onConnect);

	chrome.tabs.onCreated.addListener(onTabCreated);
	chrome.tabs.onAttached.addListener(onTabAttached);
	chrome.tabs.onUpdated.addListener(onTabUpdated);
	chrome.tabs.onMoved.addListener(onTabMoved);
	chrome.tabs.onDetached.addListener(onTabDetached);
	chrome.tabs.onRemoved.addListener(onTabRemoved);
}
else {
	console.log("This extension requires Chrome 23 or above. Please update Chrome and retry.");
}
