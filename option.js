const info = document.getElementById("info");
const flexbox = document.getElementById("flexbox");
const dels = document.getElementsByClassName("del");
const del2s = document.getElementsByClassName("del2");
const atags = document.getElementsByTagName("a");
const user = document.getElementById("user");
const intervaltx = document.getElementById("interval");
const checknameng = document.getElementById("checknameng");
const save = document.getElementById("save");
const savetx = document.getElementById("savetx");
const loadtx = document.getElementById("loadtx");
let data;
let userdata;
let optiondata;

// chrome.storage.sync 1kb 18lines, 8kb 144lines, 100kb, 1800lines

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
set = async () => {
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });
}

write = async () => {
	data = (await chrome.storage.local.get("key")).key;
	userdata = (await chrome.storage.local.get("userdata")).userdata;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });
	
	info.innerText = `登録ワード数: ${data.length}`;
	flexbox.innerHTML = "";
	
	let res = '<div class="flex-item">1: 非表示ワード<br><br>';
	if (data.length == 0) {
		flexbox.innerHTML = res + "登録されていません";
	} else {
		data.forEach((d, i) => {
			if (d.regex) res += `<b>/${d.word}/</b>`;
			else res += d.word;
			if (d.limit) res += ` (${d.limit}まで)`;
			res += `<button class="del" value="${i}">削除</button><br>`;
		});
		res += `<div class="right">
				<a href="#">${data.length}件すべて削除</a></div>
				</div>`;

		flexbox.insertAdjacentHTML("beforeend", res);
		
		atags[0].onclick = () => {
			if (confirm(`NGワードをすべて削除します`)) {
				data = [];
				set();
				write();
			}
		}
	}
	for (let i in dels){
		dels[i].onclick = () => {
			if (confirm(`${data[i].word}を削除します`)) {
				data.splice(i, 1);
				set();
				write();
			}
		};
	}
	
	let res2 = "2: リポスト非表示ユーザー<br><br>";
	if (userdata.length == 0) {
		user.innerHTML = res2 + "登録されていません";
	} else {
		userdata.forEach((d, i) => {
			console.log(d);
			res2 += "@"+d.name;
			if (d.sta == "rponly") res2 += ` (リポスト以外非表示)`;
			if (d.limit) res2 += ` (${d.limit}まで)`;
			res2 += `<button class="del2" value="${i}">削除</button><br>`;
		})
		res2 += `<div class="right">
				<a href="#">${userdata.length}件すべて削除</a></div>
				</div>`;
		user.innerHTML = res2;
		atags[1].onclick = () => {
			if (confirm(`非表示ユーザーをすべて削除します`)) {
				userdata = [];
				set();
				write();
			}
		};
	}
	for (let i in del2s) {
		del2s[i].onclick = () => {
			if (confirm(`${userdata[i].name}を削除します`)) {
				userdata.splice(i, 1);
				set();
				write();
			}
		};
	}
	
	optiondata = (await chrome.storage.local.get("option")).option;
	intervaltx.value = optiondata.interval;
	checknameng.checked = optiondata.searchnameng;
}

intervaltx.onchange = () => {
	intervaltx.value = Math.round(intervaltx.value);
	if (intervaltx.value < 100) intervaltx.value = 100;
}
save.onclick = async () => {
	optiondata = { interval: intervaltx.value, searchnameng: checknameng.checked };
	await chrome.storage.local.set({ option: optiondata });
	write();
	alert("保存しました");
}

savetx.onclick = () => {
	let text = [data, userdata, optiondata];
	let blob = new Blob([JSON.stringify(text)], { type: "text/plain" });
	savetx.href = URL.createObjectURL(blob);
	savetx.download = "setting.txt";
}
const reader = new FileReader();
loadtx.onchange = e => {
	reader.readAsText(e.target.files[0]);
};
reader.onload = async () => {
	let file;
	try {
		file = JSON.parse(reader.result);
	} catch (e) {
		alert("読み込めませんでした");
		return;
	}
	if (file.length != 3 || typeof file[2].searchnameng != "boolean" || file[2].interval < 100) {
		alert("読み込めませんでした");
		return;
	}
	let searchbool;
	if (file[2].searchnameng) searchbool = "あり";
	else searchbool = "なし";
	
	if (confirm(
		"以下の設定を読み込みます。\n\n" +
		`登録ワード数: ${file[0].length}、 登録リポストユーザー数: ${file[1].length}\n` +
		`更新間隔: ${file[2].interval}ミリ秒、 検索単語名前非表示: ${searchbool}`)
	) {
		await chrome.storage.local.set({ key: file[0] });
		await chrome.storage.local.set({ userdata: file[1] });
		await chrome.storage.local.set({ option: file[2] });
		write();
	}
}
write();