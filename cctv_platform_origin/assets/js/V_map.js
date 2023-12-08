function initMap(lat, lng) {
  var mapProp = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 18,
    disableDefaultUI: true // 이 줄을 추가하여 기본 UI를 비활성화
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  // 지정된 위치에 마커를 추가
  var marker = new google.maps.Marker({
    position: mapProp.center,
    map: map,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    }
  });
}

document.querySelectorAll('.grid-item_V video').forEach(video => {
  video.addEventListener('click', function(e) {
    e.stopPropagation();

    // 기존 활성화된 아이템 초기화 및 현재 비디오 활성화
    const activeItem = document.querySelector('.active-grid-item');
    if (activeItem) {
      activeItem.classList.remove('active-grid-item');
    }
    this.parentNode.classList.add('active-grid-item');

    const miniImages = this.getAttribute('data-mini-image').split(',');
    const miniBoxContainer = document.querySelector('.mini-box-container');
    const customBox = document.getElementById('customBox');

    // 기존 mini-box 요소들을 제거
    while (miniBoxContainer.firstChild) {
      miniBoxContainer.removeChild(miniBoxContainer.firstChild);
    }

    // 새로운 mini-box 요소들을 추가하고 클릭 이벤트 리스너를 설정합니다.
    miniImages.forEach((image, index) => {
      const miniBox = document.createElement('div');
      miniBox.className = 'mini-box';
      miniBox.style.backgroundImage = `url('${image}')`;
      miniBoxContainer.appendChild(miniBox);

      // mini-box 클릭 시 customBox로 이미지 이동
      miniBox.addEventListener('click', function() {
        customBox.style.backgroundImage = this.style.backgroundImage;
      });

      // 첫 번째 mini-box의 이미지를 customBox에 설정합니다.
      if (index === 0) {
        customBox.style.backgroundImage = `url('${image}')`;
      }
    });



    // 현재 비디오의 데이터 속성에서 좌표를 가져옴
    const lat = this.getAttribute('data-lat');
    const lng = this.getAttribute('data-lng');

    // 지도 업데이트
    initMap(lat, lng);

    // 모든 비디오 멈춤, 현재 비디오 재생
    document.querySelectorAll('.grid-item_V video').forEach(v => v.pause());
    this.play();

    // 현재 비디오의 부모 요소를 활성화
    this.parentNode.classList.add('active-grid-item');
  });
});

