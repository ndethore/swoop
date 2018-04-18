var m = require("mithril")

var state = {
  visible: true,
  tabs: [],
  selectedIndex: -1
};

var port = chrome.runtime.connect("kflkchgdjgnpnjejjalfnooncfdfpdha", {name: "swoop"});
port.onMessage.addListener(function(msg) {
  if (msg.command == "show") {
    state.tabs = JSON.parse(msg.data);
    m.redraw();
  } else if (msg.command == "hide") {
    state.visible = false;
    m.redraw();
  }
});

port.onDisconnect.addListener(function() {
  console.log("Port disconnected.");
  port = null;
});

module.exports = {
  oncreate: function(vnode) {
    console.log("Initialized with height of: ", vnode.dom.offsetHeight)
    document.addEventListener('keydown', this.onKeydown, false);
  },
 onKeydown: function(event) {
   /*
   ** Moved shortcut detection to browser level to avoid to avoid potential
   ** conflict with pre-existing web page's listeners.
   */
    // if (event.metaKey && event.shiftKey && event.key == "o") {
    //   state.visible = true;
    //   m.redraw();
    // }
    if (event.key === "Escape") {
      if (state.visible == true) {
        state.visible =  false;
        m.redraw();
      }
    }
    else if (event.key === "ArrowDown") {
      state.selectedIndex = Math.min(state.selectedIndex + 1, state.tabs.length - 1);
      m.redraw();
    }
    else if (event.key === "ArrowUp") {
      state.selectedIndex = Math.max(state.selectedIndex - 1, 0);
      m.redraw();
    }
    else if (event.key === "Enter") {
      let tabId = state.tabs[state.selectedIndex].item.id;
      port.postMessage({command: "open", tabId: tabId});
    }
  },
  onInput: function(e) {
    let query = e.target.value;
    port.postMessage({command: "search", query: query});
  },
  view: function() {
    console.log("Rendering...");
    return (
     <div id="swoop" class={ state.visible? "visible" : "" }>
       <div id="swoop-container">
         <input id="swoop-search" type="search" placeholder="Start typing a tab's url or title..." oninput={this.onInput} autofocus/>
         <p> Use arrows, then enter to open a tab.</p>
         <div id="swoop-tab-list">
           {
             state.tabs.map(function(tab, index) {
               let style = "tab";
               style += state.selectedIndex == index? " selected" : "";
               // console.log(`tab: ${JSON.stringify(tab)}`);
               return (
                 <div class={style}>
                   <b>{tab.item.title}</b><br/>
                   <i>{tab.item.url}</i>
                 </div>
               );
             })
           }
         </div>
       </div>
      </div>
    )
  }
}
