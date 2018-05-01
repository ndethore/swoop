var m = require("mithril");

export default class TabListItem {
	constructor() {

	}

	matchForKey(key, matches) {
		if (matches) {
			for (let match of matches) {
				if (match.key == key) return match;
			}
		}
		return null;
	}

	highlight(text, indices, opening, closing) {
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

	view (vnode) {
		const ui = vnode.state;
		const tab = vnode.attrs.tab;
		const favicon = tab.item.favIconUrl;
		const selected = vnode.attrs.highlighted;
		let title = tab.item.title;
		let url = tab.item.url;
		let match;

		if ((match = ui.matchForKey("title", tab.matches))) {
			title = ui.highlight(title, match.indices, <span class="highlighted">, </span>);
		}
		if ((match = ui.matchForKey("url", tab.matches))) {
			url = ui.highlight(url, match.indices, <span class="highlighted">, </span>);
		}

		return (
			<div class={"tab" + (selected ? " selected": "")}>
				<img class="favicon" src={favicon}/>
				<div class="details">
					<b class="title">{title}</b>
					<i class="url">{url}</i>
				</div>
			</div>
		);
	}
}
