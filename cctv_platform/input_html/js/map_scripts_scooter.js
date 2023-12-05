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
    zoom: 18,
    center: new google.maps.LatLng(37.5569567, 126.9252822),
    styles: customMapStyle,
    disableDefaultUI: true,
  });

  var markers = []; // マーカーのリストを保持する配列
  var circles = []; // 円のリストを保持する配列

  // 円を追加する関数
  function addCircle(map, center, initialRadius, color) {
    var circle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.6,
      map: map,
      center: center,
      radius: initialRadius,
      visible: true,
    });
    circles.push(circle);
    return circle;
  }

  // ズームレベルに基づいてアイコンサイズを計算する関数
  function zoomLevelToSize(zoomLevel) {
    var baseSize = 50; // 基準となるサイズ
    var size = Math.max(baseSize - zoomLevel, 8); // ズームレベルに応じてサイズを計算
    return { width: size, height: size };
  }

  // 初期ズームレベルに基づいたアイコンサイズを取得
  var initialIconSize = zoomLevelToSize(map.getZoom());

  fetch("input_html/json/locations야동02.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.sort((a, b) => a.number - b.number);

      data.forEach(function (location) {
        var markerIconUrl = "input_html/img/icon/scooter.svg"; // 共通アイコンURL

        var iconSize = new google.maps.Size(
          initialIconSize.width,
          initialIconSize.height
        );
        var anchorPoint = new google.maps.Point(
          iconSize.width / 2,
          iconSize.height / 2
        ); // アイコンの中心をアンカーポイントに設定

        var marker = new google.maps.Marker({
          map: map,
          icon: {
            url: markerIconUrl,
            scaledSize: iconSize,
            anchor: anchorPoint, // アンカーポイントを設定
          },
          position: new google.maps.LatLng(location.lat, location.lng),
        });

        markers.push(marker);

        // 最大の number 値を持つマーカーにのみ円を追加
        if (location.number === data[data.length - 1].number) {
          var circleColor = "#ff0000";
          addCircle(map, marker.getPosition(), 10, circleColor);
        }
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
