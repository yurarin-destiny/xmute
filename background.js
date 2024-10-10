initialize = async () => {
	await chrome.contextMenus.removeAll();
	
	chrome.contextMenus.create({
		id: "pop",
		title: "「%s」を非表示発射のド迫力",
		contexts: ["selection"],
	});
}

chrome.runtime.onInstalled.addListener(async () => {
	const data = (await chrome.storage.local.get("key")).key || [],
		userdata = (await chrome.storage.local.get("userdata")).userdata || [],
		optiondata = (await chrome.storage.local.get("option")).option || {
			interval: 500,
			searchnameng: true,
		};
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });
	await chrome.storage.local.set({ option: optiondata });
	chrome.storage.local.remove("select");
	initialize();
});

chrome.contextMenus.onClicked.addListener(info => {
	const select = info.selectionText; // 選択されたテキストを取得
	chrome.storage.local.set({ select });
	chrome.action.openPopup(); // ポップアップを開くためにアクションをトリガー
});