// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Initialize Chart
    initializeParkingChart();

    // Initialize Map
    initializeMap();

    // Check-In Button Event
    const checkInBtn = document.getElementById('checkInBtn');
    if (checkInBtn) {
        checkInBtn.addEventListener('click', handleCheckIn);
        console.log('Check-In button listener attached');
    } else {
        console.error('Check-In button not found');
    }

    // Check-Out Button Event
    const checkOutBtn = document.getElementById('checkOutBtn');
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', handleCheckOut);
        console.log('Check-Out button listener attached');
    } else {
        console.error('Check-Out button not found');
    }

    // Arrival Form Submission
    const arrivalForm = document.getElementById('arrivalForm');
    if (arrivalForm) {
        arrivalForm.addEventListener('submit', submitArrivalForm);
        console.log('Arrival form listener attached');
    } else {
        console.error('Arrival form not found');
    }

    // Confirm Check-Out Button
    const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');
    if (confirmCheckoutBtn) {
        confirmCheckoutBtn.addEventListener('click', performCheckOut);
        console.log('Confirm Check-Out button listener attached');
    } else {
        console.error('Confirm Check-Out button not found');
    }
});

let map;
let userMarker;
let recommendedMarker;
let parkingSpots = [];
let selectedParkingId = null;

// Initialize Parking Chart
function initializeParkingChart() {
    console.log('Initializing parking chart');
    const ctx = document.getElementById('parkingChart').getContext('2d');

    fetch('http://localhost:5001/api/parking/occupancy') // Ensure this endpoint exists
        .then(response => response.json())
        .then(data => {
            console.log('Occupancy data fetched:', data);
            const labels = generateHourLabels(6, 18);
            const occupancyData = data; // Assuming data is an array from 6 AM to 6 PM

            const parkingChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Average Parking Occupancy (%)',
                        data: occupancyData,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1
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
                                text: 'Hours'
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
            // Initialize chart with default or empty data
            const parkingChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: generateHourLabels(6, 18),
                    datasets: [{
                        label: 'Average Parking Occupancy (%)',
                        data: [],
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1
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
                                text: 'Hours'
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

// Generate Hour Labels from startHour to endHour
function generateHourLabels(startHour, endHour) {
    const labels = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        labels.push(`${displayHour} ${period}`);
    }
    return labels;
}

// Initialize Map
function initializeMap() {
    console.log('Initializing map');
    map = L.map('map').setView([53.3811, -6.5918], 15); // Centered on Maynooth University

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fetch Parking Spots from Backend
    fetch('http://localhost:5001/api/parking')
        .then(response => {
            console.log('Fetching parking spots');
            return response.json();
        })
        .then(data => {
            console.log('Parking spots fetched:', data);
            parkingSpots = data;
            parkingSpots.forEach(spot => {
                const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
                    title: spot.name,
                    icon: spot.isAvailable ? availableIcon : occupiedIcon
                }).addTo(map).bindPopup(`${spot.name} - ${spot.isAvailable ? 'Available' : 'Occupied'}`);
                spot.marker = marker; // Associate marker with parking spot
            });
        })
        .catch(error => console.error('Error fetching parking spots:', error));

    // Periodically Update Parking Data
    setInterval(fetchAndUpdateParkingData, 60000); // Every 60 seconds
}

// Define Custom Icons
const availableIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const occupiedIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Handle Check-In
function handleCheckIn() {
    console.log('Check-In button clicked');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log('Geolocation success:', position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Display User Location on Map
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            userMarker = L.marker([lat, lng]).addTo(map).bindPopup('Your Location').openPopup();

            // Suggest Nearest Available Parking
            suggestParking(lat, lng);
        }, error => {
            console.error('Geolocation error:', error);
            alert('Error obtaining location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Suggest Parking Function
function suggestParking(userLat, userLng) {
    console.log('Suggesting nearest parking spot');
    let nearestSpot = null;
    let minDistance = Infinity;

    parkingSpots.forEach(spot => {
        if (spot.isAvailable) {
            const distance = getDistanceFromLatLonInKm(userLat, userLng, spot.coordinates.lat, spot.coordinates.lng);
            console.log(`Distance to ${spot.name}: ${distance} km`);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSpot = spot;
            }
        }
    });

    if (nearestSpot) {
        console.log('Nearest available parking spot:', nearestSpot);
        // Highlight the recommended parking spot
        if (recommendedMarker) {
            map.removeLayer(recommendedMarker);
        }
        recommendedMarker = L.marker([nearestSpot.coordinates.lat, nearestSpot.coordinates.lng], {
            title: 'Recommended Parking',
            icon: L.icon({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            })
        }).addTo(map).bindPopup(`Recommended: ${nearestSpot.name}`).openPopup();

        selectedParkingId = nearestSpot._id;

        // Open Arrival Questions Modal
        $('#arrivalModal').modal('show');
        console.log('Arrival modal opened');
    } else {
        alert('No available parking spots nearby.');
    }
}

// Calculate Distance Between Two Coordinates (Haversine Formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

// Submit Arrival Form
function submitArrivalForm(event) {
    event.preventDefault();
    console.log('Arrival form submitted');
    const isBusy = document.querySelector('input[name="busy"]:checked').value === 'yes';
    const busyLevel = parseInt(document.getElementById('busyLevel').value, 10);

    // User ID could be obtained from authentication in a real app
    const userId = 'user123'; // Placeholder

    if (!selectedParkingId) {
        alert('No parking spot selected.');
        return;
    }

    console.log(`Submitting check-in for userId: ${userId}, parkingId: ${selectedParkingId}`);

    // Send Check-In Request to Backend
    fetch('http://localhost:5001/api/parking/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, parkingId: selectedParkingId, isBusy, busyLevel })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Check-In response:', data);
            if (data.message === 'Check-in successful') {
                alert('Check-in successful! Redirecting to your parking map.');

                // Store parking spot details in localStorage
                const parkingSpot = {
                    id: data.parkingSpot._id,
                    name: data.parkingSpot.name,
                    coordinates: data.parkingSpot.coordinates,
                    busy: data.parkingSpot.busy,
                    busyLevel: data.parkingSpot.busyLevel
                };
                localStorage.setItem('userParkingSpot', JSON.stringify(parkingSpot));

                // Redirect to map.html
                window.location.href = 'map.html';
            } else {
                alert('Check-in failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during check-in:', error);
            alert('An error occurred during check-in. Please try again.');
        });
}

// Handle Check-Out Button
function handleCheckOut() {
    console.log('Check-Out button clicked');
    // Show Check-Out Confirmation Modal
    $('#checkoutModal').modal('show');
    console.log('Check-Out confirmation modal opened');
}

// Perform Check-Out
function performCheckOut() {
    console.log('Performing check-out');
    // Close the confirmation modal
    $('#checkoutModal').modal('hide');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log('Geolocation success for check-out:', position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Find the parking spot where currentUser is 'user123'
            const userParkingSpot = parkingSpots.find(spot => spot.currentUser === 'user123');

            if (userParkingSpot) {
                const userId = 'user123'; // Placeholder

                console.log(`Submitting check-out for userId: ${userId}, parkingId: ${userParkingSpot._id}`);

                // Send Check-Out Request to Backend
                fetch('http://localhost:5001/api/parking/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, parkingId: userParkingSpot._id })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Check-Out response:', data);
                        if (data.message === 'Check-out successful') {
                            alert('Check-out successful!');
                            // Update Parking Spot Marker
                            updateParkingSpot(data.parkingSpot);
                            // Remove User Marker from Map
                            if (userMarker) {
                                map.removeLayer(userMarker);
                                userMarker = null;
                            }
                            // Remove Recommended Marker
                            if (recommendedMarker) {
                                map.removeLayer(recommendedMarker);
                                recommendedMarker = null;
                            }

                            // Remove parking spot from localStorage
                            localStorage.removeItem('userParkingSpot');

                            // Enable Check-In Button
                            const checkInBtn = document.getElementById('checkInBtn');
                            if (checkInBtn) {
                                checkInBtn.disabled = false;
                            }
                        } else {
                            alert('Check-out failed: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error during check-out:', error);
                        alert('An error occurred during check-out. Please try again.');
                    });
            } else {
                alert('No active parking session found.');
            }
        }, error => {
            console.error('Geolocation error for check-out:', error);
            alert('Error obtaining location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Update Parking Spot in Frontend
function updateParkingSpot(updatedSpot) {
    console.log('Updating parking spot:', updatedSpot);
    // Find the parking spot in the frontend array
    const spotIndex = parkingSpots.findIndex(spot => spot._id === updatedSpot._id);
    if (spotIndex !== -1) {
        parkingSpots[spotIndex] = updatedSpot;

        // Update the marker icon
        parkingSpots[spotIndex].marker.setIcon(updatedSpot.isAvailable ? availableIcon : occupiedIcon);
        console.log('Marker icon updated');

        // Update the popup content
        parkingSpots[spotIndex].marker.bindPopup(`${updatedSpot.name} - ${updatedSpot.isAvailable ? 'Available' : 'Occupied'}`);
        console.log('Popup content updated');

        // If the spot is now occupied, remove the recommended marker
        if (!updatedSpot.isAvailable && recommendedMarker) {
            map.removeLayer(recommendedMarker);
            recommendedMarker = null;
            console.log('Recommended marker removed');
        }
    }
}

// Fetch and Update Parking Data Periodically
function fetchAndUpdateParkingData() {
    console.log('Fetching and updating parking data');
    fetch('http://localhost:5001/api/parking/status')
        .then(response => {
            console.log('Fetching parking status');
            return response.json();
        })
        .then(data => {
            console.log('Parking status fetched:', data);
            data.forEach(updatedSpot => {
                updateParkingSpot(updatedSpot);
            });
        })
        .catch(error => console.error('Error fetching parking status:', error));
}
// After obtaining userMarker's coordinates
const userCoordinates = userMarker.getLatLng();
const parkingSpot = {
    id: data.parkingSpot._id,
    name: data.parkingSpot.name,
    coordinates: data.parkingSpot.coordinates,
    busy: data.parkingSpot.busy,
    busyLevel: data.parkingSpot.busyLevel,
    userLocation: {
        lat: userCoordinates.lat,
        lng: userCoordinates.lng
    }
};
localStorage.setItem('userParkingSpot', JSON.stringify(parkingSpot));
