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
  fetch("assets/json/locations.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      var locations = data;

      locations.forEach(function (location) {
        var markerIconUrl = location.color === "red" ? "assets/img/run01.svg" : "assets/img/run02.svg";

        var marker = new google.maps.Marker({
          map: map,
          icon: {
            url: markerIconUrl,
            scaledSize: new google.maps.Size(initialIconSize.width, initialIconSize.height),
            anchor: new google.maps.Point(11, 0),
          },
          position: new google.maps.LatLng(location.lat, location.lng),
        });

        markers.push(marker);

        var circleColor = location.color === "red" ? "#FF0000" : "#FFFF00";
        addCircle(map, marker.getPosition(), 500, circleColor);

        var infoWindow = new google.maps.InfoWindow({
          content: '<div id="map_maker"><img src="' + location.img + '" alt=""></div>'
          // content: '<div id="map_maker"><img src="' + location.img + '" alt=""></div>'
        });

        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
      });

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