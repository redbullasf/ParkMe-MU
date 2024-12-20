// frontend/js/map.js

// Define map and other variables at the top
let map;
let parkingSpotsMap = new Map();
let selectedParkingId = null;
let selectedSpot = null;
let userMarker = null;
let userLocation = null;
let monitoringInterval = null;

// Define custom icons at the global scope using different Font Awesome icons
const generalIcon = L.divIcon({
    className: 'general-marker',
    html: '<i class="fa fa-car"></i>',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const staffIcon = L.divIcon({
    className: 'staff-marker',
    html: '<i class="fa fa-id-badge"></i>',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const visitorIcon = L.divIcon({
    className: 'visitor-marker',
    html: '<i class="fa fa-user"></i>',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const occupiedIcon = L.divIcon({
    className: 'occupied-marker',
    html: '<i class="fa fa-times-circle"></i>',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const recommendedIcon = L.divIcon({
    className: 'recommended-marker',
    html: '<i class="fa fa-thumbs-up"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
});

// Get references to HTML elements
const recommendedSpotElem = document.getElementById('recommendedSpot');
const confirmBtn = document.getElementById('confirmBtn');
const leaveBtn = document.getElementById('leaveBtn');
const backBtn = document.getElementById('backBtn');

// Add a reference to the arrival time input
let estimatedArrivalTime = null;

// Initialize the map
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
});

function initializeMap() {
    // Set up the map centered at Maynooth
    map = L.map('map').setView([53.385294, -6.601021], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationFound, onLocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
        // Proceed as if the user is not in Maynooth
        showParkingSelectionModal();
    }
}

function onLocationFound(position) {
    userLocation = [position.coords.latitude, position.coords.longitude];

    // Check if the user is in Maynooth (within a certain radius)
    const maynoothCenter = [53.385294, -6.601021];
    const distance = getDistanceFromLatLonInKm(userLocation[0], userLocation[1], maynoothCenter[0], maynoothCenter[1]);

    if (distance <= 5) { // 5 km radius
        // User is in Maynooth
        proceedToApp();
    } else {
        // User is not in Maynooth
        showParkingSelectionModal();
    }
}

function onLocationError(error) {
    console.error('Error getting location:', error);
    // Proceed as if the user is not in Maynooth
    showParkingSelectionModal();
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function proceedToApp() {
    // Proceed to fetch parking spots and show the map
    fetchParkingSpots().then(() => {
        fetchRecommendedSpot();
    });
}

function showParkingSelectionModal() {
    // Fetch parking spots for the user to select
    fetchParkingSpots().then(() => {
        // Populate the modal with parking spots
        populateParkingSelectionModal(Array.from(parkingSpotsMap.values()));
        // Show the modal
        const parkingSelectionModal = new bootstrap.Modal(document.getElementById('parkingSelectionModal'));
        parkingSelectionModal.show();
    });
}

function populateParkingSelectionModal(parkingSpots) {
    const parkingSpotSelect = document.getElementById('parkingSpotSelect');
    parkingSpotSelect.innerHTML = '';
    parkingSpots.forEach(spot => {
        const option = document.createElement('option');
        option.value = spot._id;
        option.textContent = `${spot.name} (${spot.type})`;
        parkingSpotSelect.appendChild(option);
    });

    // Add event listener for when the user changes selection
    parkingSpotSelect.addEventListener('change', onParkingSpotChange);

    // Initialize estimated arrival time picker
    const arrivalTimeInput = document.getElementById('arrivalTime');
    arrivalTimeInput.value = getCurrentTimePlusMinutes(30); // Default to 30 minutes from now

    // Fetch busy level for default selection
    const defaultSpotId = parkingSpotSelect.value;
    const arrivalTime = arrivalTimeInput.value;
    fetchEstimatedBusyLevel(defaultSpotId, arrivalTime);

    // Add event listener for arrival time change
    arrivalTimeInput.addEventListener('change', () => {
        const spotId = parkingSpotSelect.value;
        const arrivalTime = arrivalTimeInput.value;
        fetchEstimatedBusyLevel(spotId, arrivalTime);
    });
}

function onParkingSpotChange(event) {
    const spotId = event.target.value;
    const arrivalTime = document.getElementById('arrivalTime').value;
    fetchEstimatedBusyLevel(spotId, arrivalTime);
}

function fetchEstimatedBusyLevel(spotId, arrivalTime) {
    fetch(`http://localhost:5001/api/parking/${spotId}/busy-level?arrivalTime=${arrivalTime}`)
        .then(response => response.json())
        .then(data => {
            const busyLevelElem = document.getElementById('busyLevel');
            busyLevelElem.textContent = `Estimated Busy Level: ${data.busyLevel}%`;
        })
        .catch(error => {
            console.error('Error fetching busy level:', error);
        });
}

function getCurrentTimePlusMinutes(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutesStr = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutesStr}`; // Format as 'HH:mm'
}

// Event listener for parking selection form submission
document.getElementById('parkingSelectionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const spotId = document.getElementById('parkingSpotSelect').value;
    estimatedArrivalTime = document.getElementById('arrivalTime').value;
    selectedParkingId = spotId;
    selectedSpot = parkingSpotsMap.get(spotId);

    recommendedSpotElem.textContent = selectedSpot.name;

    // Hide the modal
    const parkingSelectionModal = bootstrap.Modal.getInstance(document.getElementById('parkingSelectionModal'));
    parkingSelectionModal.hide();

    // Proceed to app
    highlightRecommendedSpot(selectedSpot);
});

// Fetch parking spots and add markers
function fetchParkingSpots() {
    return fetch('http://localhost:5001/api/parking')
        .then(response => response.json())
        .then(data => {
            data.forEach(spot => {
                let icon;
                if (spot.isAvailable === false) {
                    icon = occupiedIcon;
                } else if (spot.type === 'staff') {
                    icon = staffIcon;
                } else if (spot.type === 'visitor') {
                    icon = visitorIcon;
                } else {
                    icon = generalIcon;
                }

                const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
                    title: spot.name,
                    icon: icon
                }).addTo(map);

                marker.bindPopup(`
                    <div>
                        <strong>${spot.name}</strong><br>
                        ${spot.currentOccupancy}/${spot.capacity} spaces occupied<br>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}" target="_blank">Navigate Here</a><br>
                        <a href="#" class="select-spot-link" data-spot-id="${spot._id}">Select this spot</a>
                    </div>
                `);

                marker.on('popupopen', function () {
                    const popupNode = marker.getPopup().getElement();
                    const selectSpotLink = popupNode.querySelector('.select-spot-link');
                    selectSpotLink.addEventListener('click', function (event) {
                        event.preventDefault();
                        const spotId = event.target.dataset.spotId;
                        selectedParkingId = spotId;
                        selectedSpot = parkingSpotsMap.get(spotId);
                        alert(`You have selected ${selectedSpot.name} as your parking spot.`);
                        recommendedSpotElem.textContent = selectedSpot.name;
                        highlightRecommendedSpot(selectedSpot);
                    });
                });

                // Store the spot data and marker in a Map for easy access
                parkingSpotsMap.set(spot._id, { ...spot, marker });
            });
        })
        .catch(error => {
            console.error('Error fetching parking spots:', error);
        });
}

// Fetch recommended parking spot
function fetchRecommendedSpot() {
    // Always fetch a new recommendation from the backend
    fetch('http://localhost:5001/api/parking/recommendation')
        .then(response => {
            if (!response.ok) {
                throw new Error('No available parking spots.');
            }
            return response.json();
        })
        .then(recommendedSpot => {
            console.log('Recommended parking spot:', recommendedSpot);
            recommendedSpotElem.textContent = recommendedSpot.name;
            selectedParkingId = recommendedSpot._id;
            selectedSpot = parkingSpotsMap.get(selectedParkingId);

            // Highlight the recommended spot on the map
            highlightRecommendedSpot(selectedSpot);
        })
        .catch(error => {
            console.error('Error fetching recommendation:', error);
            recommendedSpotElem.textContent = 'No available parking spots at the moment.';
        });
}

function highlightRecommendedSpot(spot) {
    // Remove existing recommended markers
    removeRecommendedMarkers();

    const recommendedMarker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        icon: recommendedIcon
    }).addTo(map).bindPopup(`
        <strong>Recommended: ${spot.name}</strong><br>
        ${spot.currentOccupancy}/${spot.capacity} spaces occupied<br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}" target="_blank">Navigate Here</a>
    `).openPopup();

    // Store the recommended marker so we can remove it later
    spot.recommendedMarker = recommendedMarker;

    // Optionally, zoom to the recommended spot
    map.setView([spot.coordinates.lat, spot.coordinates.lng], 16);

    // Start monitoring the spot's occupancy
    startMonitoringOccupancy();
}

function removeRecommendedMarkers() {
    // Remove previous recommended markers from the map
    parkingSpotsMap.forEach(spot => {
        if (spot.recommendedMarker) {
            map.removeLayer(spot.recommendedMarker);
            delete spot.recommendedMarker;
        }
    });
}

function startMonitoringOccupancy() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }

    monitoringInterval = setInterval(() => {
        fetch(`http://localhost:5001/api/parking/${selectedParkingId}`)
            .then(response => response.json())
            .then(spot => {
                if (spot.currentOccupancy >= spot.capacity) {
                    // Notify the user
                    alert(`The parking spot ${spot.name} is now full. Recommending a new spot.`);
                    // Stop monitoring
                    clearInterval(monitoringInterval);
                    // Reset selected parking spot
                    selectedParkingId = null;
                    selectedSpot = null;
                    // Fetch a new recommendation
                    fetchRecommendedSpot();
                }
            })
            .catch(error => {
                console.error('Error monitoring occupancy:', error);
            });
    }, 60000); // Check every 60 seconds
}

// Event listener for Confirm Arrival button
confirmBtn.addEventListener('click', () => {
    if (!selectedParkingId) {
        alert('No parking spot selected.');
        return;
    }

    // Send check-in request to backend
    fetch(`http://localhost:5001/api/parking/${selectedParkingId}/checkin`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Check-in successful:', data);
            alert('Check-in successful.');

            // Update the parking spot marker and info
            const spot = parkingSpotsMap.get(selectedParkingId);
            if (spot) {
                spot.currentOccupancy += 1;
                spot.isAvailable = spot.currentOccupancy < spot.capacity;
                updateSpotMarker(spot);
            }

            // Show the leave button
            confirmBtn.classList.add('d-none');
            leaveBtn.classList.remove('d-none');

            // Show feedback modal immediately after check-in
            const questionnaireModal = new bootstrap.Modal(document.getElementById('questionnaireModal'));
            questionnaireModal.show();
        })
        .catch(error => {
            console.error('Error during check-in:', error);
            alert('Failed to check in. Please try again.');
        });
});

// Function to update spot marker
function updateSpotMarker(spot) {
    let icon;
    if (spot.isAvailable === false) {
        icon = occupiedIcon;
    } else if (spot.type === 'staff') {
        icon = staffIcon;
    } else if (spot.type === 'visitor') {
        icon = visitorIcon;
    } else {
        icon = generalIcon;
    }
    spot.marker.setIcon(icon);
    spot.marker.getPopup().setContent(`
        <div>
            <strong>${spot.name}</strong><br>
            ${spot.currentOccupancy}/${spot.capacity} spaces occupied<br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}" target="_blank">Navigate Here</a><br>
            <a href="#" class="select-spot-link" data-spot-id="${spot._id}">Select this spot</a>
        </div>
    `);
}

// Event listener for Simulate Leaving button
leaveBtn.addEventListener('click', () => {
    if (!selectedParkingId) {
        alert('No parking spot selected.');
        return;
    }

    // Send check-out request to backend
    fetch(`http://localhost:5001/api/parking/${selectedParkingId}/checkout`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Check-out successful:', data);
            alert('Check-out successful.');

            // Update the parking spot marker and info
            const spot = parkingSpotsMap.get(selectedParkingId);
            if (spot) {
                spot.currentOccupancy = Math.max(spot.currentOccupancy - 1, 0);
                spot.isAvailable = spot.currentOccupancy < spot.capacity;
                updateSpotMarker(spot);
            }

            // Hide the leave button and show the confirm button
            leaveBtn.classList.add('d-none');
            confirmBtn.classList.remove('d-none');
        })
        .catch(error => {
            console.error('Error during check-out:', error);
            alert('Failed to check out. Please try again.');
        });
});

// Event listener for Feedback form submission
document.getElementById('questionnaireForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const busy = document.querySelector('input[name="busy"]:checked').value;
    const spacesLeft = parseInt(document.getElementById('spacesLeft').value);
    const stayDuration = document.getElementById('stayDuration').value;

    // Send feedback to backend
    fetch(`http://localhost:5001/api/parking/${selectedParkingId}/feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ busy, spacesLeft, stayDuration })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Feedback submitted:', data);
            alert('Thank you for your feedback!');
            // Close the modal
            const questionnaireModal = bootstrap.Modal.getInstance(document.getElementById('questionnaireModal'));
            questionnaireModal.hide();
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        });
});

// Event listener for Back to Home button
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});