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

    // Create the bar chart
    const parkingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels, // Hours from 8 AM to 8 PM
            datasets: [{
                label: 'Parking Occupancy (%)',
                data: data.values, // Percentage full
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