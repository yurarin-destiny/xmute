const tweets = document.getElementsByClassName("r-qklmqi");
const names = document.getElementsByClassName("css-175oi2r r-zl2h9q");
const retweets = document.getElementsByClassName("css-1jxf684 r-8akbws r-1cwl3u0");

let url = new URL(location.href);
let query = new URLSearchParams(location.search).get("q");

comparetime = rec => {
	if (!rec) return "none";
	const r_year = rec.substring(0, 4);
	const r_month = rec.substring(5, 7);
	const r_day = rec.substring(8, 10);
	const r_hour = rec.substring(11, 13);
	const r_min = rec.substring(14, 16);
	const r_sec = rec.substring(17, 19);
	const rectime = new Date(r_year, r_month - 1, r_day, r_hour, r_min, r_sec);
	const now = new Date();
	if (rectime > now) return "future";
	else return "past";
};

onload = async () => {
	let data = (await chrome.storage.local.get("key")).key;
	let userdata = (await chrome.storage.local.get("userdata")).userdata;
	const optiondata = (await chrome.storage.local.get("option")).option;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });

	const timer = setInterval(() => {
		for (let e of tweets) {
			for (let d of data){
				if (e.textContent.includes(d.word)) {
					e.remove();
					console.log("ワード削除: " + d.word);
				}
			}
		}
		for (let n of names) {
			for (let d of userdata) {
				if (n.textContent.includes(d.name) && d.sta == "rponly") {
					n.closest(".r-qklmqi").remove();
					console.log("リポスト以外削除: " + d.name);
				}
			}
		}
		if (url.pathname == "/search" && optiondata.searchnameng) {
			for (let n of names) {
				let str = new RegExp(query);
				if (str.test(n.textContent.replace(" ",""))) {
					n.closest(".r-qklmqi").remove();
					console.log("名前削除: " + query);
				}
			}
		}
		for (let r of retweets) {
			for (let d of userdata) {
				if (r.baseURI.includes(d.name) && d.sta == "") {
					r.closest(".r-qklmqi").remove();
					console.log("リポスト削除: " + d.name);
				}
			}
		}
	}, optiondata.interval);
	
	// setTimeout(() => console.log(), 7000);
	
	console.log(`更新間隔： ${optiondata.interval}ミリ秒`);
	if (url.pathname == "/search" && optiondata.searchnameng) {
		console.log("検索画面モード 名前NG: " + query);
	}
};
