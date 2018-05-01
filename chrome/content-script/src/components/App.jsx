'use strict';

var m = require("mithril");
import SearchBar from './SearchBar.jsx';
import TabList from './TabList.jsx';

export default class App {
  constructor(vnode) {
    this.tabs = [];
    this.visible = true;
    this.selectedIndex = -1;
  }

  /*
  ** Life Cycle Methods
  */
  oninit(vnode) {
    console.log(`Component created with attrs: ${vnode.attrs}`);
  }

  oncreate(vnode) {
    console.log("Initialized with height of: ", vnode.dom.offsetHeight);
    document.addEventListener('keydown', vnode.state.onKeydown, false);
    this.controller = vnode.attrs.controller;
    this.controller.onShowCommand = this.show;
    this.controller.onHideCommand = this.hide;
    this.controller.init();
  }


  /*
  ** Instance Methods
  */
  hide = () => {
    this.visible = false;
    this.unlockBodyScroll();
    document.removeEventListener('keydown', this.onKeydown);
    m.redraw();
  }

  show = (data) => {
    this.visible = true;
    this.tabs = JSON.parse(data);
    this.lockBodyScroll();
    m.redraw();
  }

  selectPrevious = () => {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    m.redraw();
  }

  selectNext = () => {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.tabs.length - 1);
    m.redraw();
  }

  lockBodyScroll() {
    document.body.classList.toggle("no-scroll", true);
  }

  unlockBodyScroll() {
    document.body.classList.toggle("no-scroll", false);
  }


  /*
  ** User Input Events
  */
  onKeydown = (event) => {
    console.log("Keydown!");
    /*
    ** Moved shortcut detection to browser level to avoid to avoid potential
    ** conflict with pre-existing web page's listeners.
    */
    switch (event.key) {
      case "Escape":  this.hide(); break;
      case "ArrowUp": this.selectPrevious(); break;
      case "ArrowDown": this.selectNext(); break;
      case "Enter": this.controller.open(this.tabs[this.selectedIndex].item.id); break;
      default: break;

    }
  }

  onInput = (event) => {
    console.log("New Input!");
    let query = event.target.value;
    this.controller.search(query);
  }

  /*
  ** View
  */
  view(vnode) {
    const state = vnode.state;
    console.log("Rendering...");

    return (
      <div id="swoop" class={state.visible ? "visible" : ""}>
        <div id="container">
          <SearchBar onInput={state.onInput}/>
          <TabList tabs={state.tabs} selectedIndex={state.selectedIndex}/>
        </div>
      </div>
    );
  }
}
