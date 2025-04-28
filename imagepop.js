// // 保存された画像URLを取得して表示
// chrome.storage.local.get("selectedImageUrl", data => {
// 	if (data.selectedImageUrl) {
// 		document.getElementById("image").src = data.selectedImageUrl;
// 	}
// });
// const btn2 = document.getElementById("btn2");

// btn2.onclick = () => {
//     close();
// }

document.getElementById("showConfirmBtn").addEventListener("click", function () {
	showCustomConfirm().then(result => {
		if (result) {
			alert("You clicked Yes!");
		} else {
			alert("You clicked No!");
		}
	});
});

// ダイアログを表示し、結果を返す関数
function showCustomConfirm() {
	return new Promise(resolve => {
		const confirmDialog = document.getElementById("customConfirm");
		const yesButton = document.getElementById("confirmYesBtn");
		const noButton = document.getElementById("confirmNoBtn");

		// ダイアログを表示
		confirmDialog.style.display = "flex";

		// Yes ボタンをクリック
		yesButton.onclick = function () {
			confirmDialog.style.display = "none";
			resolve(true); // Yes が選択された場合
		};

		// No ボタンをクリック
		noButton.onclick = function () {
			confirmDialog.style.display = "none";
			resolve(false); // No が選択された場合
		};
	});
}