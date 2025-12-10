mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // Create a default Marker and add it to the map.
    console.log(ListingDetails.geometry.coordinates);
    // const coordinate=<%-JSON.stringify(ListingDetails.geometry.coordinates)%>;
    const marker1 = new mapboxgl.Marker()
        .setLngLat(coordinate) // set this as listing.geometry.coordinates
        .addTo(map);