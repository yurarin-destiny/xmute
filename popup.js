const radio = document.getElementsByName("radio"),
	checkreg = document.getElementById("checkreg"),
	newword = document.getElementById("word"),
	select = document.getElementById("select"),
	newuser = document.getElementById("newuser"),
	checklim = document.getElementById("checklim"),
	lim = document.getElementById("lim"),
	btn1 = document.getElementById("btn1"),
	btn2 = document.getElementById("btn2"),
	info = document.getElementById("info");
let limi = "",
	res = "",
	data,
	userdata,
	change = false;

chrome.storage.local.get("select", d => (newword.value = d.select || ""));

const gettime = p => {
	let now = new Date();
	now.setDate(now.getDate() + Number(p));
	let y = now.getFullYear(),
		M = now.getMonth() + 1,
		d = now.getDate(),
		h = now.getHours(),
		m = now.getMinutes(),
		s = now.getSeconds();

	if (M < 10) M = "0" + M;
	if (d < 10) d = "0" + d;
	if (h < 10) h = "0" + h;
	if (m < 10) m = "0" + m;
	if (s < 10) s = "0" + s;

	return `${y}.${M}.${d} ${h}:${m}:${s}`;
};
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
const get = (async () => {
	data = (await chrome.storage.local.get("key")).key;
	userdata = (await chrome.storage.local.get("userdata")).userdata;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata });
	info.innerText = `登録ワード数: ${data.length}
		登録ユーザー数: ${userdata.length}`;
})();
radio[0].onchange = () => {
	newword.value = newuser.value;
	newuser.value = "";
	newuser.disabled = true;
	newword.disabled = false;
};
radio[1].onchange = () => {
	newuser.value = newword.value;
	newword.value = "";
	newuser.disabled = false;
	newword.disabled = true;
};
checklim.onclick = () => {
	lim.disabled = !lim.disabled;
	if (checklim.checked) {
		lim.value = 1;
	} else {
		lim.value = "";
	}
};
lim.onchange = () => {
	lim.value = Math.round(lim.value);
	if (lim.value < 1) lim.value = 1;
	if (lim.value > 9999) lim.value = 9999;
};
btn1.onclick = async () => {
	if (radio[0].checked) {
		// ワードモード
		const val = newword.value;
		switch (val) {
			case "":
				info.innerHTML = "入力してください";
				return;
			case "ド迫力":
			case "ガンドハ":
			case "顔ドハ":
			case "ガシャドクリョ":
			case "顔面発射のド迫力":
				window.open("http://www.nicovideo.jp/watch/sm31367029", "_blank");
				break;
			case "サイドチェスト":
				window.open("http://www.nicovideo.jp/watch/sm34910251", "_blank");
				break;
			case "向井":
			case "チョコボール向井":
				window.open("http://www.nicovideo.jp/watch/sm42868507", "_blank");
				break;
			case "ミッフィー":
				window.open("http://www.nicovideo.jp/watch/sm41928877", "_blank");
				break;
			case "鈴木(淫夢)":
			case "鈴木（淫夢）":
				window.open("http://www.nicovideo.jp/watch/sm36602415", "_blank");
				break;
			case "強精コンビ":
				window.open("http://www.nicovideo.jp/watch/sm31888403", "_blank");
				break;
			case "ダブルバイセップス":
				window.open("http://www.nicovideo.jp/watch/sm35295767", "_blank");
				break;
			case "マルティスポーター":
				window.open("http://www.nicovideo.jp/watch/sm35289493", "_blank");
				break;
			case "バックポージング":
				window.open("http://www.nicovideo.jp/watch/sm32961207", "_blank");
				break;
			case "ルイ・ヴィトン":
			case "ルイヴィトン":
				window.open("https://jp.louisvuitton.com/", "_blank");
				break;
		}
		if (data.some(d => d.word == val)) {
			info.innerHTML = `${val}は登録済みです`;
			return;
		}
		
		res = `発射完了<br>ワード： ${val}<br>`;
		if (checkreg.checked) res += `正規表現： あり<br>`;
		else res += `正規表現： なし<br>`;
		if (checklim.checked) {
			res += `期限： ${gettime(lim.value)}まで`;
			limi = gettime(lim.value);
		} else res += `期限： なし`;
		data.push({ word: val, regex: checkreg.checked, limit: limi });
		await chrome.storage.local.set({ key: data });
		change = true;
		chrome.storage.local.set({ select: "" });
	} else {
		// ユーザーモード
		newuser.value = newuser.value.replace("@", "");
		const val = newuser.value;
		if (!val) {
			info.innerHTML = "入力してください";
			return;
		}
		if (/[^0-9a-zA-Z_]/.test(val)) {
			info.innerHTML = "英数字（ _ を含む）IDを入力してください";
			return;
		}
		if (userdata.some(d => d.name == val) && userdata.some(d => d.sta == select.value)) {
			info.innerHTML = `@${val}（${selectval(select.value)}）は登録済みです`;
			return;
		}

		res = `発射完了<br>ユーザー： @${val}<br>`;
		res += `${selectval(select.value)}<br>`;
		if (checklim.checked) {
			res += `期限： ${gettime(lim.value)}まで`;
			limi = gettime(lim.value);
		} else res += `期限： なし`;

		userdata.push({ name: val, limit: limi, sta: select.value });
		await chrome.storage.local.set({ userdata: userdata });
		change = true;
		chrome.storage.local.set({ select: "" });
	}
	info.innerHTML = res;
	
};
btn2.onclick = () => chrome.runtime.openOptionsPage();

document.onvisibilitychange = () => {
	chrome.tabs.query({}, tabs => {
		for (t of tabs) {
			if (t.url && change) {
				if (t.url.includes("https://x.com")) {
					chrome.tabs.sendMessage(t.id, "");
				}
			}
		}
	});
};

const selectval = v => {
	switch (v) {
		case "rponly":
			return "リポストのみ表示";
		case "rpexcept":
			return "リポスト以外表示";
		case "mediaonly":
			return "メディアポストのみ表示";
		case "mediaexcept":
			return "メディアポスト以外表示";
		case "worddelete":
			return "文章削除＆メディアのみ表示";
		case "mediadelete":
			return "メディア削除＆文章のみ表示";
	}
};