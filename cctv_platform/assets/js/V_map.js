function initMap(lat, lng) {
  var mapProp = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 18,
    disableDefaultUI: true
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  var marker = new google.maps.Marker({
    position: mapProp.center,
    map: map,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const firstVideo = document.querySelector('.grid-item_V video');
  if (firstVideo) {
    activateItem(firstVideo);
  }
});

function activateItem(video) {
  const activeItem = document.querySelector('.active-grid-item');
  if (activeItem) {
    activeItem.classList.remove('active-grid-item');
  }
  video.parentNode.classList.add('active-grid-item');

  const miniImages = video.getAttribute('data-mini-image').split(',');
  const miniBoxContainer = document.querySelector('.mini-box-container');
  const customBox = document.getElementById('customBox');

  while (miniBoxContainer.firstChild) {
    miniBoxContainer.removeChild(miniBoxContainer.firstChild);
  }

  miniImages.forEach((image, index) => {
    const miniBox = document.createElement('div');
    miniBox.className = 'mini-box';
    miniBox.style.backgroundImage = `url('${image}')`;
    miniBoxContainer.appendChild(miniBox);

    miniBox.addEventListener('click', function() {
      customBox.style.backgroundImage = this.style.backgroundImage;
    });

    if (index === 0) {
      customBox.style.backgroundImage = `url('${image}')`;
    }
  });

  const lat = video.getAttribute('data-lat');
  const lng = video.getAttribute('data-lng');
  initMap(lat, lng);

  document.querySelectorAll('.grid-item_V video').forEach(v => v.pause());
  video.play();
}

document.querySelectorAll('.grid-item_V video').forEach(video => {
  video.addEventListener('click', function(e) {
    e.stopPropagation();
    activateItem(this);
  });
});
