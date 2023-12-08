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

  // 행과 페이지네이션 처음에 사라지게 했다가 행정동 클릭 이벤트 발생 시 다시 보여주기
  var datatableBottom = document.querySelector('.datatable-bottom');
  var mapC = document.querySelector('.map-canvas');

  tableBody.style.display = 'none';
  datatableBottom.style.display = 'none';
  mapC.style.visibility = 'hidden';

  // custom_table 클래스를 가진 tbody의 모든 행에 클릭 이벤트 리스너를 추가합니다.
  var rows = document.querySelectorAll('.custom_table tr');
  rows.forEach(function(row) {
    row.addEventListener('click', function() {
      // 클릭 시 datatable-bottom 클래스와 tbody 태그를 보이게 합니다.
      datatableBottom.style.display = '';
      tableBody.style.display = '';
      mapC.style.visibility = 'visible';
    });
  });


  // video가 끝나면 실행
  // document.getElementById('waiting').addEventListener('ended', function() {
  //   this.style.display = 'none'; // 비디오를 숨깁니다.
  //   document.getElementById('stream-iframe').style.display = 'block'; // iframe을 보이게 합니다.
  // });

  // 비디오 실행 후 4.5초 뒤에 실행
  document.getElementById('waiting').addEventListener('play', function() {
    setTimeout(() => {
        this.style.display = 'none'; // 비디오를 숨깁니다.
        document.getElementById('stream-iframe').style.display = 'block'; // iframe을 보이게 합니다.
    }, 4500); // 2.5초 대기
  });



  // 테이블 행 클릭 시 db에서 데이터 가져와서 이미지 생성
  tableBody.addEventListener('click', function(event) {
    // 클릭된 요소가 'tr'인지 확인
    var row = event.target.closest('tr');
    if (!row) return; // 'tr'이 아니면 함수 종료

    // 클릭된 행의 '행정동', '상세 지역' 컬럼 데이터 추출
    var town = row.cells[0].textContent;
    var region = row.cells[1].textContent;

    // Video 재생
    var video = document.getElementById('waiting');
    video.play();

    // iframe에 소스 설정
    var iframe = document.getElementById('stream-iframe');
    iframe.src = "https://www.youtube.com/embed/wnLaIAiunH8?autoplay=1&si=CpyQIeakC0o5s1UA";

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
          if (index === 0) {
            // 가장 최신 이미지를 custom-box에 표시
            showImageInCustomBox(data.url);
          }
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
    img.style.width = '100%';
    img.style.height = '100%';

    customBox.innerHTML = ''; // 기존 내용을 비우고
    customBox.appendChild(img); // 새 이미지 삽입
  }

});
