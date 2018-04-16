var m = require("mithril")

var state = {
  visible: false,
  data: [{"favIconUrl":"","title":"Extensions","url":"chrome://extensions/"},{"favIconUrl":"https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d","title":"Stack Overflow - Where Developers Learn, Share, & Build Careers","url":"https://stackoverflow.com/"},{"favIconUrl":"https://cdn-static-1.medium.com/_/fp/icons/favicon-rebrand-medium.3Y6xpZ-0FSdWDnPM3hSBIA.ico","title":"Medium – Read, write and share stories that matter","url":"https://medium.com/"},{"favIconUrl":"https://news.ycombinator.com/favicon.ico","title":"Hacker News","url":"https://news.ycombinator.com/"},{"favIconUrl":"https://cdn.wip.chat/assets/favicon-53c01d9c7d547dd28818ade6eb73beb45311ef148ee0c16487e51c662cad1c00.png","title":"Work in Progress","url":"https://wip.chat/"},{"favIconUrl":"","title":"jQuery Injector Options","url":"chrome-extension://ekkjohcjbjcjjifokpingdbdlfekjcgi/pages/settings.html"},{"title":"Swoop","url":"http://localhost:8080/"},{"favIconUrl":"https://www.google.co.jp/images/branding/product/ico/googleg_lodp.ico","title":"farnamstreet - Google Search","url":"https://www.google.co.jp/search?q=farnamstreet&oq=farnamstreet&aqs=chrome.0.69i59j0l5.2190j0j7&sourceid=chrome&ie=UTF-8"},{"favIconUrl":"https://www.goodreads.com/favicon.ico","title":"Homo Deus: A Brief History of Tomorrow by Yuval Noah Harari","url":"https://www.goodreads.com/book/show/31138556-homo-deus"}],
  selectedIndex: -1
};

module.exports = {
  oncreate: function(vnode) {
    console.log("Initialized with height of: ", vnode.dom.offsetHeight)
    document.addEventListener('keydown', this.onKeydown, false);
  },
 onKeydown: function(event) {
    console.log("Keydown detected!");
    if (event.metaKey && event.shiftKey && event.key == "o") {
      console.log("⌘ + ⇧ + o");
      state.visible = true;
      m.redraw();
    }
    else if (event.key === "Escape") {
      console.log("ESC");
      state.visible =  false;
      m.redraw();
    }
    else if (event.key === "ArrowDown") {
      state.selectedIndex = Math.min(state.selectedIndex + 1, state.data.length - 1);
      console.log("Selecting element at index " + state.selectedIndex);
      m.redraw();
    }
    else if (event.key === "ArrowUp") {
      state.selectedIndex = Math.max(state.selectedIndex - 1, 0);
      console.log("Selecting element at index " + state.selectedIndex);
      m.redraw();
    }

  },
  view: function() {
    console.log("Rendering...");
    return (
      // <div id="app" class={state.visible? "visible" : ""}>
      <div id="switcher" class="visible">
        <p> Use arrows, then enter to open a tab.</p>
        <div id="tab-list">
          {
            state.data.map(function(tab, index) {
              let style = "tab";
              style += state.selectedIndex == index? " selected" : "";
              return (
                <div class={style}>
                  <b>{tab.title}</b><br/>
                  <i>{tab.url}</i>
                </div>
              );
            })
          }
        </div>
      </div>
    )
  }
}
