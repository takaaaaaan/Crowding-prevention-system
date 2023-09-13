// chart.js
document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.querySelector('.box3 canvas');  // 수정된 부분

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6시', '8시', '9시', '10시', '11시', '12시', '13시'],  // 수정된 부분
            datasets: [{
                label: '밀집도 변화',
                data: [35, 39, 45, 57, 59, 70, 80],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        minStepSize: 1,
                        maxTicksLimit: 6
                    }
                }]
            }
        }
    });
});
