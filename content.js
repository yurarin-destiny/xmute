let data = [];
let res = "";
const tweets = document.getElementsByClassName("r-qklmqi");
const names = document.getElementsByClassName("css-175oi2r r-zl2h9q");

let url = new URL(location.href);
let urlparam = new URLSearchParams(location.search).get("q");

comparetime = (rec) => {
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
	data = (await chrome.storage.local.get("key")).key;
	const optiondata = (await chrome.storage.local.get("option")).option;
	data = data.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });

	const timer = setInterval(() => {
		for (let e of tweets) {
			for (let d of data){
				if (e.textContent.indexOf(d.word) != -1) {
					e.remove();
					console.log("ワード削除: " + d.word);
				}
			}
		}
		if (url.pathname == "/search" && optiondata.searchnameng) {
			for (let n of names){
				if (n.textContent.includes(urlparam)) {
					n.closest(".r-qklmqi").remove();
					console.log("名前削除: " + urlparam);
				}
			}
		}
	}, optiondata.interval);

	setInterval(() => clearInterval(timer), 40000);
	
	console.log(`更新間隔： ${optiondata.interval}ミリ秒`);
	if (url.pathname == "/search" && optiondata.searchnameng) {
		console.log("検索画面モード 名前NG: " + urlparam);
	}
};
