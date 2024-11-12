// frontend/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const occupancyForm = document.getElementById('occupancyForm');
    const parkingSpotSelect = document.getElementById('parkingSpot');

    // Fetch parking spots to populate the select dropdown
    fetch('http://localhost:5001/api/parking')
        .then(response => response.json())
        .then(data => {
            data.forEach(spot => {
                const option = document.createElement('option');
                option.value = spot._id;
                option.textContent = spot.name;
                parkingSpotSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching parking spots:', error);
        });

    // Handle form submission
    occupancyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const parkingSpotId = parkingSpotSelect.value;
        const hour = parseInt(document.getElementById('hour').value, 10);
        const occupiedSpaces = parseInt(document.getElementById('occupiedSpaces').value, 10);

        // Send data to backend
        fetch(`http://localhost:5001/api/occupancy/${parkingSpotId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hour, occupiedSpaces })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Occupancy data updated:', data);
                alert('Occupancy data submitted successfully.');
            })
            .catch(error => {
                console.error('Error submitting occupancy data:', error);
                alert('Failed to submit occupancy data. Please try again.');
            });
    });
});