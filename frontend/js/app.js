// frontend/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Fake data for parking occupancy by hour (8 AM - 8 PM)
    const fakeData = {
        labels: [
            '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
            '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
            '6 PM', '7 PM', '8 PM'
        ],
        values: [20, 35, 50, 65, 80, 75, 70, 85, 90, 95, 80, 60, 40] // Percentage full
    };

    // Initialize Parking Occupancy Chart
    initializeParkingChart(fakeData);

    // Initialize Parking Status Widget
    initializeParkingStatusWidget(fakeData);
});

/**
 * Initializes and renders the Parking Occupancy Chart using Chart.js.
 * @param {Object} data - The fake parking occupancy data.
 */
function initializeParkingChart(data) {
    const ctx = document.getElementById('parkingChart').getContext('2d');

    // Determine colors based on occupancy percentage
    const barColors = data.values.map(value => {
        if (value < 50) {
            return 'rgba(75, 192, 192, 0.8)'; // Green
        } else if (value < 80) {
            return 'rgba(255, 205, 86, 0.8)'; // Yellow
        } else {
            return 'rgba(255, 99, 132, 0.8)'; // Red
        }
    });

    // Create the bar chart
    const parkingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels, // Hours from 8 AM to 8 PM
            datasets: [{
                data: data.values, // Percentage full
                backgroundColor: barColors, // Bar colors based on occupancy
                borderColor: barColors.map(color => color.replace('0.8', '1')), // Solid border colors
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to resize within its container
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: false,
                        text: 'Occupancy (%)',
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time of Day',
                        color: '#424242',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false // Hide x-axis grid lines
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}
/**
 * Initializes and updates the Parking Status Widget.
 * @param {Object} data - The fake parking occupancy data.
 */
function initializeParkingStatusWidget(data) {
    const busyStatusElem = document.getElementById('busyStatus');
    const occupancyPercentageElem = document.getElementById('occupancyPercentage');
    const parkingStatusWidget = document.getElementById('parkingStatusWidget');

    /**
     * Determines the overall busy level based on the latest occupancy percentage.
     * @param {number} percentage - The latest occupancy percentage.
     * @returns {string} - The busy level description.
     */
    function determineBusyLevel(percentage) {
        if (percentage >= 90) return "Very Busy";
        if (percentage >= 70) return "Moderately Busy";
        return "Not Busy";
    }

    /**
     * Determines the color based on the busy level.
     * @param {string} busyLevel - The busy level description.
     * @returns {string} - The corresponding color.
     */
    function getStatusColor(busyLevel) {
        switch(busyLevel) {
            case "Very Busy":
                return "red";
            case "Moderately Busy":
                return "orange";
            case "Not Busy":
                return "green";
            default:
                return "#333"; // Default color
        }
    }

    /**
     * Updates the widget with the latest parking status.
     * @param {Object} data - The parking occupancy data.
     */
    function updateWidget(data) {
        const latestPercentage = data.values[data.values.length - 1]; // Latest occupancy percentage
        const busyLevel = determineBusyLevel(latestPercentage);

        busyStatusElem.textContent = `Status: ${busyLevel}`;
        occupancyPercentageElem.textContent = `Occupancy: ${latestPercentage}%`;

        // Set colors based on busy level
        busyStatusElem.style.color = getStatusColor(busyLevel);
        occupancyPercentageElem.style.color = getStatusColor(busyLevel);

        // Update icon color
        const widgetIcon = parkingStatusWidget.querySelector('i');
        widgetIcon.style.color = getStatusColor(busyLevel);
    }

    // Initialize the widget with the latest data
    updateWidget(data);

    // Optional: If you want to update the widget dynamically (e.g., real-time data), set an interval

    setInterval(() => {
        // Fetch new data here and update the widget
    }, 60000); // Update every 60 seconds


    // Add click event listener to scroll to the graph section and open modal
    parkingStatusWidget.addEventListener('click', () => {
        const graphSection = document.getElementById('parkingGraph');
        graphSection.scrollIntoView({ behavior: 'smooth' });

        // Open the modal for more info
        const moreInfoModal = new bootstrap.Modal(document.getElementById('moreInfoModal'));
        moreInfoModal.show();
    });
}