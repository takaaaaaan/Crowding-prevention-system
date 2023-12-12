import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, remove, get, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// btn-save-text 버튼 클릭 시 텍스트 추출해서 일치하는 폴더를 생성하고 이미지를 저장하도록 코드 추가 필요


document.addEventListener("DOMContentLoaded", () => {
  // "Main" 섹션에 대한 참조 생성
  const mainRef = ref(database, "Main");
  const storage = getStorage(); // Firebase Storage 인스턴스 가져오기
  // const imagesRef = storageRef(storage, `/MainObject/${cardText}/`);  // Firebase Storage에서 동적으로 경로 설정
  const imagesRef = storageRef(storage, `/MainObject/computer/`);

  // 처음에 맵 시야에서 안보여줬다가 클릭 시 보여줌(보여주기식)
  var mapC = document.querySelector('.map-canvas');
  mapC.style.visibility = 'hidden';

  // 페이지 리로딩 시 db의 값을 읽어 카드 생성
  get(mainRef).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        // 각 자식 노드의 데이터를 가져옴
        const childData = childSnapshot.val();
  
        // addCard 함수에 각 노드의 데이터를 매개변수로 넘겨줌(db에 있는 데이터 대로 카드 생성)
        addCard(childData);
      });
    } else {
      console.log("No data available");
    }
  });

  // 로딩 비디오가 끝나면 stream이 보이게 설정
  document.getElementById('waiting').addEventListener('ended', function() {
    this.style.display = 'none'; // 비디오를 숨깁니다.
    setTimeout(function() {
      document.getElementById('stream-iframe').style.display = 'block'; // iframe을 보이게 합니다.
    }, 2000);
  });
  

  // 엔터키로 객체 입력이 들어올 경우 동작 시작
  document.getElementById('groundingDinoForm').addEventListener('submit', (e) => {
    var inputText = document.getElementById("inputText").value;
    e.preventDefault();
    saveObjectToFirebase(inputText);    // 새 카드가 생성되면 데이터베이스 저장 함수를 호출
    document.getElementById("inputText").value = ""; // 입력 필드 초기화
       
    console.log('폼이 제출되었습니다.');
  });


  // 카드 요소 생성
  function addCard(inputText) {
    var newCard = document.createElement("div");
    newCard.className = "alert alert-primary alert-dismissible fade show";
    newCard.setAttribute("role", "alert");
    newCard.innerHTML =
        '<img src="assets/img/file.svg" class="Folder_Icon" />' +
        "<span class='card-text'>" +
        inputText +
        "</span>" + // 카드에 표시될 텍스트
        '<button type="button" class="btn-save-text"></button>' +
        '<button type="button" class="btn-close" aria-label="Close"></button>';

    // card-body 요소에 새 카드 추가
    var cardBody = document.querySelector(".card-body.pb-0");
    cardBody.appendChild(newCard);

    // addBtnEvent 함수 호출, 새로운 카드에 이벤트 리스너 추가
    addBtnEvent(newCard);
  }


  // 전역 함수로 할당, 파이어베이스 저장 함수 콜
  window.saveObjectToFirebase = function (text) {
    var targetObject =
      text || document.querySelector('[name="target_objects"]').value;
    saveObject(targetObject);
  };


  // Save object to Firebase
  function saveObject(targetObject) {
    // --taka version--
    // 기존 데이터 삭제
    remove(mainRef);
    
    // 새 데이터 저장
    set(mainRef, { object: targetObject })
      .then(() => {
        alert("객체가 성공적으로 저장되었습니다.");
        window.location.reload(); // Alert 확인 후 페이지 리로딩
      })
      .catch((error) => {
        alert("저장에 실패했습니다: " + error.message);
      });


    // --ajs version--
    // 고유한 키를 가진 새 노드 생성
    // const newChildRef = push(mainRef);

    // // 새 노드에 targetObject 데이터 저장
    // set(newChildRef, targetObject)
    //   .then(() => {
    //     alert("객체가 성공적으로 저장되었습니다.");
    //     window.location.reload(); // Alert 확인 후 페이지 리로딩
    //   })
    //   .catch((error) => {
    //     alert("저장에 실패했습니다: " + error.message);
    //   });


      // 여기에 텍스트 이름의 폴더를 생성하고 이미지도 같이 저장하는 로직 필요
  }


  // 카드 버튼 이벤트 달아주기
  function addBtnEvent(newCard) {
    const cardText = newCard.querySelector('.card-text').textContent; // 카드 텍스트 가져오기

    // 삭제 시 일치하는 값을 db와 태그 둘다 삭제
    newCard.querySelector('.btn-close').addEventListener('click', function() {
      if (confirm('이 객체를 삭제하시겠습니까?')) {
        // "Main" 섹션의 자식 노드들을 조회
        get(mainRef).then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              // 일치하는 데이터 찾기
              if (childSnapshot.val() === cardText) {
                remove(ref(database, `Main/${childSnapshot.key}`)); // 해당 데이터 삭제
              }
            });
            newCard.remove(); // 카드 삭제
          }
        }).catch((error) => {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        });
      }
    });    
  
    // db의 특정 폴더 최신 7개 이미지 mini-box에 삽입
    newCard.querySelector('.btn-save-text').addEventListener('click', function() {
      
      
      // 맵 다시 보여주기
      mapC.style.visibility = 'visible';


      // Video 재생
      var video = document.getElementById('waiting');
      video.play();

      // iframe에 소스 설정
      var iframe = document.getElementById('stream-iframe');
      iframe.src = "https://www.youtube.com/embed/xEdizb8xpCs?autoplay=1&si=xLkDsU5TS4uNgsiO&amp;clip=UgkxtRJeP02mHMZundPVVzxmU2yKFq3JhtX1&amp;clipt=EJC_BRjwkwk";
      

      setInterval(refreshImages, 5000);

    });
  }
  

  // custom-box에 이미지를 표시하는 함수
  function showImageInCustomBox(url) {
    var customBox = document.querySelector('.custom-box');
    var img = document.createElement('img');
    img.src = url;
    img.alt = 'Selected Image';
    img.style.width = '100%';
    img.style.height = '100%';

    customBox.innerHTML = ''; // 기존 내용을 비우고
    customBox.appendChild(img); // 새 이미지 삽입
  }


  function refreshImages() {
    listAll(imagesRef)
      .then((res) => {
        const latestImages = res.items.slice(0, 7);
        const miniBoxes = document.querySelectorAll('.mini-box');
  
        // mini-box 요소 초기화
        miniBoxes.forEach(box => {
          while (box.firstChild) {
            box.removeChild(box.firstChild);
          }
        });
  
        // mini-box에 이미지 추가
        Promise.all(latestImages.map(imageRef => getDownloadURL(imageRef)))
          .then(urls => {
            urls.forEach((url, index) => {
              if (index < miniBoxes.length) {
                const img = document.createElement('img');
                img.src = url;
                miniBoxes[index].appendChild(img);
  
                // 클릭 이벤트 리스너 추가
                miniBoxes[index].addEventListener('click', function() {
                  showImageInCustomBox(url);
                });
              }
            });
          })
          .catch(error => {
            console.error('이미지 URL을 가져오는 중 오류 발생:', error);
          });
      })
      .catch((error) => {
        console.error('Storage에서 파일 목록을 가져오는 중 오류 발생:', error);
      });
  }


});