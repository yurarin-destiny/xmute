const info = document.getElementById("info");
const flexbox = document.getElementById("flexbox");
const dels = document.getElementsByClassName("del");
const atags = document.getElementsByTagName("a");
const intervaltx = document.getElementById("interval");
const checknameng = document.getElementById("checknameng");
const save = document.getElementById("save");
let data = [];
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

set = async () => await chrome.storage.local.set({ key: data });

write = async () => {
	data = (await chrome.storage.local.get("key")).key;
	data = data.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	
	info.innerText = `登録ワード数: ${data.length}`;
	flexbox.innerHTML = "";

	if (data.length == 0) {
		flexbox.innerHTML =
			`<div class="flex-item">1: 非表示ワード<br><br>
			登録されていません`;
	} else {
		let res = `<div class="flex-item">1: 非表示ワード<br><br>`;
		data.forEach((d, i) => {
			if (d.regex) res += `<b>/${d.word}/</b>`;
			else res += `${d.word}`;
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
	alert("保存しました");
}

write();