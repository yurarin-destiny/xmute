const tweets = document.getElementsByClassName("r-qklmqi"),
	replyedtweets = document.getElementsByClassName("css-175oi2r r-1adg3ll r-1ny4l3l"),
	names = document.getElementsByClassName("css-175oi2r r-zl2h9q"),
	retweets = document.getElementsByClassName("css-1jxf684 r-8akbws r-1cwl3u0"),
	medias = document.getElementsByClassName("r-1867qdf r-1udh08x r-o7ynqc"),
	words = document.getElementsByClassName("r-16dba41 r-bnwqim");
let url = new URL(location.href),
	query = new URLSearchParams(location.search).get("q"),
	querys;

const comparetime = rec => {
	if (!rec) return "none";
	const r_year = rec.substring(0, 4),
		r_month = rec.substring(5, 7),
		r_day = rec.substring(8, 10),
		r_hour = rec.substring(11, 13),
		r_min = rec.substring(14, 16),
		r_sec = rec.substring(17, 19),
		rectime = new Date(r_year, r_month - 1, r_day, r_hour, r_min, r_sec),
		now = new Date();
	if (rectime > now) return "future";
	else return "past";
};

onload = async () => {
	let data = (await chrome.storage.local.get("key")).key,
		userdata = (await chrome.storage.local.get("userdata")).userdata;
	const optiondata = (await chrome.storage.local.get("option")).option;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });

	setInterval(() => {
		for (let t of tweets) {
			func1(t, data, userdata);
		}
		for (let t of replyedtweets) {
			func1(t, data, userdata);
		}
		// リポストのみ表示
		for (let n of names) {
			for (let d of userdata) {
				if (n.textContent.includes(d.name) && d.sta == "rponly") {
					n.closest(".r-qklmqi").remove();
					console.log("リポスト以外削除: " + d.name);
				}
			}
		}
		if (url.pathname == "/search" && optiondata.searchnameng && query) {
			querys = query.split(/\s/);
			for (let n of names) {
				if (querys.some(q => n.textContent.includes(q))) {
					n.closest(".r-qklmqi").remove();
					console.log("名前削除: " + query);
				}
			}
		}
		// リポスト以外表示
		for (let r of retweets) {
			for (let d of userdata) {
				if (r.parentNode.href.includes(d.name) && d.sta == "rpexcept") {
					r.closest(".r-qklmqi").remove();
					console.log("リポスト削除: " + d.name);
				}
			}
		}
		for (let m of medias) {
			// メディアポスト以外表示
			for (let d of userdata) {
				if (!m.closest(".r-qklmqi")) {
					closest = "article";
				} else {
					closest = ".r-qklmqi";
				}
				if (m.closest(closest).textContent.includes(d.name) && d.sta == "mediaexcept") {
					m.closest(closest).remove();
					console.log("メディアポスト削除: " + d.name);
				}
			}
			// メディア要素削除
			for (let d of userdata) {
				if (!m.closest(".r-qklmqi")) {
					closest = "article";
				} else {
					closest = ".r-qklmqi";
				}
				if (!m.closest(closest)) {
					continue;
				}
				if (m.closest(closest).textContent.includes(d.name) && d.sta == "mediadelete") {
					if (m.closest(".r-kzbkwu").childNodes[1].textContent == "") {
						m.closest(closest).remove();
					} else {
						m.remove();
					}
					console.log("メディア削除: " + d.name);
				}
			}
		}
		// ワード要素削除
		for (let w of words) {
			for (let d of userdata) {
				if (!w.closest(".r-qklmqi")) {
					closest = "article";
				} else {
					closest = ".r-qklmqi";
				}
				if (w.closest(closest).textContent.includes(d.name) && d.sta == "worddelete") {
					if (
						w.closest(closest).getElementsByClassName("r-1867qdf r-1udh08x r-o7ynqc")
							.length == 0
					) {
						w.closest(closest).remove();
					} else {
						w.remove();
					}
					console.log("ワード削除: " + d.name);
				}
			}
		}
		if (query != new URLSearchParams(location.search).get("q")) {
			query = new URLSearchParams(location.search).get("q");
			if (query != null) {
				console.log("検索単語変更 名前NG: " + query);
			}
		}
		url = new URL(location.href);
	}, optiondata.interval);

	console.log(`更新間隔： ${optiondata.interval}ミリ秒`);
};

chrome.runtime.onMessage.addListener(() => {
	location.reload();
});

const func1 = (t,data,userdata) => {
	for (let d of data) {
		if (new RegExp(d.word).test(t.textContent)) {
			t.remove();
			console.log("ワード削除: " + d.word);
		}
	}
	// メディアポストのみ表示
	for (let d of userdata) {
		if (
			t.textContent.includes(d.name) &&
			d.sta == "mediaonly" &&
			t.getElementsByClassName("r-1867qdf r-1udh08x r-o7ynqc").length == 0
		) {
			t.closest(".r-qklmqi").remove();
			console.log("メディアポスト以外削除: " + d.name);
		}
	}
}