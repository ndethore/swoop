var m = require("mithril")

var state = {
  port: null,
  visible: true,
  tabs: [],
  selectedIndex: -1,
};

chrome.runtime.onConnect.addListener(function(_port) {
  state.port = _port;

  console.log("Incoming connection...");
  state.port.onMessage.addListener(function(msg) {
    if (msg.command == "show") {
      state.visible = true;
      state.tabs = JSON.parse(msg.data);
      m.redraw();
    } else if (msg.command == "hide") {
      state.visible = false;
      m.redraw();
    }
  });

  state.port.onDisconnect.addListener(function() {
    console.log("Port disconnected.");
    state.port = null;
  });
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
      state.port.postMessage({command: "open", tabId: tabId});
    }
  },
  onInput: function(e) {
    let query = e.target.value;
    state.port.postMessage({command: "search", query: query});
  },
  view: function() {
    console.log("Rendering...");
    return (
      <div id="swoop" class={ state.visible? "visible" : "" }>
        <div id="container">
          <div id="search">
            <svg class="magnifier-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="search" placeholder="Start typing a URL or title..." oninput={this.onInput} autofocus/>
          </div>
          {/* <p class="instructions"> Use arrows, then enter to open a tab.</p> */}
          <div id="tab-list">
            {
              state.tabs.map(function(tab, index) {
                let style = "tab";
                style += state.selectedIndex == index? " selected" : "";
                // console.log(`tab: ${JSON.stringify(tab)}`);
                return (
                  <div class={style}>
                    <img class="favicon" src={tab.item.favIconUrl}/>
                    <div class="details">
                      <b class="title">{tab.item.title}</b>
                      <i class="url">{tab.item.url}</i>
                    </div>
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
