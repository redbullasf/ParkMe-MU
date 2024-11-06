// frontend/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Parking Occupancy Chart
    initializeParkingChart();
});

/**
 * Fetches parking occupancy data from the backend and renders the chart.
 * For now, we'll use fake data.
 */
function initializeParkingChart() {
    const ctx = document.getElementById('parkingChart').getContext('2d');

    // Fake data for parking occupancy by hour (8 AM - 8 PM)
    const fakeData = {
        labels: [
            '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
            '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
            '6 PM', '7 PM', '8 PM'
        ],
        values: [20, 35, 50, 65, 80, 75, 70, 85, 90, 95, 80, 60, 40] // Percentage full
    };

    // Create the bar chart
    const parkingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fakeData.labels, // Hours from 8 AM to 8 PM
            datasets: [{
                label: 'Parking Occupancy (%)',
                data: fakeData.values, // Percentage full
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Semi-transparent blue
                borderColor: 'rgba(54, 162, 235, 1)', // Solid blue border
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to resize within its container
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100, // Maximum value set to 100%
                    ticks: {
                        callback: function(value) {
                            return value + '%'; // Append '%' to y-axis labels
                        }
                    },
                    title: {
                        display: true,
                        text: 'Percentage Full (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time of Day'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Parking Occupancy by Hour in Maynooth',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '%';
                        }
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        }
    });
}