// Firebase初期化
const firebaseConfig = {
    apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
    authDomain: "model-craft-391306.firebaseapp.com",
    databaseURL: "https://model-craft-391306-98762.firebaseio.com/",
    projectId: "model-craft-391306",
    storageBucket: "model-craft-391306.appspot.com",
    messagingSenderId: "54080375203",
    appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
    measurementId: "G-GN648GFCTK"
};
// Firebase初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 地図の初期化関数
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: { lat: 37.5191503, lng: 127.1273644 },
        disableDefaultUI: true,
    });

    let marker;

    if (navigator.geolocation) {
        const watchID = navigator.geolocation.watchPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);

            // 既存のマーカーがあれば削除
            if (marker) {
                marker.setMap(null);
            }

            // 新しいマーカーを設置
            marker = new google.maps.Marker({
                position: pos,
                map: map
            });

            // 位置情報をRealtime Databaseに送る
            sendLocationToRealtimeDB(position);

        }, () => {
            alert('エラー: 位置情報の取得に失敗しました。');
        });
    } else {
        alert('エラー: このブラウザは位置情報をサポートしていません。');
    }
}

// 位置情報をRealtime Databaseに送る関数
function sendLocationToRealtimeDB(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // ここではユーザID（uid）を使ってデータを一意に識別
    const uid = "some-unique-uid";  // 通常は認証から取得

    database.ref('locations/' + uid).set({
        latitude: latitude,
        longitude: longitude
    }, (error) => {
        if (error) {
            console.error("Error writing location: ", error);
        } else {
            console.log("Location successfully written!");
        }
    });
}

// 地図の初期化関数を呼び出す
initMap();
