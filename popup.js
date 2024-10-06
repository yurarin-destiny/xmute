const radio = document.getElementsByName("radio");
const checkreg = document.getElementById("checkreg");
const newword = document.getElementById("word");
const checkrp = document.getElementById("checkrp");
const newuser = document.getElementById("newuser");
const checklim = document.getElementById("checklim");
const lim = document.getElementById("lim");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const info = document.getElementById("info");
let limi = "";
let res = "";
let sta = "";
let data;
let userdata;

chrome.storage.local.get("select", d => (newword.value = d.select || ""));

gettime = (p) => {
	let now = new Date();
	now.setDate(now.getDate() + Number(p));
	let y = now.getFullYear();
	let M = now.getMonth() + 1;
	let d = now.getDate();
	let h = now.getHours();
	let m = now.getMinutes();
	let s = now.getSeconds();

	if (M < 10) M = "0" + M;
	if (d < 10) d = "0" + d;
	if (h < 10) h = "0" + h;
	if (m < 10) m = "0" + m;
	if (s < 10) s = "0" + s;

	return `${y}.${M}.${d} ${h}:${m}:${s}`;
};
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
get = (async () => {
	data = (await chrome.storage.local.get("key")).key;
	userdata = (await chrome.storage.local.get("userdata")).userdata;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });
	info.innerText = `登録ワード数: ${data.length}
		登録リポストユーザー数： ${userdata.length}`;
})();
radio[0].onchange = () => {
	newuser.value = "";
	newuser.disabled = true;
	newword.disabled = false;
};
radio[1].onchange = () => {
	newword.value = "";
	newuser.disabled = false;
	newword.disabled = true;
};
checkreg.onclick = () => {
	if (checkreg.checked) {
		info.innerText = "[\\u0400-\\u19FF]+$ でアラビア文字が指定できます";
	} else {
		info.innerText = "";
	}
};
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
};
btn1.onclick = async () => {
	if (radio[0].checked) {
		// ワードモード
		const val = newword.value;
		if (/^(\s)+$/.test(val)) {
			info.innerHTML = "入力してください";
			return;
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
	} else {
		// ユーザーモード
		newuser.value = newuser.value.replace("@", "");
		const val = newuser.value;
		if (/^(\s)+$/.test(val)) {
			info.innerHTML = "入力してください";
			return;
		}
		if (/[^0-9a-zA-Z_]/.test(val)) {
			info.innerHTML = "英数字（ _ を含む）のIDを入力してください";
			return;
		}
		if (userdata.some(d => d.name == val)) {
			info.innerHTML = `@${val}は登録済みです`;
			return;
		}

		res = `発射完了<br>ユーザー： @${val}<br>`;
		if (checkrp.checked) {
			res += `リポストのみ表示<br>`;
			sta = "rponly";
		}
		if (checklim.checked) {
			res += `期限： ${gettime(lim.value)}まで`;
			limi = gettime(lim.value);
		} else res += `期限： なし`;
		
		userdata.push({ name: val, limit: limi, sta: sta });
		await chrome.storage.local.set({ userdata: userdata });
	}
	info.innerHTML = res;
};
btn2.onclick = () => chrome.runtime.openOptionsPage();
