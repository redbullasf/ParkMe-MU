// frontend/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    const checkoutModal = $('#checkoutModal'); // Using jQuery for Bootstrap modal
    const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');

    // Handle "Check In" button click
    if (checkInBtn) {
        checkInBtn.addEventListener('click', () => {
            // Navigate to map.html
            window.location.href = 'map.html';
        });
    } else {
        console.error('Check-In button not found');
    }

    // Handle "Check Out" button click
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', () => {
            // Show the check-out confirmation modal
            checkoutModal.modal('show');
        });
    } else {
        console.error('Check-Out button not found');
    }

    // Handle "Confirm Check-Out" button click
    if (confirmCheckoutBtn) {
        confirmCheckoutBtn.addEventListener('click', () => {
            // Implement your check-out logic here
            // For example, make an API call to update the parking spot status

            // After successful check-out, close the modal and navigate back to home
            checkoutModal.modal('hide');
            alert('You have successfully checked out.');
            // Optionally, navigate back to home
            window.location.href = 'index.html';
        });
    } else {
        console.error('Confirm Check-Out button not found');
    }

    // Initialize Parking Occupancy Chart
    initializeParkingChart();
});

// Initialize Parking Chart
function initializeParkingChart() {
    console.log('Initializing parking chart');
    const ctx = document.getElementById('parkingChart').getContext('2d');

    fetch('http://localhost:5001/api/parking/occupancy') // Ensure this endpoint exists
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch occupancy data.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Occupancy data fetched:', data);
            const labels = data.labels; // ['Available', 'Occupied']
            const occupancyData = data.values; // [availableSpots, occupiedSpots]

            const parkingChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Parking Spots',
                        data: occupancyData,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)', // Available
                            'rgba(255, 99, 132, 0.2)'  // Occupied
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)', // Available
                            'rgba(255, 99, 132, 1)'  // Occupied
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            precision: 0,
                            title: {
                                display: true,
                                text: 'Number of Spots'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Status'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                }
            });

            window.parkingChart = parkingChart;
        })
        .catch(error => {
            console.error('Error fetching chart data:', error);
            alert('Unable to load parking occupancy data at this time. Please try again later.');

            // Initialize chart with default or empty data
            const parkingChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Available', 'Occupied'],
                    datasets: [{
                        label: 'Number of Parking Spots',
                        data: [0, 0],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)', // Available
                            'rgba(255, 99, 132, 0.2)'  // Occupied
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)', // Available
                            'rgba(255, 99, 132, 1)'  // Occupied
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            precision: 0,
                            title: {
                                display: true,
                                text: 'Number of Spots'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Status'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                }
            });

            window.parkingChart = parkingChart;
        });
}