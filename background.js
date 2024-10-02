initialize = async () => {
	await chrome.contextMenus.removeAll();
	
	chrome.contextMenus.create({
		id: "pop",
		title: "「%s」を非表示発射のド迫力",
		contexts: ["selection"],
	});
}

chrome.runtime.onInstalled.addListener(async () => {
	const optiondata = { interval: 1000, searchnameng: true };
	await chrome.storage.local.set({ option: optiondata });
	chrome.storage.local.remove("select");
	initialize();
});

chrome.contextMenus.onClicked.addListener(info => {
	const select = info.selectionText; // 選択されたテキストを取得
	chrome.action.openPopup(); // ポップアップを開くためにアクションをトリガー
	chrome.storage.local.set({ select });
});