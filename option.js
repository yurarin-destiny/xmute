const info = document.getElementById("info"),
	flexbox = document.getElementById("flexbox"),
	edits = document.getElementsByClassName("edit"),
	dels = document.getElementsByClassName("del"),
	del2s = document.getElementsByClassName("del2"),
	user = document.getElementById("user"),
	intervaltx = document.getElementById("interval"),
	checknameng = document.getElementById("checknameng"),
	checkreflesh = document.getElementById("checkreflesh"),
	checktrend = document.getElementById("checktrend"),
	checkexcept = document.getElementById("checkexcept"),
	checkblock = document.getElementById("checkblock"),
	checkpalody = document.getElementById("checkpalody"),
	checkbadge = document.getElementById("checkbadge"),
	radcommu = document.getElementById("commu"),
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
	checkahiru = document.getElementById("checkahiru"),
	checknekogirl = document.getElementById("checknekogirl"),
	save = document.getElementById("save"),
	savetx = document.getElementById("savetx"),
	loadtx = document.getElementById("loadtx"),
	ps1 = document.getElementById("ps1"),
	ps2 = document.getElementById("ps2");
let data, userdata, opdata,
	change = false,
	tid,
	checkhide, ngwords, ngwordsave = [],
	checkhide2, ngids, ngidsave = [];

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
const hideword = () => {
	if (checkhide.checked) {
		for (let w of ngwords) {
			ngwordsave.push(w.textContent);
			w.textContent = "****";
		}
	} else {
		ngwordsave.forEach((val, i) => {
			ngwords[i].textContent = val;
			ngwordsave = [];
		});
	}
}
const hideid = () => {
	if (checkhide2.checked) {
		for (let i of ngids) {
			ngidsave.push(i.textContent);
			i.textContent = "@****";
		}
	} else {
		ngidsave.forEach((val, i) => {
			ngids[i].textContent = val;
			ngidsave = [];
		});
	}
};
const write = async () => {
	data = (await chrome.storage.local.get("key")).key;
	userdata = (await chrome.storage.local.get("userdata")).userdata;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata });

	info.innerText = `登録ワード数: ${data.length}　登録ユーザー数: ${userdata.length}`;
	
	let res = '1: 非表示ワード<br>';
	if (data.length == 0) {
		flexbox.innerHTML = res + "<div class='option'>登録されていません</div>";
	} else {
		res += "<table><thead><tr><td>ワード</td><td>期限</td><td></td></tr></thead><tbody>";
		data.forEach((d, i) => {
			if (d.regex) res += `<tr><td><b class="ngword">${d.word}</b></td>`;
			else res += `<tr><td class="ngword">${d.word}</td>`;
			if (d.limit) res += `<td>${d.limit}</td>`;
			else res += "<td>-</td>";
			res += `<td><button class="edit" value="${i}">編集</button></td>`;
			res += `<td><button class="del" value="${i}">削除</button></td>`;
		});
		res += "</tbody></table>";
		res += `<label><input type="checkbox" id="checkhide"> ワードを伏せる</label>`;
		if (data.length > 1) {
			res += `<span class="right"><a href="#" id="alldel1">${data.length}件すべて削除</a></span>`;
		}
		flexbox.innerHTML = res;
		checkhide = document.getElementById("checkhide");
		ngwords = flexbox.getElementsByClassName("ngword");
		if (checkhide) {
			checkhide.onchange = () => {
				hideword();
			};
		}
		if (document.getElementById("alldel1")) {
			document.getElementById("alldel1").onclick = () => {
				if (confirm(`NGワードをすべて削除します`)) {
					data = [];
					set();
					write();
				}
			};
		}
	}
	for (let i in edits) {
		edits[i].onclick = () => {
			const editdata = { word: data[i].word, regex: data[i].regex, limit: data[i].limit };
			chrome.storage.local.set({ editdata });
			chrome.action.openPopup();
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
			res2 += `<tr><td class="ngid">@${d.name}</td><td>`;
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
		res2 += `<label><input type="checkbox" id="checkhide2"> IDを伏せる</label>`;
		if (userdata.length > 1) {
			res2 += `<div class="right"><a href="#" id="alldel2">${userdata.length}件すべて削除</a></div>`;
		}
		user.innerHTML = res2;
		checkhide2 = document.getElementById("checkhide2");
		ngids = user.getElementsByClassName("ngid");
		if (checkhide2) {
			checkhide2.onchange = () => {
				hideid();
			};
		}
		if (document.getElementById("alldel2")) {
			document.getElementById("alldel2").onclick = () => {
				if (confirm(`一部表示ユーザーをすべて削除します`)) {
					userdata = [];
					set();
					write();
				}
			};
		}
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
	if (checkhide) {
		checkhide.checked = opdata.hide;
		if (opdata.hide) hideword();
	}
	if (checkhide2) {
		checkhide2.checked = opdata.hide2;
		if (opdata.hide2) hideid();
	}
	intervaltx.value = opdata.interval;
	checknameng.checked = opdata.searchnameng;
	checkreflesh.checked = opdata.reflesh;
	checktrend.checked = opdata.trend;
	checkexcept.checked = opdata.except;
	checkblock.checked = opdata.block;
	checkpalody.checked = opdata.palody;
	checkbadge.checked = opdata.badge;
	radcommu.commu.value = opdata.commu;
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
	checkahiru.checked = opdata.ahiru;
	checknekogirl.checked = opdata.nekogirl;
};

intervaltx.onchange = () => {
	intervaltx.value = Math.round(intervaltx.value);
	if (intervaltx.value < 50) intervaltx.value = 50;
}
save.onclick = async () => {
	opdata = {
		hide: checkhide?.checked,
		hide2: checkhide2?.checked,
		interval: intervaltx.value,
		searchnameng: checknameng.checked,
		reflesh: checkreflesh.checked,
		trend: checktrend.checked,
		except: checkexcept.checked,
		block: checkblock.checked,
		palody: checkpalody.checked,
		badge: checkbadge.checked,
		commu: radcommu.commu.value,
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
		ahiru: checkahiru.checked,
		nekogirl: checknekogirl.checked,
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
	try {
		reader.readAsText(e.target.files[0]);
	} catch (e) {
		console.log(e);
	}
};
const bool = v => {
	if (v) {
		return "◯";
	} else {
		return "✕";
	}
}
const commuval = v => {
	switch (v) {
		case "none":
			return "なし";
		case "tx":
			return "文章のみ";
		case "media":
			return "文章とメディア";
	}
}
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
	if (
		confirm(
			"以下の設定を読み込みます。\n\n" +
				`登録ワード数: ${file[0].length}、 登録ユーザー数: ${file[1].length}\n` +
				`ワードを伏せる: ${bool(file[2].hide)}、 IDを伏せる: ${bool(file[2].hide2)}、 更新間隔: ${file[2].interval}ミリ秒、 検索単語名前非表示: ${bool(file[2].searchnameng)}\n` +
				`閉じたときの自動更新：${bool(file[2].reflesh)}、 トレンド消去：${bool(file[2].trend)}、 NGワード検索時除外：${bool(file[2].except)}\n` +
				`ブロックしてきたアカウントのポスト非表示：${bool(file[2].block)}、 パロディ表記消去：${bool(file[2].palody)}、 通知バッジ消去：${bool(file[2].badge)}\n` +
				`コミュニティノートポスト：${commuval(file[2].commu)}\n` +
				`リプ：${bool(file[2].reply)}、 リポスト：${bool(file[2].reply)}、 いいね：${bool(file[2].reply)}、 インプレ：${bool(file[2].reply)}\n` +
				`ブックマーク：${bool(file[2].reply)}、 フォロー：${bool(file[2].follow)}、 フォロワー：${bool(file[2].follower)}\n` +
				`ねこ：${bool(file[2].neko)}、 いぬ：${bool(file[2].inu)}、 きつね：${bool(file[2].kitune)}、 食べ物：${bool(file[2].ahiru)}、 猫耳女子：${bool(file[2].nekogirl)}`
		)
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
		chrome.tabs.sendMessage(tid, "op");
	}
	change = false;
};
chrome.runtime.onMessage.addListener(() => {
	write();
});

write();
/*chrome.tabs.query({}, tabs => {
	for (t of tabs) {
		t.url = t.url ?? "";
		console.log(t.url.includes("option.html"));
	}
	console.log(tabs);
});*/

ps1.innerText = `使用している画像API
	・Cat as a service (CATAAS)
	・Dog CEO
	・RandomFox
	・foodish-api.com
	・nekos.best
	
	Special Thanks:
	・MDN Web Docs
	・Chrome for Developers
	・ChatGPT
	・侍エンジニア
	・JavaScript Primer
	・現代の JavaScript チュートリアル
	・Let'sプログラミング
	`;
ps2.innerText = `(1.1.0)
	・通知バッジを消せるようにし、PC版はタイトルに通知の数が出ないようできるようになった。
	
	(1.0.9)
	・X表示仕様変更のため、名前に検索ワードがあると表示されるのを修正。
	・パロディアカウントの文字列を非表示にできるようにした。
	
	(1.0.8)
	・絵文字に対応。
	・コミュニティノートのメディアが非表示にできないのを修正。
	・ポップアップ右上をOFFで薄くなるようにした。
	
	(1.0.7)
	・コミュニティノートがついたポストの文章メディアを消せるか設定できるようにした。
	・代替ツイートに食べ物と猫耳女子を追加。
	・ブロックしてきたアカウントのポストを非表示にできるようにした。
	・ポップアップ右上に電源ボタンを追加。
	
	(1.0.6)
	・動物画像読み込み時の高さを調整。
	・ポップアップにバージョン表示。
	・オプションページに謝辞と更新履歴を追加。
	
	(1.0.5)
	・オプションページの見た目を変えた。
	・登録したワードを編集できるようにした。
	・登録したワード、IDを伏せられるようにした。
	・更新間隔を最短50ミリ秒からにした。
	・トレンドを非表示にできるようにした。
	・NGワードで検索した場合、そのワードは除外するか設定できるようにした。
	・リプ、リポスト、いいね、インプレ、フォロー、フォロワーの数字を非表示にできるようにした。
	・非表示にしたポストを猫、犬、きつねにできるようにし、複数選択でいずれかがランダムで出るようにした。
	
	(1.0.4)
	・正規表現に対応してなかったので対応しました。
	・設定変更後にウィンドウを閉じると自動でXのタブを更新するかどうか設定できるようにしました。
	・リプされたポストがワード削除の対象になってなかったので対応しました。
	
	(1.0.3)
	公開
`;