export function initActivityChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');

    // Mock data - in real project you would use GitHub API for activity
    const data = {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        datasets: [{
            label: 'Коммиты',
            data: [12, 19, 8, 15, 22, 18, 25, 12, 19, 16, 21, 14],
            borderWidth: 3,
            tension: 0.3
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}