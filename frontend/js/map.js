// js/map.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Map page loaded');

    // Retrieve parking spot details from localStorage
    const parkingSpotData = localStorage.getItem('userParkingSpot');
    if (!parkingSpotData) {
        alert('No parking spot data found. Redirecting to home page.');
        window.location.href = 'index.html';
        return;
    }

    const parkingSpot = JSON.parse(parkingSpotData);
    console.log('Parking spot data:', parkingSpot);

    // Initialize the Map
    initializeMap(parkingSpot);
});

let map;
let parkingMarker;

// Initialize Map Function
function initializeMap(parkingSpot) {
    console.log('Initializing map with parking spot:', parkingSpot);

    // Set map view to the parking spot's coordinates
    map = L.map('map').setView([parkingSpot.coordinates.lat, parkingSpot.coordinates.lng], 17);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add Marker for the Parking Spot
    parkingMarker = L.marker([parkingSpot.coordinates.lat, parkingSpot.coordinates.lng], {
        title: parkingSpot.name,
        icon: parkingSpot.busy ? occupiedIcon : availableIcon
    }).addTo(map).bindPopup(`${parkingSpot.name} - ${parkingSpot.busy ? 'Occupied' : 'Available'}`).openPopup();

    // Add a marker for the user's location if available
    if (parkingSpot.userLocation) {
        const userMarker = L.marker([parkingSpot.userLocation.lat, parkingSpot.userLocation.lng], {
            title: 'Your Location',
            icon: userIcon
        }).addTo(map).bindPopup('Your Location').openPopup();
    }
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

const userIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
