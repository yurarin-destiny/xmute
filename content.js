const tweets = document.getElementsByClassName("r-qklmqi r-1adg3ll"),
	replyedtweets = document.getElementsByClassName("css-175oi2r r-1adg3ll r-1ny4l3l"),
	names = document.getElementsByClassName("css-175oi2r r-zl2h9q"),
	retweets = document.getElementsByClassName("css-1jxf684 r-8akbws r-1cwl3u0"),
	medias = document.getElementsByClassName("r-1867qdf r-1udh08x r-o7ynqc"),
	words = document.getElementsByClassName("r-16dba41 r-bnwqim"),
	rrlis = document.getElementsByClassName("css-175oi2r r-xoduu5 r-1udh08x"),
	impre = document.getElementsByClassName("r-18u37iz r-1wbh5a2 r-1471scf"),
	follows = document.getElementsByClassName("r-1b43r93 r-1cwl3u0 r-b88u0q");
let url = new URL(location.href),
	query = new URLSearchParams(location.search).get("q"),
	querys,
	data,
	userdata,
	opdata,
	fetchurl = [],
	fetchani = [],
	fetchcount = 0,
	fetchlimit = 60,
	commus,
	like,
	pow;

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
	data = (await chrome.storage.local.get("key")).key;
	userdata = (await chrome.storage.local.get("userdata")).userdata;
	opdata = (await chrome.storage.local.get("option")).option;
	pow = (await chrome.storage.local.get("power")).power;
	data = data.filter(d => comparetime(d.limit) != "past");
	userdata = userdata.filter(d => comparetime(d.limit) != "past");
	await chrome.storage.local.set({ key: data });
	await chrome.storage.local.set({ userdata });
	
	
	setInterval(() => {
		if (pow) {
			like = document.querySelectorAll('[data-testid="like"]');
			if (opdata.block) {
				for (let l of like) {
					if (l.querySelector("svg").classList.value.includes("r-12c3ph5")) {
						rem(l.closest(".r-qklmqi"));
					}
				}
			}
			commus = document.querySelectorAll('[data-testid="birdwatch-pivot"]');
			switch (opdata.commu) {
				case "tx":
					for (let c of commus) {
						c.parentNode.querySelector('[data-testid="tweetText"]')?.parentNode.remove();
					}
					break;
				case "media":
					for (let c of commus) {
						c.parentNode.querySelector('[data-testid="tweetText"]')?.parentNode.remove();
						c.parentNode.querySelector(".r-14gqq1x")?.remove();
						c.parentNode.querySelector("[aria-labelledby]")?.remove();
					}
					break;
			}

			if (opdata.trend) {
				for (let v of document.querySelectorAll('[data-testid="trend"]')) {
					v.remove();
				}
			}
			for (let t of tweets) {
				func1(t);
			}
			for (let t of replyedtweets) {
				func1(t);
			}
			// リポストのみ表示
			for (let n of names) {
				for (let d of userdata) {
					if (n.textContent.includes(d.name) && d.sta == "rponly") {
						rem(n.closest(".r-qklmqi"));
						console.log("リポスト以外削除: " + d.name);
					}
				}
			}
			// 名前削除
			if (url.pathname == "/search" && opdata.searchnameng && query) {
				querys = query.split(/\s/);
				for (let n of names) {
					if (querys.some(q => n.textContent.replace(/\s/, "").includes(q))) {
						rem(n.closest(".r-qklmqi"));
						console.log("名前削除: " + query);
					}
				}
			}
			// リポスト以外表示
			for (let r of retweets) {
				for (let d of userdata) {
					if (r.parentNode.href.includes(d.name) && d.sta == "rpexcept") {
						rem(r.closest(".r-qklmqi"));
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
					if (m.closest(closest)?.textContent.includes(d.name) && d.sta == "mediaexcept") {
						rem(m.closest(closest));
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
							rem(m.closest(closest));
						} else {
							rem(m);
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
					if (w.closest(closest)?.textContent.includes(d.name) && d.sta == "worddelete") {
						if (w.closest(closest).getElementsByClassName("r-1867qdf r-1udh08x r-o7ynqc").length == 0) {
							rem(w.closest(closest));
						} else {
							rem(w);
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
			for (let r of rrlis) {
				if (!r.closest("[aria-label]")) {
					continue;
				}
				if (r.closest("[aria-label]").dataset.testid == "reply" && opdata.reply) {
					r.firstChild.textContent = "";
				}
				if (r.closest("[aria-label]").dataset.testid == "retweet" && opdata.repost) {
					r.firstChild.textContent = "";
				}
				if (r.closest("[aria-label]").dataset.testid == "like" && opdata.like) {
					r.firstChild.textContent = "";
				}
				if (r.closest("[aria-label]").href?.includes("analytics") && opdata.impre) {
					r.firstChild.textContent = "";
				}
				if (r.closest("[aria-label]").dataset.testid == "bookmark" && opdata.book) {
					r.firstChild.textContent = "";
				}
			}
			for (let f of follows) {
				if (f.parentNode.tagName != "A") {
					continue;
				}
				if (f.parentNode.href.includes("following") && opdata.follow) {
					f.textContent = "";
				}
				if (f.parentNode.href.includes("follower") && opdata.follower) {
					f.textContent = "";
				}
			}
			for (let i of impre) {
				if (opdata.impre) {
					i.childNodes[1].textContent = "";
					i.childNodes[2].textContent = "";
				}
			}
			url = new URL(location.href);
		}
	}, opdata.interval);

	console.log(`更新間隔： ${opdata.interval}ミリ秒`);
};

chrome.runtime.onMessage.addListener(async () => {
	if (opdata.reflesh) {
		location.reload();
	} else {
		data = (await chrome.storage.local.get("key")).key;
		userdata = (await chrome.storage.local.get("userdata")).userdata;
		opdata = (await chrome.storage.local.get("option")).option;
		pow = (await chrome.storage.local.get("power")).power;
		fetchurl = [];
		fetchani = [];
		fetchcount = 0;
	}
});
const func1 = t => {
	for (let d of data) {
		if (opdata.except && t.textContent.includes(query) && d.word == query) {
			continue;
		}
		for (let i of t.getElementsByTagName("img")) {
			if (i.alt.includes(d.word)) {
				rem(t);
				console.log("絵文字削除: " + d.word);
			}
		}
		if (!d.regex) {
			if (t.textContent.includes(d.word)) {
				rem(t);
				console.log("ワード削除: " + d.word);
			}
		} else {
			if (new RegExp(d.word).test(t.textContent)) {
				rem(t);
				console.log("ワード削除: " + d.word);
			}
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
};
const func2 = ani => {
	while (true) {
		if (fetchcount > fetchlimit) {
			fetchcount = 0;
		}
		fetchcount++;
		if (fetchani[fetchcount - 1] == ani) {
			break;
		}
	}
	return fetchurl[fetchcount - 1];
}
const gifneko = () => {
	let dice = Math.round(Math.random() * 19);
	if (dice < 19) {
		return "https://cataas.com/cat";
	} else {
		return "https://cataas.com/cat/gif";
	}
}
const getneko = async () => {
	if (fetchurl.length <= fetchlimit) {
		const fet = await fetch(gifneko()).catch(() => "");
		if (!fet.ok) {
			return chrome.runtime.getURL("image/error_neko.jpg");
		}
		const res = await fet.blob();
		const url = URL.createObjectURL(res);
		fetchurl.push(url);
		fetchani.push(0);
		return url;
	} else {
		if (!fetchani.some(v => v == 0)) {
			fetchlimit += 10;
			return await getneko();
		}
		return func2(0);
	}
};
const getinu = async () => {
	if (fetchurl.length <= fetchlimit) {
		const fet = await (await fetch("https://dog.ceo/api/breeds/image/random")).json();
		if (fet.status != "success") {
			return chrome.runtime.getURL("image/error_inu.jpg");
		}
		const blob = await (await fetch(fet.message)).blob();
		const url = URL.createObjectURL(blob);
		fetchurl.push(url);
		fetchani.push(1);
		return url;
	} else {
		if (!fetchani.some(v => v == 1)) {
			fetchlimit += 10;
			return await getinu();
		}
		return func2(1);
	}
};

const getkitune = async () => {
	if (fetchurl.length <= fetchlimit) {
		const fet = await (await fetch("https://randomfox.ca/floof")).json();
		if (!fet.image) {
			return chrome.runtime.getURL("image/error_kitune.jpg");
		}
		const blob = await (await fetch(fet.image)).blob();
		const url = URL.createObjectURL(blob);
		fetchurl.push(url);
		fetchani.push(2);
		return url;
	} else {
		if (!fetchani.some(v => v == 2)) {
			fetchlimit += 10;
			return await getkitune();
		}
		return func2(2);
	}
};
const getahiru = async () => {
	if (fetchurl.length <= fetchlimit) {
		const fet = await (await fetch("https://foodish-api.com/api/")).json();
		if (!fet?.image) {
			return chrome.runtime.getURL("image/error_ahiru.jpg");
		}
		const fet2 = await (await fetch(fet.image)).blob();
		const url = URL.createObjectURL(fet2);
		fetchurl.push(url);
		fetchani.push(3);
		return url;
	} else {
		if (!fetchani.some(v => v == 3)) {
			fetchlimit += 10;
			return await getahiru();
		}
		return func2(3);
	}
};
const getnekogirl = async e => {
	if (fetchurl.length <= fetchlimit) {
		const fet = await (await fetch("https://nekos.best/api/v2/neko")).json();
		if (!fet?.results) {
			return chrome.runtime.getURL("image/error_neko.jpg");
		}
		const url = fet.results[0];
		fetchurl.push(url);
		fetchani.push(4);
		return url;
	} else {
		if (!fetchani.some(v => v == 4)) {
			fetchlimit += 10;
			return await getnekogirl();
		}
		return func2(4);
	}
};

const befinsert = (e, icon, name, id, date) => {
	e.getElementsByClassName("r-16y2uox r-1wbh5a2 r-1ny4l3l")[0].innerHTML = `
    <div class="css-175oi2r">
        <div class="css-175oi2r r-18u37iz">
            <div class="css-175oi2r r-1iusvr4 r-16y2uox r-ttdzmv"></div>
        </div>
    </div>
<div class="css-175oi2r r-18u37iz">
    <div class="css-175oi2r r-18kxxzh r-1wron08 r-onrtq4 r-1awozwy">
        <div class="css-175oi2r">
            <div class="css-175oi2r r-18kxxzh r-1wbh5a2 r-13qz1uu">
                <div class="css-175oi2r r-1wbh5a2 r-dnmrzs">
                    <div class="css-175oi2r r-bztko3 r-1adg3ll" style="width: 40px; height: 40px;">
                        <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
                        <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                            <div class="css-175oi2r r-1adg3ll r-1pi2tsx r-13qz1uu r-45ll9u r-u8s1d r-1v2oles r-176fswd r-bztko3">
                                <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
                                <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                                    <div class="css-175oi2r r-sdzlij r-1udh08x r-5f1w11 r-u8s1d r-8jfcpp" style="width: calc(100% + 4px); height: calc(100% + 4px);">
                                        <div class="css-175oi2r r-sdzlij r-1udh08x r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd" style="width: calc(100% - 4px); height: calc(100% - 4px);">
                                            <div class="css-175oi2r r-1pi2tsx r-13qz1uu"></div>
                                        </div>
                                        <div class="css-175oi2r r-sdzlij r-1udh08x r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd" style="width: calc(100% - 4px); height: calc(100% - 4px);">
                                            <div class="css-175oi2r r-1pi2tsx r-13qz1uu r-14lw9ot"></div>
                                        </div>
                                        <div class="css-175oi2r r-sdzlij r-1udh08x r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd" style="background-color: rgb(255, 255, 255); width: calc(100% - 4px); height: calc(100% - 4px);">
                                            <div class="css-175oi2r r-1adg3ll r-1udh08x">
                                                <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
                                                <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                                                    <div class="css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af">
                                                        <div class="css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv" style="background-image: url(&quot;${icon}&quot;);"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="css-175oi2r r-sdzlij r-1udh08x r-45ll9u r-u8s1d r-1v2oles r-176fswd" style="width: calc(100% - 4px); height: calc(100% - 4px);">
                                            <div class="css-175oi2r r-12181gd r-1pi2tsx r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu">
        <div class="css-175oi2r r-zl2h9q">
            <div class="css-175oi2r r-k4xj1c r-18u37iz r-1wtj0ep">
                <div class="css-175oi2r r-1d09ksm r-18u37iz r-1wbh5a2">
                    <div class="css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l">
                        <div class="css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l r-1awozwy r-18u37iz" id="id__w9iu5ley2pc">
                            <div class="css-175oi2r r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs">
                                <div class="css-175oi2r r-1wbh5a2 r-dnmrzs">
                                    <div class="css-175oi2r r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs">
                                        <div class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-1udh08x r-3s2u2q" style="text-overflow: unset; color: rgb(15, 20, 25);">
                                            <span class="css-1jxf684 r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc" style="text-overflow: unset;">
                                                <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc" style="text-overflow: unset;">${name}</span>
                                            </span>
                                        </div>
                                        <div class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-18u37iz r-1q142lx" style="text-overflow: unset; color: rgb(15, 20, 25);">
                                            <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-1awozwy r-xoduu5" style="text-overflow: unset;"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="css-175oi2r r-18u37iz r-1wbh5a2 r-1ez5h0i">
                                <div class="css-175oi2r r-1d09ksm r-18u37iz r-1wbh5a2">
                                    <div class="css-175oi2r r-1wbh5a2 r-dnmrzs">
                                        <div class="css-146c3p1 r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-18u37iz r-1wvb978" style="text-overflow: unset; color: rgb(83, 100, 113);">
                                            <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc" style="text-overflow: unset;">@${id}</span>
                                        </div>
                                    </div>
                                    <div aria-hidden="true" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-16dba41 r-1q142lx r-n7gxbd" style="text-overflow: unset; color: rgb(83, 100, 113);"><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc" style="text-overflow: unset;">·</span></div>
                                    <div class="css-175oi2r r-18u37iz r-1q142lx css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-1q142lx r-1w6e6rj r-9aw3ui r-3s2u2q r-1loqt21" style="text-overflow: unset; color: rgb(83, 100, 113);">${date}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="css-175oi2r r-9aw3ui r-1s2bzr4" id="id__x1dulrnw08a">
            <img style="margin: auto; padding-top: 10vh; padding-bottom: 10vh;" src="${chrome.runtime.getURL("image/loading.gif")}">
        </div>
    </div>
</div>`;
};
const insert = async (e, url) => {
	if (typeof url == "string") {
		e.getElementsByClassName("css-175oi2r r-9aw3ui r-1s2bzr4")[0].innerHTML = `
	<div class="css-175oi2r r-9aw3ui">
        <div class="css-175oi2r">
            <div class="css-175oi2r">
                <div class="css-175oi2r r-1ets6dv r-1phboty r-rs99b7 r-1867qdf r-1udh08x r-o7ynqc r-6416eg r-1peqgm7 r-1ny4l3l">
                    <div class="css-175oi2r">
                        <div class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu">
                            <a href="${url}" target="_blank" role="link" class="css-175oi2r r-1pi2tsx r-1ny4l3l r-1loqt21">
                                <div class="css-175oi2r r-1adg3ll r-1udh08x">
                                    <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 60%;"></div>
                                    <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                                        <div class="css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af" style="margin: 0px;">
                                            <div class="css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv" style="background-image: url(&quot;${url}&quot;);"></div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
	} else {
		const blob = await (await fetch(url.url)).blob();
		const img = URL.createObjectURL(blob);
		e.getElementsByClassName("css-175oi2r r-9aw3ui r-1s2bzr4")[0].innerHTML = `
	<div class="css-175oi2r r-9aw3ui">
        <div class="css-175oi2r">
            <div class="css-175oi2r">
                <div class="css-175oi2r r-1ets6dv r-1phboty r-rs99b7 r-1867qdf r-1udh08x r-o7ynqc r-6416eg r-1peqgm7 r-1ny4l3l">
                    <div class="css-175oi2r">
                        <div class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu">
                            <a href="${url.source_url}" target="_blank" role="link" class="css-175oi2r r-1pi2tsx r-1ny4l3l r-1loqt21">
                                <div class="css-175oi2r r-1adg3ll r-1udh08x">
                                    <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
                                    <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                                        <div class="css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af" style="margin: 0px;">
                                            <div class="css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv" style="background-image: url(&quot;${img}&quot;);"></div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div><a href="${url.artist_href}" style="color: #666">by ${url.artist_name}</a>`;
	}
	
};
const rem = async e => {
	if (!opdata.neko && !opdata.inu && !opdata.kitune && !opdata.ahiru && !opdata.nekogirl) {
		e.remove();
		return;
	}
	while (true) {
		const dice = Math.round(Math.random() * 4);
		if (opdata.neko && dice == 0) {;
			befinsert(e, chrome.runtime.getURL("image/neko.jpg"), "neko", "cataas", "2月22日");
			insert(e, await getneko());
			break;
		}
		if (opdata.inu && dice == 1) {
			befinsert(e, chrome.runtime.getURL("image/inu.jpg"), "inu", "dog_api", "11月1日");
			insert(e, await getinu());
			break;
		}
		if (opdata.kitune && dice == 2) {
			befinsert(e, chrome.runtime.getURL("image/kitune.jpg"), "kitune", "randomfox", "4月10日");
			insert(e, await getkitune());
			break;
		}
		if (opdata.ahiru && dice == 3) {
			const date = new Date();
			befinsert(e, chrome.runtime.getURL("image/ahiru.jpg"), "food", "foodish_api", `${date.getMonth() + 1}月${date.getDate()}日`);
			insert(e, await getahiru());
			break;
		}
		if (opdata.nekogirl && dice == 4) {
			befinsert(e, chrome.runtime.getURL("image/nekogirl.jpg"), "nekogirl", "nekosbestAPI", "2月22日");
			insert(e, await getnekogirl());
			break;
		}
	}
}