// Rating.js
document.addEventListener("DOMContentLoaded", function() {
    // 1平方メートルあたりにいる人数を仮に設定（この数値は実際のデータに基づくべき）
    let numberOfPeoplePerSquareMeter = 4; // 例えば、4人

    // idによって各indicatorを取得
    let indicator1 = document.getElementById("indicator1");
    let indicator2 = document.getElementById("indicator2");
    let indicator3 = document.getElementById("indicator3");
    let indicator4 = document.getElementById("indicator4");
    let indicator5 = document.getElementById("indicator5");

    // 人数に応じて背景色を変更
    switch(numberOfPeoplePerSquareMeter) {
        case 6:
            indicator1.style.backgroundColor = "rgba(128, 0, 128, 0.5)"; // 透明度がある紫色
            break;
        case 5:
            indicator2.style.backgroundColor = "rgba(128, 0, 128, 0.5)";
            break;
        case 4:
            indicator3.style.backgroundColor = "rgba(128, 0, 128, 0.5)";
            break;
        case 3:
            indicator4.style.backgroundColor = "rgba(128, 0, 128, 0.5)";
            break;
        case 2:
            indicator5.style.backgroundColor = "rgba(128, 0, 128, 0.5)";
            break;
        default:
            // デフォルトの背景色や処理
            break;
    }
});
