// frontend/js/map.js

document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('backBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const recommendedSpotElem = document.getElementById('recommendedSpot');
    const questionnaireModal = $('#questionnaireModal');
    const closeModalSpan = document.querySelector('.close');
    const questionnaireForm = document.getElementById('questionnaireForm');

    // Handle "Back to Home" button click
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    } else {
        console.error('Back button not found');
    }

    // Handle "Confirm Arrival" button click
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!recommendedSpotElem.textContent.trim() || recommendedSpotElem.textContent === 'No available parking spots at the moment.') {
                alert('No recommended parking spot available to confirm.');
                return;
            }
            questionnaireModal.modal('show');
            console.log('Questionnaire modal opened');
        });
    } else {
        console.error('Confirm Arrival button not found');
    }

    // Handle modal close
    if (closeModalSpan) {
        closeModalSpan.addEventListener('click', () => {
            questionnaireModal.modal('hide');
            console.log('Questionnaire modal closed');
        });
    }

    // Handle form submission
    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Questionnaire form submitted');

            const busy = questionnaireForm.busy.value; // 'yes' or 'no'
            // const busyLevel = parseInt(document.getElementById('busyLevel').value, 10); // Uncomment if using busyLevel

            if (!selectedParkingId) {
                alert('No parking spot selected.');
                return;
            }

            // Send feedback to backend
            fetch(`http://localhost:5001/api/parking/${selectedParkingId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ busy })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Feedback response:', data);
                    alert('Thank you for your feedback!');

                    // Optionally, update the parking spot marker on the map
                    if (parkingSpotsMap.has(selectedParkingId)) {
                        const spot = parkingSpotsMap.get(selectedParkingId);
                        spot.isAvailable = (busy === 'no');
                        spot.marker.setIcon(spot.isAvailable ? availableIcon : occupiedIcon);
                        spot.marker.bindPopup(`${spot.name} - ${spot.isAvailable ? 'Available' : 'Occupied'}`);
                    }

                    // Close the modal
                    questionnaireModal.modal('hide');
                })
                .catch(error => {
                    console.error('Error submitting feedback:', error);
                    alert('Failed to submit feedback. Please try again.');
                });
        });
    }

    // Initialize the map
    initializeMap();
});

// Global variables for map and parking spots
let map;
let parkingSpotsMap = new Map(); // key: parkingSpot._id, value: parkingSpot object
let recommendedMarker = null;
let selectedParkingId = null;

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

const recommendedIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Initialize the map
function initializeMap() {
    console.log('Initializing map');
    map = L.map('map').setView([53.3811, -6.5918], 15); // Centered on Maynooth University

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fetch Parking Spots from Backend
    fetch('http://localhost:5001/api/parking')
        .then(response => response.json())
        .then(data => {
            console.log('Parking spots fetched:', data);
            data.forEach(spot => {
                const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
                    title: spot.name,
                    icon: spot.isAvailable ? availableIcon : occupiedIcon
                }).addTo(map).bindPopup(`${spot.name} - ${spot.isAvailable ? 'Available' : 'Occupied'}`);

                // Store in the map
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
            const recommendedSpotElem = document.getElementById('recommendedSpot');
            recommendedSpotElem.textContent = recommendedSpot.name;
            selectedParkingId = recommendedSpot._id;

            // Highlight the recommended spot on the map
            recommendedMarker = L.marker([recommendedSpot.coordinates.lat, recommendedSpot.coordinates.lng], {
                icon: recommendedIcon
            }).addTo(map).bindPopup(`<b>Recommended: ${recommendedSpot.name}</b>`).openPopup();
        })
        .catch(error => {
            console.error('Error fetching recommendation:', error);
            const recommendedSpotElem = document.getElementById('recommendedSpot');
            recommendedSpotElem.textContent = 'No available parking spots at the moment.';
        });
}