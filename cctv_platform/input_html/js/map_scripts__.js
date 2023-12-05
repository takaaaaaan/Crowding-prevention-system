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
  var map = new google.maps.Map($(".map-canvas")[0], {
    zoom: 13,
    center: new google.maps.LatLng(37.5569567, 126.9252822),
    // center: new google.maps.LatLng(37.5646423, 126.9376344),
    styles: customMapStyle,
    disableDefaultUI: true,
  });

  var markers = []; // マーカーのリストを保持する配列
  var circles = []; // 円のリストを保持する配列

  function addCircle(map, center, radius, color) {
    var circle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: center,
      radius: radius,
    });
    circles.push(circle);
    return circle;
  }

  // ズームレベルに基づいてアイコンサイズを計算する関数
  function zoomLevelToSize(zoomLevel) {
    var baseSize = 40; // 基準となるサイズ
    var size = Math.max(baseSize - zoomLevel, 8); // ズームレベルに応じてサイズを計算
    return { width: size, height: size };
  }

  // 初期ズームレベルに基づいたアイコンサイズを取得
  var initialIconSize = zoomLevelToSize(map.getZoom());

  // JSONデータの取得とマーカーの配置
  fetch("input_html/json/locations.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      var locations = data;

      locations.forEach(function (location) {
        // マーカーのアイコンの色を設定（例：赤または黄色）
        var markerIconUrl =
          location.color === "red"
            ? "input_html/img/icon/run01.svg"
            : "input_html/img/icon/run02.svg";

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
        console.log(marker); // Markerオブジェクトを確認
        markers.push(marker); // マーカーを配列に追加

        // 円の色もJSONのcolor属性に基づいて設定
        var circleColor = location.color === "red" ? "#FF0000" : "#FFFF00"; // 赤または黄色

        addCircle(map, marker.getPosition(), 500, circleColor); // 원 크기

        var info = new SnazzyInfoWindow({
          marker: marker,
          content:
            '<div id="map_maker"><img src="' + location.img + '" alt=""></div>',
          closeOnMapClick: false,
          padding: "0px",
          border: false,
          offset: {
            top: "0px",
          },
        });

        info.open();
      });
      // マーカー配置後にマップの中心を再設定
      map.setCenter(new google.maps.LatLng(37.5569567, 126.9252822));
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
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
