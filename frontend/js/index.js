// frontend/js/index.js

document.addEventListener('DOMContentLoaded', () => {
    // Fetch occupancy data and render the chart when the page loads
    fetchOccupancyData();
});

function fetchOccupancyData() {
    fetch('http://localhost:5001/api/occupancy/chart')
        .then(response => response.json())
        .then(data => {
            // Process the data and render the chart
            renderOccupancyChart(data);
        })
        .catch(error => {
            console.error('Error fetching occupancy data:', error);
        });
}

function renderOccupancyChart(data) {
    const ctx = document.getElementById('parkingChart').getContext('2d');

    // Assuming the data is an array of occupancy percentages per hour or per day
    // Example data format:
    // data = {
    //     labels: ['6 AM', '7 AM', '8 AM', '9 AM', ..., '6 PM'],
    //     occupancyPercentages: [10, 20, 35, 50, ..., 70]
    // };

    const parkingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels, // Time labels
            datasets: [{
                label: 'Parking Occupancy (%)',
                data: data.occupancyPercentages,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                fill: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Occupancy (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}