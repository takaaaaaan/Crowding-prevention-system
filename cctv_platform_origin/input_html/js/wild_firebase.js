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

var dbRef = firebase.database().ref("WildAnimal").limitToFirst(7);

// db에서 읽어온 값으로 테이블 행 생성
dbRef.orderByKey().once("value", function (snapshot) {
  var table = document.querySelector(".table tbody");
  snapshot.forEach(function (childSnapshot) {
    var animalNum = parseInt(childSnapshot.key.replace("wildanimal", ""));
    var animalTime = childSnapshot.child("Time").val();
    var animalCount = childSnapshot.child("Count").val();
    var animalSpecie = childSnapshot.child("Species").val();

    var elapsed, animal_status, location;

    switch (animalNum) {
      case 1:
        elapsed = "2시간";
        animal_status = "<span class='badge bg-danger'>대응 중</span>";
        location = "기차역";
        break;
      case 2:
        elapsed = "1시간 30분";
        animal_status = "<span class='badge bg-warning'>조사 중</span>";
        location = "공원";
        break;
      case 3:
        elapsed = "3시간";
        animal_status = "<span class='badge bg-success'>해결 완료</span>";
        location = "도서관";
        break;
      case 4:
        elapsed = "30분";
        animal_status = "<span class='badge bg-danger'>대응 중</span>";
        location = "상업 지구";
        break;
      case 5:
        elapsed = "10분";
        animal_status = "<span class='badge bg-success'>해결 완료</span>";
        location = "병원";
        break;
      case 6:
        elapsed = "5분";
        animal_status = "<span class='badge bg-warning'>조사 중</span>";
        location = "학교";
        break;
      case 7:
        elapsed = "1시간 45분";
        animal_status = "<span class='badge bg-danger'>대응 중</span>";
        location = "시장";
        break;
      default:
        elapsed = "기본 시간";
        animal_status = "<span class='badge bg-danger'>기본 상태</span>";
        location = "기본 위치";
    }

    var row = document.createElement("tr");
    row.innerHTML = `
            <td>${location}</td>
            <td>${animalSpecie}</td>
            <td>${animalCount}</td>
            <td>${animalTime}</td>
            <td>${elapsed}</td>
            <td>${animal_status}</td>
        `;
    table.appendChild(row);
  });

  // 클래스 이름이 'datatable-empty'인 첫 번째 요소를 탐색
  var emptyRow = document.querySelector('td.datatable-empty');

  // 해당 요소가 존재하고, 부모 요소가 <tr>인 경우에만 삭제
  if (emptyRow && emptyRow.parentNode.tagName === 'TR') {
      emptyRow.parentNode.remove();
  }
});

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
    customBox.innerHTML = "";
    var clonedImage = imgElement.cloneNode(true);
    // 클론된 이미지에 대한 스타일 설정 코드를 제거함
    customBox.appendChild(clonedImage);
    lastImageElement = imgElement; // 현재 클릭된 이미지를 저장합니다.
  }

  lastClickedIndex = index;
}
