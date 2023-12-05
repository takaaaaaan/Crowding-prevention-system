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
var areaChart; // 전역 변수로 차트 인스턴스를 저장
var pieChart;
var barChart;
var donutChart;
let series = {
          "monthDataSeries1": {
            "dates": []
          }
        };


document.addEventListener("DOMContentLoaded", () => {
  const densityRef = ref(database, 'Density');
  let sums;
  let counts;

  // 테이블 행 생성
  onValue(densityRef, (snapshot) => {
    var tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = '';
  
    // 행정동 노드를 순회
    snapshot.forEach((townSnapshot) => {
      const townName = townSnapshot.key;
      const regionData = townSnapshot.val();
  
      // 상세 지역 노드를 순회
      Object.keys(regionData).forEach((regionName) => {
        var numberedNodes = Object.keys(regionData[regionName]);
  
        var dateNodes = Object.keys(regionData[regionName]);

        if (dateNodes.length > 0) {
          // 날짜 형식의 노드 중 가장 최신 날짜를 가진 노드 찾기
          var latestDateKey = dateNodes.reduce((latest, current) => {
            var latestDate = new Date(latest);
            var currentDate = new Date(current);
            return currentDate > latestDate ? current : latest;
          });

          // 해당 노드의 possession_rate 가져오기
          var latestPossessionRate = regionData[regionName][latestDateKey].possession_rate;
  
          var row = document.createElement('tr');
  
          // 행정동 셀 생성 및 추가
          var townCell = document.createElement('td');
          townCell.textContent = townName;
          row.appendChild(townCell);
  
          // 상세 지역 셀 생성 및 추가
          var regionCell = document.createElement('td');
          regionCell.textContent = regionName;
          row.appendChild(regionCell);
  
          // 상태 셀 생성 및 추가
          var statusCell = document.createElement('td');
          var statusSpan = document.createElement('span');
  
          if (latestPossessionRate <= 40) {
            statusSpan.className = 'badge bg-success';
            statusSpan.textContent = '여유';
          } else if (latestPossessionRate <= 60) {
            statusSpan.className = 'badge bg-warning';
            statusSpan.textContent = '경고';
          } else {
            statusSpan.className = 'badge bg-danger';
            statusSpan.textContent = '위험';
          }
  
          statusCell.appendChild(statusSpan);
          row.appendChild(statusCell);
  
          // 테이블에 행 추가
          tableBody.appendChild(row);
        } else {
          console.log(`No numbered nodes found for region: ${regionName}`);
        }
      });
    });
  });


  // tbody에 이벤트 리스너를 설정
  var tableBody = document.querySelector('.table-hover tbody');

  tableBody.addEventListener('click', function(event) {
    // 클릭된 요소가 'tr'인지 확인
    var row = event.target.closest('tr');
    if (!row) return; // 'tr'이 아니면 함수 종료

    // 클릭된 행의 '행정동', '상세 지역', '상태' 컬럼 데이터 추출
    var town = row.cells[0].textContent;
    var region = row.cells[1].textContent;
    // var state = row.cells[2].textContent;

    var densityRates = [];
    var possessionRates = [];
    var numOfPs = [];
    var dateTimes = [];

    createChart();

    // Firebase 데이터베이스에서 해당 지역 데이터 검색
    const densityRef = ref(database, 'Density/' + town + '/' + region);
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
        const formattedDateTime = datePart + 'T' + timePart;
        dateTimes.push(formattedDateTime); // 변환된 datetime 값을 dateTimes 배열에 추가

        if (childData.density_rate) {
          densityRates.push(childData.density_rate);
        }
        if (childData.num_of_p) {
          numOfPs.push(childData.num_of_p);
        }
        if (childData.possession_rate) {
          possessionRates.push(childData.possession_rate);
        }
      });

      updateChart(numOfPs, densityRates, possessionRates, dateTimes);
    });
  });

  
  // 차트 생성 함수
  function createChart() {
    // 기존 차트 인스턴스가 있으면 파괴
    if (areaChart) {
      areaChart.destroy();
    }
    if (pieChart) {
      pieChart.destroy();
    }
    if (barChart) {
      barChart.destroy();
    }

    // sums와 counts를 초기화
    sums = new Array(8).fill(0);
    counts = new Array(8).fill(0);

    // 차트 설정
    areaChart = new ApexCharts(document.querySelector("#areaChart"), {
      series: [{
        name: "밀집 인구 수",
        data: []
      }],
      chart: {
          type: 'area',
          height: 180,
          zoom: {
          enabled: false
          }
      },
      dataLabels: {
      enabled: false
      },
      stroke: {
      curve: 'straight'
      },
      subtitle: {
          text: 'Density Movements',
          align: 'left'
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
          type: 'datetime',
      },
      yaxis: {
          opposite: true
      },
      legend: {
          horizontalAlign: 'left'
      }
    });
    areaChart.render();

    pieChart = new Chart(document.querySelector('#pieChart'), {
      type: 'pie',
      data: {
        labels: [
          '밀집 공간',
          '여유 공간'
        ],
        datasets: [{
          label: '비율',
          data: [],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 4
        }]
      }
    });

    barChart = new Chart(document.querySelector('#barChart'), {
      type: 'bar',
      data: {
        labels: ['0 ~ 3시', '3 ~ 6시', '6 ~ 9시', '9 ~ 12시', '12 ~ 15시', '15 ~ 18시', '18 ~ 21시', '21 ~ 0시'],
        datasets: [{
          label: 'Bar Chart',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(102, 153, 204, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgba(102, 153, 204)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  let currentIndex = 0; // bar chart 처리한 마지막 데이터의 인덱스를 추적하는 전역 변수

  // 차트 갱신 함수
  function updateChart(numOfPs, densityRates, possessionRates, dateTimes) {
    let rate = [0, 0];

    // area chart
    if (numOfPs.length > 0) {
      // 최신 20개 데이터만 사용
      let latestSeries = numOfPs.slice(-20);
      let latestCategories = dateTimes.slice(-20);

      // 차트 업데이트
      areaChart.updateSeries([{
          data: latestSeries
      }]);
      areaChart.updateOptions({
          xaxis: {
              categories: latestCategories
          }
      });
    }

    // bar chart
    if (dateTimes.length > 0 && currentIndex < dateTimes.length) {
      while (currentIndex < dateTimes.length) {
        const dateTime = dateTimes[currentIndex];
        const hour = new Date(dateTime).getHours();
        const timePeriodIndex = Math.floor(hour / 3); // 시간대 인덱스 계산 (0~7)

        // 해당 시간대에 데이터 추가
        sums[timePeriodIndex] += numOfPs[currentIndex];
        counts[timePeriodIndex]++;

        // 다음 요소로 이동
        currentIndex++;
      }
      currentIndex = 0;

      // 각 시간대별 평균 계산
      const averages = sums.map((sum, index) => {
        if (counts[index] === 0) return 0; // 데이터가 없는 경우 0 반환
        return parseFloat((sum / counts[index]).toFixed(3)); // 소수점 세 자리에서 반올림
      });

      // 차트 데이터 업데이트
      barChart.data.datasets[0].data = averages;
      barChart.update();
    }

    // donut chart
    if (densityRates.length > 0) {  
      // 이미 있는 차트 삭세
      document.getElementById('donutChart').innerHTML = '';

      const totalAverage = parseFloat((densityRates.reduce((sum, rate) => sum + rate, 0) / densityRates.length).toFixed(2));
      const latestRate = parseFloat(densityRates[densityRates.length - 1].toFixed(2));
    
      google.charts.load('current', {packages: ['corechart']});

      // 차트 생성 및 그리기
      google.charts.setOnLoadCallback(function() {
        donutChart = new google.visualization.PieChart(document.getElementById('donutChart'));
        donutChart.draw(google.visualization.arrayToDataTable([
            ['Metric', 'Value'],
            ['밀집도 총합', totalAverage],
            ['현재 밀집도', latestRate]
        ]), {
            pieHole: 0.4,
            height: 150,
            colors: ['#008000', '#FFA500'] // 녹색과 주황색
        });
      });
    }

    // pie chart
    if (possessionRates.length > 0) {
      const latestRate = possessionRates[possessionRates.length - 1];
      rate[0] = latestRate;
      rate[1] = 100 - latestRate;

      pieChart.data.datasets[0].data = rate;
      pieChart.update();
    }
  }
});