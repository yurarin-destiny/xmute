chrome.runtime.onInstalled.addListener(async () => {
	const data = (await chrome.storage.local.get("key")).key || [],
		userdata = (await chrome.storage.local.get("userdata")).userdata || [],
		optiondata = (await chrome.storage.local.get("option")).option || {
			interval: 300,
			searchnameng: true,
			reflesh: false,
			reply: false,
			repost: false,
			like: false,
			impre: false,
			book: false,
			follow: false,
			follower: false,
			replace: false,
			neko: false,
			inu: false,
			kitune: false,
		};
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata });
	await chrome.storage.local.set({ option: optiondata });
	chrome.storage.local.remove("select");
	await chrome.contextMenus.removeAll();
	chrome.contextMenus.create({
		id: "pop",
		title: "「%s」を非表示発射のド迫力",
		contexts: ["selection"],
	});
});

chrome.contextMenus.onClicked.addListener(info => {
	const select = info.selectionText;
	chrome.storage.local.set({ select });
	chrome.action.openPopup();
});