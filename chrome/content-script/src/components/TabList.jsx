var m = require("mithril");

import TabListItem from './TabListItem.jsx';

export default class TabList {
	constructor(vnode) {

	}

	view (vnode) {
		const tabs = vnode.attrs.tabs;
		const selectedIndex = vnode.attrs.selectedIndex;

		return (
			<div id="tab-list">
				{
					tabs.map(function(tab, index) {
						const highlighted = (index === selectedIndex);
						return <TabListItem tab={tab} highlighted={highlighted} />
					})
				}
			</div>
		);
	}
}
