$(function () {
  var customMapStyle = [
    {
      featureType: "all",
      elementType: "labels.text",
      stylers: [
        {
          color: "#878787",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          color: "#f9f5ed",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#c9c9c9",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#aee0f4",
        },
      ],
    },
  ];
  // Google Mapsの初期化
  var map = new google.maps.Map($(".map-canvas")[0], {
    zoom: 13,
    center: new google.maps.LatLng(37.5569567, 126.9252822),
    styles: customMapStyle,
    disableDefaultUI: true,
  });

  var markers = []; // マーカーのリストを保持する配列
  var circles = []; // 円のリストを保持する配列

  // 円を追加する関数
  function addCircle(map, center, initialRadius, color, shouldAnimate) {
    var circle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: center,
      radius: initialRadius,
      visible: true,
      expanding: shouldAnimate, // 円が拡大中かどうかを示すフラグ
    });
    circles.push(circle);
    return circle;
  }
  // 円をアニメーションさせる関数
  function animateCircles() {
    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];

      if (circle.expanding) {
        var newRadius = circle.getRadius() + 10;
        circle.setRadius(newRadius);

        // 一定の大きさに達したら方向を変え、一時的に非表示にする
        if (newRadius > 250) {
          circle.setVisible(false); // 円を非表示にする
          circle.setRadius(0); // 半径を0にリセット
          circle.expanding = false;
        }
      } else {
        // 非表示状態で半径が0の場合、再表示して拡大を開始する
        if (!circle.getVisible() && circle.getRadius() === 0) {
          circle.setVisible(true); // 円を再表示する
          circle.expanding = true;
        } else {
          // 半径が0でなければ縮小を続ける
          var newRadius = circle.getRadius() - 10;
          if (newRadius < circle.initialRadius) {
            circle.setRadius(newRadius);
          }
        }
      }
    }
  }

  // アニメーションの実行
  setInterval(animateCircles, 30); // 30ミリ秒ごとにアニメーションを実行

  // ズームレベルに基づいてアイコンサイズを計算する関数
  function zoomLevelToSize(zoomLevel) {
    var baseSize = 50; // 基準となるサイズ
    var size = Math.max(baseSize - zoomLevel, 8); // ズームレベルに応じてサイズを計算
    return { width: size, height: size };
  }

  // 初期ズームレベルに基づいたアイコンサイズを取得
  var initialIconSize = zoomLevelToSize(map.getZoom());

  fetch("input_html/json/locations야동.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.sort((a, b) => a.number - b.number);

      // 最大の number 値を取得
      var maxNumber = data[data.length - 1].number;

      data.forEach(function (location, index) {
        setTimeout(function () {
          // マーカーの色に応じてアイコンを設定
          var markerIconUrl = "input_html/img/icon/Wild_Boar.svg"; // デフォルトアイコン
          if (location.color === "red") {
            markerIconUrl = "input_html/img/icon/Wild_Boar.svg";
          } else if (location.color === "yellow") {
            markerIconUrl = "input_html/img/icon/Boar.svg";
          } else if (location.color === "green") {
            markerIconUrl = "input_html/img/icon/Wild_Boar.svg"; // 緑色アイコンのURLを指定
          }

          var marker = new google.maps.Marker({
            map: map,
            icon: {
              url: markerIconUrl,
              scaledSize: new google.maps.Size(
                initialIconSize.width,
                initialIconSize.height
              ),
              anchor: new google.maps.Point(11, 0),
            },
            position: new google.maps.LatLng(location.lat, location.lng),
          });

          markers.push(marker);

          // 最大の number 値を持つマーカーのみに円を追加
          if (location.number === maxNumber) {
            var circleColor = "#FFFF00"; // デフォルトは黄色
            if (location.color === "red") {
              circleColor = "#FF0000"; // 赤
            } else if (location.color === "green") {
              circleColor = "#00FF00"; // 緑
            }
            addCircle(map, marker.getPosition(), 200, circleColor, true);
          } else {
            addCircle(map, marker.getPosition(), 200, circleColor, false);
          }

          var infoWindow = new google.maps.InfoWindow({
            content:
              '<div id="map_maker"><img src="' +
              location.img +
              '" alt=""></div>',
          });

          marker.addListener("click", function () {
            infoWindow.open(map, marker);
          });
        }, 1000 * index);
      });
    });

  // マップのズームレベルが変更されたときのイベントリスナー
  map.addListener("zoom_changed", function () {
    var newSize = zoomLevelToSize(map.getZoom());
    markers.forEach(function (marker) {
      marker.setIcon({
        url: marker.getIcon().url,
        scaledSize: new google.maps.Size(newSize.width, newSize.height),
        anchor: new google.maps.Point(11, 0),
      });
    });
  });
});
