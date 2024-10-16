const ctx = document.getElementById('parkingChart').getContext('2d');
const parkingChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Average Parking Occupancy (%)',
            data: [90, 85, 80, 75, 40, 20, 10],
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            fill: true,
        }]
    },
    options: {
        scales: {
            yAxes: [{ ticks: { beginAtZero: true, max: 100 } }]
        }
    }
});
document.getElementById('checkInBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(checkInSuccess, checkInError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function checkInSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    // Proceed with showing the map and additional features
    displayMap(lat, lng);
    askArrivalQuestions();
}

function checkInError(error) {
    alert('Error obtaining location: ' + error.message);
}
function displayMap(lat, lng) {
    const map = L.map('map').setView([lat, lng], 15);

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Mark user's location
    L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();

    // Mark parking areas
    const parkingAreas = [
        { name: 'Main Parking', coords: [53.3811, -6.5918] },
        { name: 'East Parking', coords: [53.3775, -6.5930] },
        // ... add more parking areas ...
    ];

    parkingAreas.forEach(area => {
        L.marker(area.coords).addTo(map).bindPopup(area.name);
    });

    // Suggest parking
    suggestParking(lat, lng, parkingAreas);
}

function suggestParking(userLat, userLng, parkingAreas) {
    // Implement logic to suggest the best parking area
    // For example, the closest one with available spots
}
function askArrivalQuestions() {
    $('#arrivalModal').modal('show');
}

document.getElementById('arrivalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const isBusy = document.querySelector('input[name="busy"]:checked').value;
    const busyLevel = document.getElementById('busyLevel').value;
    // Send data to backend or store it
    $('#arrivalModal').modal('hide');
});
document.getElementById('checkOutBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(checkOutSuccess, checkOutError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function checkOutSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    // Update parking availability
    markSpotAvailable(lat, lng);
    alert('Thank you for checking out.');
}

function checkOutError(error) {
    alert('Error obtaining location: ' + error.message);
}

function markSpotAvailable(lat, lng) {
    // Send data to the backend to mark the spot as available
}
