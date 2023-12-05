var firebaseConfig = {
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
  

// Firebase Storage 참조
var storageRef = firebase.storage().ref();
var imagesRef = storageRef.child('original_images');

var miniBoxes = document.querySelectorAll(".mini-box");
var customBox = document.querySelector(".custom-box");
var lastClickedIndex = -1;
var lastImageElement = null;

imagesRef.listAll().then(function (result) {
    result.items.forEach(function (imageRef, index) {
        // 이미지 URL 가져오기
        imageRef.getDownloadURL().then(function (url) {
            if (index < miniBoxes.length) {
                var imgElement = createImageElement(url, index);
                miniBoxes[index].appendChild(imgElement);

                if (index === 0) {
                    handleClickOnImage(imgElement, index);
                }
            }
        });
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
    }

    if (lastClickedIndex !== index) {
        customBox.innerHTML = '';
        var clonedImage = imgElement.cloneNode(true);
        customBox.appendChild(clonedImage);
        lastImageElement = imgElement;
    }

    lastClickedIndex = index;
}

  