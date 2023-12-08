

window.onload = function () {
  // customBox 초기화
  const customBox = document.getElementById('customBox');
  customBox.style.backgroundImage = '';
  customBox.style.backgroundSize = 'cover';
  customBox.style.backgroundPosition = 'center';

  // mini-box-container 초기화
  const miniBoxContainer = document.querySelector('.mini-box-container');
  while (miniBoxContainer.firstChild) {
    miniBoxContainer.removeChild(miniBoxContainer.firstChild);
  }
};

// mini-box 클릭 이벤트 리스너 설정
document.querySelectorAll('.mini-box').forEach(box => {
  box.addEventListener('click', function () {
    var customBox = document.getElementById('customBox');
    customBox.style.backgroundImage = this.style.backgroundImage;
    customBox.style.backgroundSize = 'cover';
    customBox.style.backgroundPosition = 'center';
  });
});

document.querySelectorAll('.grid-item_V video').forEach(video => {
  video.addEventListener('click', function (e) {
    e.stopPropagation(); // 상위 요소로의 이벤트 전파를 막음

    // 활성화된 아이템이 있는지 확인하고 초기화
    const activeItem = document.querySelector('.active-grid-item');
    if (activeItem) {
      activeItem.classList.remove('active-grid-item');
    }

    // 클릭된 비디오의 부모 요소를 활성화
    this.parentNode.classList.add('active-grid-item');
  });
});

document.querySelectorAll('.grid-item_V video').forEach(video => {
  video.addEventListener('click', function (e) {
    e.stopPropagation(); // 상위 요소로의 이벤트 전파를 막음

    // 활성화된 아이템이 있는지 확인하고 초기화
    const activeItem = document.querySelector('.active-grid-item');
    if (activeItem) {
      activeItem.classList.remove('active-grid-item');
    }

    // 모든 비디오를 멈추고 현재 클릭된 비디오만 재생
    document.querySelectorAll('.grid-item_V video').forEach(v => {
      if (v !== this) {
        v.pause();
      }
    });

    // 클릭된 비디오의 부모 요소를 활성화
    this.parentNode.classList.add('active-grid-item');
  });
});

// 케이스 링크에 클릭 이벤트 리스너 추가
document.querySelectorAll('.table tbody tr').forEach((row, index) => {
  row.addEventListener('click', function() {
    let videoFile;
    switch (index) {
      case 0: // Case 1
        videoFile = 'Fell1.mp4';
        break;
      case 1: // Case 2
        videoFile = 'Fell2.mp4';
        break;
      case 2: // Case 3
        videoFile = 'Fell3.mp4';
        break;
      // 여기에 필요한 경우 추가 케이스를 추가할 수 있습니다.
    }

    // 해당 비디오 파일과 일치하는 video 요소 찾기
    const videoToActivate = Array.from(document.querySelectorAll('.grid-item_V video'))
      .find(video => video.querySelector('source').getAttribute('src').includes(videoFile));

    if (videoToActivate) {
      // video 클릭 이벤트 핸들러와 동일한 로직 적용
      videoToActivate.click();
    }
  });
});