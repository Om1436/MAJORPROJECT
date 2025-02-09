
    function initMap() {
        const location = { lat: 18.5204, lng:73.8567  }; // Example: New York
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: location
        });
        new google.maps.Marker({ position: location, map: map });
    }


