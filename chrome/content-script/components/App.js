var m = require("mithril")

var state = {
  port: null,
  visible: true,
  tabs: [],
  selectedIndex: -1,
};


function matchForKey(key, matches) {
  if (matches) {
    for (let match of matches) {
      if (match.key == key) return match;
    }
  }
  return null;
}


function highlight(text, indices, opening, closing) {
  var chunks = [];

  for (let indice of indices) {
    const start = indice[0];
    const end = indice[1];

    chunks.push({text: text.substr(0, start), highlight: false});
    chunks.push({text: text.substr(start, (end + 1) - start), highlight: true});
    text = text.substr(end + 1);
  }
  chunks.push({text: text, highlight: false});
  return (
    <span>
      {
        chunks.map(function(chunk) {
            if (chunk.highlight) return <span class="highlighted">{chunk.text}</span>;
            return <span>{chunk.text}</span>;
        })
      }
    </span>
  );
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(`Incoming Handshake from event-page...`);
  sendResponse("pong");
});


chrome.runtime.onConnect.addListener(function(_port) {
  state.port = _port;

  console.log("Incoming connection...");
  state.port.onMessage.addListener(function(msg) {
    if (msg.command == "show") {
      state.visible = true;
      state.tabs = JSON.parse(msg.data);
      lockBodyScroll();
      m.redraw();
    } else if (msg.command == "hide") {
      state.visible = false;
      unlockBodyScroll();
      m.redraw();
    }
  });

  state.port.onDisconnect.addListener(function() {
    console.log("Port disconnected.");
    state.port = null;
  });
});


function lockBodyScroll() {
    document.body.classList.toggle("no-scroll", true);
}


function unlockBodyScroll() {
  document.body.classList.toggle("no-scroll", false);
}


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
      // if (state.visible == true) {
        state.visible = false;
        unlockBodyScroll();
        m.redraw();
      // }
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
                if (index == 0) console.log(`tab: ${JSON.stringify(tab)}`);

                let title = tab.item.title;
                let url = tab.item.url;
                let match;
                if ((match = matchForKey("title", tab.matches))) {
                  console.log("Match found for title! Highlighting...");
                  title = highlight(title, match.indices, <span class="highlighted">, </span>);
                }
                if ((match = matchForKey("url", tab.matches))) {
                  console.log("Match found for URL! Highlighting...");
                  url = highlight(url, match.indices, <span class="highlighted">, </span>);
                }


                return (
                  <div class={style}>
                    <img class="favicon" src={tab.item.favIconUrl}/>
                    <div class="details">
                      <b class="title">{title}</b>
                      <i class="url">{url}</i>
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
