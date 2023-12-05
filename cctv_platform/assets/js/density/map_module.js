import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';

// Firebase 구성
const firebaseConfig = {
  apiKey: "AIzaSyCbrEtEbg1DTDI65shQkOUWG0FronjSZ7Y",
  authDomain: "watchaut.firebaseapp.com",
  databaseURL: "https://watchaut-default-rtdb.firebaseio.com",
  projectId: "watchaut",
  storageBucket: "watchaut.appspot.com",
  messagingSenderId: "136117526904",
  appId: "1:136117526904:web:e2d0399b33bf662d7da88d",
  measurementId: "G-Q24YJF35Z1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


document.addEventListener('DOMContentLoaded', (event) => {
  var tableBody = document.querySelector('#detail_list tbody');

  tableBody.addEventListener('click', function(event) {
    // 클릭된 요소가 'tr'인지 확인
    var row = event.target.closest('tr');
    if (!row) return; // 'tr'이 아니면 함수 종료

    // 클릭된 행의 '행정동', '상세 지역' 컬럼 데이터 추출
    var town = row.cells[0].textContent;
    var region = row.cells[1].textContent;

    
    const densityRef = ref(database, 'Density/' + '송악면' + '/' + '와차웃 기차역');
    // 데이터 저장을 위한 배열
    let allData = [];

    onValue(densityRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childData = childSnapshot.val();
        var childKey = childSnapshot.key; // 현재 노드의 키 (datetime 값)

        // 날짜 형식 변환
        const parts = childKey.split('T');
        const datePart = parts[0]; // 날짜 부분
        let timePart = parts[1]; // 시간 부분
        // 마지막 '-'를 '.'로 변경
        timePart = timePart.replace(/-([^-]*)$/, '.' + '$1');
        // 나머지 모든 '-'를 ':'로 변경
        timePart = timePart.replace(/-/g, ':');
        const formattedDateTime = new Date(datePart + 'T' + timePart);

        // URL만 저장 (childData 객체 내에 'url' 속성이 있다고 가정)
        if (childData.url) {
          allData.push({ datetime: formattedDateTime, url: childData.url });
        }
      });

      // 데이터를 datetime 기준으로 내림차순 정렬
      allData.sort((a, b) => b.datetime - a.datetime);

      // 가장 최신 데이터 7개 추출
      const latestData = allData.slice(0, 7);
      // console.log('la: ', latestData);

      // 이미지를 표시할 mini-box 요소들을 선택
      var miniBoxes = document.querySelectorAll('.mini-box');

      // 최신 데이터의 URL을 사용하여 각 mini-box에 이미지 삽입
      latestData.forEach((data, index) => {
        if (miniBoxes[index]) {
          // <img> 요소 생성
          var img = document.createElement('img');
          img.src = data.url; // URL 설정
          img.alt = 'Image'; // 대체 텍스트 설정
          img.classList.add('mini-box-image'); // CSS 클래스 추가

          // 기존 내용을 비우고 새 이미지 삽입
          miniBoxes[index].innerHTML = '';
          miniBoxes[index].appendChild(img);

          // 클릭 이벤트 리스너 추가
          miniBoxes[index].addEventListener('click', function() {
            showImageInCustomBox(data.url);
          });
        }
      });
    });
  });


  // custom-box에 이미지를 표시하는 함수
  function showImageInCustomBox(url) {
    var customBox = document.querySelector('.custom-box');
    var img = document.createElement('img');
    img.src = url;
    img.alt = 'Selected Image';
    img.style.width = '100%'; // 필요에 따라 조정
    img.style.height = '100%'; // 필요에 따라 조정

    customBox.innerHTML = ''; // 기존 내용을 비우고
    customBox.appendChild(img); // 새 이미지 삽입
  }

});
