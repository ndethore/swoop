var m = require("mithril")

var state = {
  visible: false
}

module.exports = {
  oncreate: function(vnode) {
    console.log("Initialized with height of: ", vnode.dom.offsetHeight)
    document.addEventListener('keydown', this.onKeydown, false);
  },
 onKeydown: function(event) {
    // console.log("Keydown detected!");
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
  },
  view: function() {
    console.log("Rendering...");
    let style = state.visible ? "display: block" : "display: none";
    return (
      <div style={style}> hello from a module </div>
    )
  }
}
