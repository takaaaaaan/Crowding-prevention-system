document.addEventListener("DOMContentLoaded", function () {
    // DOM이 완전히 로드된 후에 실행됩니다.

    const elements = [
        { id: 'mainCamera', videoSrc: '../Assets/videos/1.mp4' },
        { id: 'stageLeft', videoSrc: '../Assets/videos/2.mp4' },
        { id: 'stageRight', videoSrc:'../Assets/videos/3.mp4' },
        { id: 'gate1', videoSrc: '../Assets/videos/5.mp4' }
    ];

    // 초기 설정: 중앙 카메라의 비디오를 기본으로 설정
    const videoElement = document.getElementById('video9');
    videoElement.querySelector('source').src = '1.mp4';
    videoElement.load();
    videoElement.play();

    elements.forEach(function (element) {
        document.getElementById(element.id).addEventListener("click", function (e) {
            e.preventDefault(); // 기본 이벤트를 막습니다.

            const videoElement = document.getElementById('video9');
            videoElement.querySelector('source').src = element.videoSrc; // 비디오의 src를 변경합니다.
            videoElement.load(); // 비디오를 다시 로드합니다.
            videoElement.play(); // 비디오를 재생합니다.
        });
    });
});



function initMap() {

    const map1 = new google.maps.Map(document.getElementById('map1'), {
        center: { lat: 37.4979, lng: 127.0276 },
        zoom: 13, // 줌 레벨을 상세하게 보려면 이 값을 더 높게 설정할 수 있습니다.
    });

    const points = [
        new google.maps.LatLng(37.4969, 127.0245),
        //new google.maps.LatLng(37.4989, 127.0286),
        // 여기에 추가적인 좌표를 넣을 수 있습니다.
    ];
    const points_hitmap = [
        new google.maps.LatLng(37.4979, 127.0276),
        new google.maps.LatLng(37.4989, 127.0286),
        new google.maps.LatLng(37.4989, 127.0296),
        new google.maps.LatLng(37.4989, 127.0306),
        new google.maps.LatLng(37.4989, 127.0316),
        new google.maps.LatLng(37.4989, 127.0326),
        // 여기에 추가적인 좌표를 넣을 수 있습니다.
    ];

    // 첫 번째 지도에 마커 추가
    points.forEach(point => {
        const marker = new google.maps.Marker({
            position: point,
            map: map1,
        });
    });

    const heatmap1 = new google.maps.visualization.HeatmapLayer({
        data: points_hitmap,
        map: map1,
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // 1平方メートルあたりにいる人数を仮に設定（この数値は実際のデータに基づくべき）
    let numberOfPeoplePerSquareMeter = 5; // 例えば、4人

    // idによって各indicatorを取得
    let indicator1 = document.getElementById("indicator1");
    let indicator2 = document.getElementById("indicator2");
    let indicator3 = document.getElementById("indicator3");
    let indicator4 = document.getElementById("indicator4");
    let indicator5 = document.getElementById("indicator5");

    // 人数に応じて背景色を変更
    switch (numberOfPeoplePerSquareMeter) {
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