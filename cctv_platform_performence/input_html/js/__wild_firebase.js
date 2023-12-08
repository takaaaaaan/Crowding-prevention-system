const firebaseConfig = {
  apiKey: "AIzaSyCbrEtEbg1DTDI65shQkOUWG0FronjSZ7Y",
  authDomain: "watchaut.firebaseapp.com",
  databaseURL: "https://watchaut-default-rtdb.firebaseio.com",
  projectId: "watchaut",
  storageBucket: "watchaut.appspot.com",
  messagingSenderId: "136117526904",
  appId: "1:136117526904:web:e2d0399b33bf662d7da88d",
  measurementId: "G-Q24YJF35Z1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


var imageRef = firebase.database().ref("WildAnimal").limitToFirst(14);
var miniBoxes = document.querySelectorAll(".mini-box");
var customBox = document.querySelector(".custom-box");
var lastClickedIndex = -1;
var lastImageElement = null; // 마지막으로 클릭된 이미지 요소를 저장합니다.

imageRef.once("value", function (snapshot) {
  var index = 0;

  snapshot.forEach(function (childSnapshot) {
    if (index < miniBoxes.length) {
      var imageUrl = childSnapshot.child("ImageURL").val();
      var imgElement = createImageElement(imageUrl, index);
      miniBoxes[index].appendChild(imgElement);

      // 첫 번째 이미지를 customBox에 로드합니다.
      if (index === 0) {
        handleClickOnImage(imgElement, index);
      }

      index++;
    }
  });
});

function createImageElement(url, index) {
  var imgElement = document.createElement("img");
  imgElement.src = url;

  imgElement.addEventListener("click", function () {
    handleClickOnImage(imgElement, index);
  });

  return imgElement;
}


function handleClickOnImage(imgElement, index) {
  if (lastClickedIndex !== -1 && lastImageElement) {
      miniBoxes[lastClickedIndex].appendChild(lastImageElement);
      // 스타일을 설정하는 코드를 제거함
  }

  if (lastClickedIndex !== index) {
      customBox.innerHTML = '';
      var clonedImage = imgElement.cloneNode(true);
      // 클론된 이미지에 대한 스타일 설정 코드를 제거함
      customBox.appendChild(clonedImage);
      lastImageElement = imgElement; // 현재 클릭된 이미지를 저장합니다.
  }

  lastClickedIndex = index;
}
