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
const database = getDatabase(app);  // firebase 초기화
var intervalId; // 인터벌 ID를 저장할 변수
var areaChart; // 전역 변수로 차트 인스턴스를 저장
var pieChart;
var barChart;
var polarAreaChart;
let series = {
          "monthDataSeries1": {
            "dates": []
          }
        }


document.addEventListener("DOMContentLoaded", () => {
  const densityRef = ref(database, 'Density');

  // 테이블 행 생성
  onValue(densityRef, (snapshot) => {
    var tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = '';
  
    // 구 노드를 순회
    snapshot.forEach((townSnapshot) => {
      const townName = townSnapshot.key;
      const regionData = townSnapshot.val();
  
      // 상세 지역 노드를 순회
      Object.keys(regionData).forEach((regionName) => {
        var numberedNodes = Object.keys(regionData[regionName]);
  
        if (numberedNodes.length > 0) {
          // 넘버링된 노드 중 가장 큰 숫자를 가진 노드 찾기
          var latestNodeKey = numberedNodes.reduce((latest, current) => {
            return parseInt(current, 10) > parseInt(latest, 10) ? current : latest;
          });
  
          // 해당 노드의 possession_rate 가져오기
          var latestPossessionRate = regionData[regionName][latestNodeKey].possession_rate;
  
          var row = document.createElement('tr');
  
          // 구 셀 생성 및 추가
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
            if (childData.density_rate) {
                densityRates.push(childData.density_rate);
            }
            if (childData.num_of_p) {
                numOfPs.push(childData.num_of_p);
            }
            if (childData.possession_rate) {
              possessionRates.push(childData.possession_rate);
            }
            if (childData.datetime) {
              dateTimes.push(childData.datetime);
            }
        });
        

        // 새로운 데이터로 차트 생성
        updateChart(numOfPs, densityRates, possessionRates, dateTimes);

    });
  });

  
  // 차트 생성 함수
  function createChart() {
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

    polarAreaChart = new ApexCharts(document.querySelector("#polarAreaChart"), {
      series: [14, 23],
      chart: {
        type: 'polarArea',
        height: 150,
        toolbar: {
          show: true
        }
      },
      labels: ["평균 누적 밀집도", "실시간 밀집도"],
      stroke: {
        colors: ['#fff']
      },
      fill: {
        opacity: 0.8
      },
      colors: ['rgba(0, 227, 150, 0.8)', 'rgba(254, 176, 25, 0.8)']
    }).render();
  }


  // pie chart 현재 처리중인 possessionRates의 인덱스를 추적하는 변수
  let possessionIndex = 0;
  // bar chart
  const sums = new Array(8).fill(0);
  const counts = new Array(8).fill(0);
  let currentIndex = 0; // 현재 인덱스 추적

  // 차트 갱신 함수
  function updateChart(numOfPs, densityRates, possessionRates, dateTimes) {
      let rate = [0, 0];
      // 기존 인터벌 중지
      clearInterval(intervalId);

      intervalId = setInterval(function() {
          // area chart
          if (numOfPs.length > 0) {
              var nextData = numOfPs.shift(); // 배열의 첫 번째 요소 추출

              var updatedSeries = areaChart.w.config.series[0].data;
              updatedSeries.push(nextData);

              // 데이터 포인트가 20개를 넘으면 가장 오래된 데이터 제거
              if (updatedSeries.length > 20) {
                  updatedSeries.shift();
              }

              areaChart.updateSeries([{
                  data: updatedSeries
              }]);
          } else {
              clearInterval(intervalId); // 데이터가 더 이상 없으면 인터벌 중지
          }


          // pie chart
          if (possessionIndex < possessionRates.length) {
              rate[0] = possessionRates[possessionIndex];
              rate[1] = 100 - possessionRates[possessionIndex];

              pieChart.data.datasets[0].data = rate;
              pieChart.update();

              // 다음 인덱스로 이동
              possessionIndex++;
          }


          // bar chart
          // 배열 범위를 넘어가지 않도록 확인
          if (currentIndex < dateTimes.length) {
            const dateTime = dateTimes[currentIndex];
            const hour = new Date(dateTime).getHours();
            const timePeriodIndex = Math.floor(hour / 3);

            // 해당 시간대에 데이터 추가
            sums[timePeriodIndex] += numOfPs[currentIndex];
            counts[timePeriodIndex]++;

            // 다음 요소로 이동
            currentIndex++;

            // 각 시간대별 평균 계산
            const averages = sums.map((sum, index) => {
              if (counts[index] === 0) return 0;
              return parseFloat((sum / counts[index]).toFixed(3));
            });

            // 차트 데이터 업데이트
            barChart.data.datasets[0].data = averages;
            barChart.update();
          }
          

          // polarArea chart
          


      }, 2000);
  }


  



});