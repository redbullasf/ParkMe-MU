// frontend/js/map.js

// Define map and other variables at the top
let map;
let parkingSpotsMap = new Map();
let selectedParkingId = null;
let selectedSpot = null;
let userMarker = null;

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

// Initialize the map
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
});

function initializeMap() {
    // Set up the map centered at a default location
    map = L.map('map').setView([53.385294, -6.601021], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fetch parking spots from backend
    fetch('http://localhost:5001/api/parking')
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

                marker.on('popupopen', function() {
                    const popupNode = marker.getPopup().getElement();
                    const selectSpotLink = popupNode.querySelector('.select-spot-link');
                    selectSpotLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        const spotId = event.target.dataset.spotId;
                        selectedParkingId = spotId;
                        selectedSpot = parkingSpotsMap.get(spotId);
                        alert(`You have selected ${selectedSpot.name} as your parking spot.`);
                        // Update the UI accordingly
                        recommendedSpotElem.textContent = selectedSpot.name;
                    });
                });

                // Store the spot data and marker in a Map for easy access
                parkingSpotsMap.set(spot._id, { ...spot, marker });
            });
        })
        .catch(error => {
            console.error('Error fetching parking spots:', error);
        });

    // Fetch recommended parking spot
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

            // Highlight the recommended spot on the map
            const recommendedMarker = L.marker([recommendedSpot.coordinates.lat, recommendedSpot.coordinates.lng], {
                icon: recommendedIcon
            }).addTo(map).bindPopup(`
                <strong>Recommended: ${recommendedSpot.name}</strong><br>
                ${recommendedSpot.currentOccupancy}/${recommendedSpot.capacity} spaces occupied<br>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${recommendedSpot.coordinates.lat},${recommendedSpot.coordinates.lng}" target="_blank">Navigate Here</a>
            `).openPopup();

            // Optionally, zoom to the recommended spot
            map.setView([recommendedSpot.coordinates.lat, recommendedSpot.coordinates.lng], 16);
        })
        .catch(error => {
            console.error('Error fetching recommendation:', error);
            recommendedSpotElem.textContent = 'No available parking spots at the moment.';
        });
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
document.getElementById('questionnaireForm').addEventListener('submit', function(event) {
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