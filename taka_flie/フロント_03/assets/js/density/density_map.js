// density animation
document.addEventListener("DOMContentLoaded", function() {
  var leftColumn = document.querySelector('#loactionBox');
  var regionBox = document.querySelector('#regionBox')
  var cctvBox = document.querySelector('#cctvBox');
  var mapBox = document.querySelector('#mapBox');

  leftColumn.classList.add('slide-in-left');
  // loactionBox 애니메이션이 끝난 후 regionBox 애니메이션을 시작
  setTimeout(function() {
    regionBox.classList.add('slide-in-left');
    regionBox.style.visibility = 'visible';
    // regionBox.style.opacity = '1';
  }, 900);
  
  cctvBox.classList.add('slide-in-top');
  mapBox.classList.add('slide-in-bottom');
});