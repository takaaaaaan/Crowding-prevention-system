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
  

  var dbRef = firebase.database().ref("kickboard_results").limitToFirst(7);

var customBox;
var lastClickedIndex;
var lastImageElement;
var miniBoxes;

// 처음 맵 안보이도록 설정
var mapC = document.querySelector('.map-canvas');
mapC.style.visibility = 'hidden';

  

dbRef.orderByKey().once("value", function (snapshot) {
  var table = document.querySelector(".table tbody");
  snapshot.forEach(function (childSnapshot) {
    var animalNum = parseInt(childSnapshot.key.replace("kickboard_key_", ""));
    var animalTime = childSnapshot.child("Time").val();
    var animalCount = childSnapshot.child("Plate_number").val();

    var elapsed, animal_status, location;

    switch (animalNum) {
      case 1:
        
        animal_status = "<span class='badge bg-danger'>대응 중</span>";
        location = "능실 초등학교 사거리";
        break;
      case 2:
        
        animal_status = "<span class='badge bg-warning'>조사 중</span>";
        location = "선문대 셔틀버스 주차장";
        break;
      case 3:
        
        animal_status = "<span class='badge bg-success'>해결 완료</span>";
        location = "홍대입구역 4번출구";
        break;
      case 4:
        
        animal_status = "<span class='badge bg-danger'>대응 중</span>";
        location = "선문대 학생회관";
        break;
      case 5:
        
        animal_status = "<span class='badge bg-success'>해결 완료</span>";
        location = "천안아산역 택시승강장";
        break;
      case 6:
        
        animal_status = "<span class='badge bg-warning'>조사 중</span>";
        location = "호매실도서관";
        break;
      case 7:
        
        animal_status = "<span class='badge bg-danger'>대응 중</span>";
        location = "선문대 지중해밤";
        break;
      default:
        animal_status = "<span class='badge bg-danger'>기본 상태</span>";
        location = "기본 위치";
    }

    var row = document.createElement("tr");
    row.innerHTML = `
            <td>${location}</td>
            <td>${animalTime}</td>
            <td>${animalCount}</td>
            <td>${animal_status}</td>
        `;
    table.appendChild(row);

    // 클릭 이벤트 리스너 추가
    row.addEventListener('click', loadImages);
  });

  // 클래스 이름이 'datatable-empty'인 첫 번째 요소를 찾습니다.
  var emptyRow = document.querySelector('td.datatable-empty');

  // 해당 요소가 존재하고, 부모 요소가 <tr>인 경우에만 삭제합니다.
  if (emptyRow && emptyRow.parentNode.tagName === 'TR') {
    emptyRow.parentNode.remove();
  }
});
  

function loadImages() {
  var storageRef = firebase.storage().ref();
  var imagesRef = storageRef.child('original_images'); // 여기서 'your_images_folder/'는 이미지가 저장된 폴더 경로

  // 맵 다시 보여주기
  mapC.style.visibility = 'visible';

  miniBoxes = document.querySelectorAll(".mini-box"); 
  customBox = document.querySelector(".custom-box");
  lastClickedIndex = -1;
  lastImageElement = null;

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
}


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

  