mapboxgl.accessToken = 'pk.eyJ1IjoicHJhc2g2ODYiLCJhIjoiY20xM2xndWFkMWM4NTJvcjNjOXgxZjBqeSJ9.w5P_Or_-mE11p5wGpH5pww';

if (typeof sampleCoordinates !== 'undefined' && Array.isArray(sampleCoordinates) && sampleCoordinates.length === 2) {
    console.log("Coordinates:", sampleCoordinates);

    // Initialize the map
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: sampleCoordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    // Create a popup
    const popup = new mapboxgl.Popup({ offset: 25 })
        .setText('This is the location!'); // Popup text

    // Add a marker at the specified coordinates
    const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(sampleCoordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25}).setHTML(
                `<p>Exact Location will be provided after booking</p>`
            )
        ) // Set the popup on the marker
        .addTo(map);

} else {
    console.error("Invalid or missing coordinates.");
}
