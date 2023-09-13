
// 地図の初期化
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: { lat: 37.5191503, lng: 127.1273644 },
        disableDefaultUI: true,
    });
}

// 同意ボタン、チェックボックス、そして同意が必要なdivの要素を取得
const agreeButton = document.getElementById("agree-button");
const consentCheckbox = document.getElementById("consent-checkbox");
const consentBox = document.querySelector(".consent-box");

// チェックボックスが変更されたときの処理
consentCheckbox.addEventListener("change", function () {
    if (this.checked) {
        agreeButton.disabled = false;
    } else {
        agreeButton.disabled = true;
    }
});

// 同意ボタンがクリックされたときの処理
agreeButton.addEventListener("click", function () {
    alert("이용 계약에 동의했습니다.");
    consentBox.remove();
    window.location.href = 'user_map.html';
});
