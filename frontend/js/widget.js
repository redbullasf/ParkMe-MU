//frontend/ js/widget.js

document.addEventListener('DOMContentLoaded', () => {
    const busyStatusElem = document.getElementById('busyStatus');
    const occupancyPercentageElem = document.getElementById('occupancyPercentage');
    const parkingStatusWidget = document.getElementById('parkingStatusWidget');

    // Define the parking status data
    // You can edit these values to update the widget
    const parkingStatusData = {
        busyLevel: "Moderately Busy",
        occupancyPercentage: 75
    };

    // Function to update the widget with data
    function updateWidget(data) {
        busyStatusElem.textContent = `Status: ${data.busyLevel}`;
        occupancyPercentageElem.textContent = `Occupancy: ${data.occupancyPercentage}%`;
    }

    // Initialize the widget with current data
    updateWidget(parkingStatusData);

    // If you want to fetch data from an external source (e.g., JSON file or API), you can uncomment and modify the following:

    /*
    // Fetch parking status data from an external JSON file or API
    fetch('path/to/your/data.json')
        .then(response => response.json())
        .then(data => {
            updateWidget(data);
        })
        .catch(error => {
            console.error('Error fetching parking status:', error);
            busyStatusElem.textContent = 'Status: Unavailable';
            occupancyPercentageElem.textContent = 'Occupancy: Unavailable';
        });
    */

    // Add click event listener to scroll to the graph section
    parkingStatusWidget.addEventListener('click', () => {
        const graphSection = document.getElementById('parkingGraph');
        graphSection.scrollIntoView({ behavior: 'smooth' });
    });
});
