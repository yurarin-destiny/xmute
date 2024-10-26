const info = document.getElementById("info"),
	flexbox = document.getElementById("flexbox"),
	dels = document.getElementsByClassName("del"),
	del2s = document.getElementsByClassName("del2"),
	atags = document.getElementsByTagName("a"),
	user = document.getElementById("user"),
	intervaltx = document.getElementById("interval"),
	checknameng = document.getElementById("checknameng"),
	checkreflesh = document.getElementById("checkreflesh"),
	checkreply = document.getElementById("checkreply"),
	checkrepost = document.getElementById("checkrepost"),
	checklike = document.getElementById("checklike"),
	checkimpre = document.getElementById("checkimpre"),
	checkbook = document.getElementById("checkbook"),
	checkfollow = document.getElementById("checkfollow"),
	checkfollower = document.getElementById("checkfollower"),
	fieldreplace = document.getElementById("fieldreplace"),
	checkneko = document.getElementById("checkneko"),
	checkinu = document.getElementById("checkinu"),
	checkkitune = document.getElementById("checkkitune"),
	save = document.getElementById("save"),
	savetx = document.getElementById("savetx"),
	loadtx = document.getElementById("loadtx");
let data,
	userdata,
	opdata,
	change = false,
	tid;

// chrome.storage.sync 1kb 18lines, 8kb 144lines, 100kb, 1800lines

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
const set = async () => {
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata: userdata });
	changefun();
};

const write = async () => {
	data = (await chrome.storage.local.get("key")).key;
	userdata = (await chrome.storage.local.get("userdata")).userdata;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata });

	info.innerText = `登録ワード数: ${data.length}　登録ユーザー数: ${userdata.length}`;
	flexbox.innerHTML = "";
	
	let res = '1: 非表示ワード<br>';
	if (data.length == 0) {
		flexbox.innerHTML = res + "<div class='option'>登録されていません</div>";
	} else {
		res += "<table><thead><tr><td>ワード</td><td>期限</td><td></td></tr></thead><tbody>";
		data.forEach((d, i) => {
			if (d.regex) res += `<tr><td><b>/${d.word}/</b></td>`;
			else res += `<tr><td>${d.word}</td>`;
			if (d.limit) res += `<td>${d.limit}</td>`;
			else res += "<td>-</td>";
			res += `<td><button class="del" value="${i}">削除</button></td>`;
		});
		res += "</tbody></table>";
		if (data.length > 1) {
			res +=
				`<div class="right"><a href="#">${data.length}件すべて削除</a></div>`;
		}
		flexbox.insertAdjacentHTML("beforeend", res);

		atags[0].onclick = () => {
			if (confirm(`NGワードをすべて削除します`)) {
				data = [];
				set();
				write();
			}
		};
	}
	for (let i in dels) {
		dels[i].onclick = () => {
			if (confirm(`${data[i].word}を削除します`)) {
				data.splice(i, 1);
				set();
				write();
			}
		};
	}

	let res2 = '2: 一部ポスト表示ユーザー<br>';
	if (userdata.length == 0) {
		user.innerHTML = res2 + "<div class='option'>登録されていません</div>";
	} else {
		res2 +=
			"<table><thead><tr><td>アカウントID</td><td>表示設定</td><td>期限</td><td></td></tr></thead><tbody>";
		userdata.forEach((d, i) => {
			res2 += `<tr><td>@${d.name}</td><td>`;
			switch (d.sta) {
				case "rponly":
					res2 += "リポストのみ";
					break;
				case "rpexcept":
					res2 += "リポスト以外";
					break;
				case "mediaonly":
					res2 += "メディアポストのみ";
					break;
				case "mediaexcept":
					res2 += "メディアポスト以外";
					break;
				case "worddelete":
					res2 += "文章削除＆メディアのみ";
					break;
				case "mediadelete":
					res2 += "メディア削除＆文章のみ";
					break;
			}
			res2 += "</td><td>";
			if (d.limit) res2 += d.limit;
			else res2 += "-";
			res2 += `</td><td><button class="del2" value="${i}">削除</button></td></tr>`;
		});
		res2 += "</tbody></table>";
		if (userdata.length > 1) {
			res +=
				`<div class="right"><a href="#">${userdata.length}件すべて削除</a></div>`;
		}
		user.innerHTML = res2;
		atags[1].onclick = () => {
			if (confirm(`一部表示ユーザーをすべて削除します`)) {
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

	opdata = (await chrome.storage.local.get("option")).option;
	intervaltx.value = opdata.interval;
	checknameng.checked = opdata.searchnameng;
	checkreflesh.checked = opdata.reflesh;
	checkreply.checked = opdata.reply;
	checkrepost.checked = opdata.repost;
	checklike.checked = opdata.like;
	checkimpre.checked = opdata.impre;
	checkbook.checked = opdata.book;
	checkfollow.checked = opdata.follow;
	checkfollower.checked = opdata.follower;
	checkneko.checked = opdata.neko;
	checkinu.checked = opdata.inu;
	checkkitune.checked = opdata.kitune;
};

intervaltx.onchange = () => {
	intervaltx.value = Math.round(intervaltx.value);
	if (intervaltx.value < 50) intervaltx.value = 50;
}
save.onclick = async () => {
	opdata = {
		interval: intervaltx.value,
		searchnameng: checknameng.checked,
		reflesh: checkreflesh.checked,
		reply: checkreply.checked,
		repost: checkrepost.checked,
		like: checklike.checked,
		impre: checkimpre.checked,
		book: checkbook.checked,
		follow: checkfollow.checked,
		follower: checkfollower.checked,
		neko: checkneko.checked,
		inu: checkinu.checked,
		kitune: checkkitune.checked,
	};
	await chrome.storage.local.set({ option: opdata });
	write();
	changefun();
	alert("保存しました");
}
savetx.onclick = () => {
	let text = [data, userdata, opdata],
		blob = new Blob([JSON.stringify(text)], { type: "text/plain" });
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
	if (file.length != 3 || typeof file[2].searchnameng != "boolean" || file[2].interval < 50) {
		alert("読み込めませんでした");
		return;
	}
	let searchbool;
	if (file[2].searchnameng) searchbool = "あり";
	else searchbool = "なし";
	
	if (confirm(
		"以下の設定を読み込みます。\n\n" +
		`登録ワード数: ${file[0].length}、 登録ユーザー数: ${file[1].length}\n` +
		`更新間隔: ${file[2].interval}ミリ秒、 検索単語名前非表示: ${searchbool}`)
	) {
		await chrome.storage.local.set({ key: file[0] });
		await chrome.storage.local.set({ userdata: file[1] });
		await chrome.storage.local.set({ option: file[2] });
		write();
	}
}
const changefun = () => {
	change = true;
	chrome.tabs.query({}, tabs => {
		for (t of tabs) {
			if (t.url) {
				if (t.url.includes("https://x.com")) {
					tid = t.id;
				}
			}
		}
	});
};
document.onvisibilitychange = () => {
	if (change && tid != undefined) {
		console.log(tid);
		chrome.tabs.sendMessage(tid, "");
	}
	change = false;
};
write();

/*chrome.tabs.query({}, tabs => {
	for (t of tabs) {
		t.url = t.url ?? "";
		console.log(t.url.includes("option.html"));
	}
	console.log(tabs);
});*/