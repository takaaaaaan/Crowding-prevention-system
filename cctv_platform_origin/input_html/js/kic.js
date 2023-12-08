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
          location = "기차역";
          break;
        case 2:
          
          animal_status = "<span class='badge bg-warning'>조사 중</span>";
          location = "공원";
          break;
        case 3:
          
          animal_status = "<span class='badge bg-success'>해결 완료</span>";
          location = "도서관";
          break;
        case 4:
          
          animal_status = "<span class='badge bg-danger'>대응 중</span>";
          location = "상업 지구";
          break;
        case 5:
          
          animal_status = "<span class='badge bg-success'>해결 완료</span>";
          location = "병원";
          break;
        case 6:
          
          animal_status = "<span class='badge bg-warning'>조사 중</span>";
          location = "학교";
          break;
        case 7:
          
          animal_status = "<span class='badge bg-danger'>대응 중</span>";
          location = "시장";
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
  
      });

      // 클래스 이름이 'datatable-empty'인 첫 번째 요소를 찾습니다.
      var emptyRow = document.querySelector('td.datatable-empty');

      // 해당 요소가 존재하고, 부모 요소가 <tr>인 경우에만 삭제합니다.
      if (emptyRow && emptyRow.parentNode.tagName === 'TR') {
          emptyRow.parentNode.remove();
      }

  });
  
  

  // Firebase Storage 참조
var storageRef = firebase.storage().ref();
var imagesRef = storageRef.child('original_images'); // 여기서 'your_images_folder/'는 이미지가 저장된 폴더 경로입니다.

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

  