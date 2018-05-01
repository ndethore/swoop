var m = require("mithril");

export default class SearchBar {
	view(vnode) {
		return (
			<div id="search">
				<svg class="magnifier-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
				<input type="search" placeholder="Start typing a URL or title..." oninput={vnode.attrs.onInput} autofocus/>
			</div>
		);
	}
}
