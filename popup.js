const checkreg = document.getElementById("checkreg");
const checklim = document.getElementById("checklim");
const lim = document.getElementById("lim");
const newword = document.getElementById("word");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const info = document.getElementById("info");
let limi = "";

chrome.storage.local.get("select", d => newword.value = d.select || "");

gettime = p => {
	let now = new Date();
	now.setDate(now.getDate()+Number(p));
	let y = now.getFullYear();
	let M = now.getMonth() + 1;
	let d = now.getDate();
	let h = now.getHours();
	let m = now.getMinutes();
	let s = now.getSeconds();
	
	if (M < 10)  M = "0" + M;
	if (d < 10)  d = "0" + d;
	if (h < 10)  h = "0" + h;
	if (m < 10)  m = "0" + m;
	if (s < 10)  s = "0" + s;

	return `${y}.${M}.${d} ${h}:${m}:${s}`;
};
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
get = (async () => {
	data = (await chrome.storage.local.get("key")).key;
	data = data.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	info.innerText = `登録ワード数: ${data.length}`;
})();
checkreg.onclick = () => {
	if (checkreg.checked) {
		info.innerText = "[\\u0400-\\u19FF]+$ でアラビア文字が指定できます";
	} else {
		info.innerText = "";
	}
}
checklim.onclick = () => {
	if (checklim.checked) {
		lim.disabled = false;
		lim.value = 1;
		info.innerText = "";
	} else {
		lim.disabled = true;
		lim.value = "";
		info.innerText = "";
	}
};
lim.onchange = () => {
	lim.value = Math.round(lim.value);
	if (lim.value < 1) lim.value = 1;
	if (lim.value > 9999) lim.value = 9999;
}
btn1.onclick = async () => {
	const val = newword.value;
	if (val.search(/^(\s)?$/) != -1) {
		info.innerHTML = "入力してください";
		return;
	}
	if (data.some(d => d.word == val)) {
		info.innerHTML = `${val}は登録済みです`;
		return;
	}
	
	let res = `発射完了<br>ワード： ${val}<br>`;
	if (checkreg.checked) res += `正規表現： あり<br>`;
	else res += `正規表現： なし<br>`;
	if (checklim.checked) {
		res += `期限： ${gettime(lim.value)}まで`;
		limi = gettime(lim.value);
	} else res += `期限： なし`;
	
	data.push({ word: val, regex: checkreg.checked, limit: limi });
	await chrome.storage.local.set({ key: data });
	info.innerHTML = res;
};
btn2.onclick = () => chrome.runtime.openOptionsPage();