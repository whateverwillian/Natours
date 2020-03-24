export const displayMap = (locations => {

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2hhdGV2ZXJ3aWxsaWFuIiwiYSI6ImNrODBuZG52cjBoYmozZHBhd2c3bzBsancifQ.9ckEG12ugJi0zzcoCZAMlA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/whateverwillian/ck80ng43m2hso1ioatryu5kr3',
        scrollZoom: false
        // center: [-118.113491,34.111745],
        // zoom: 7
    });

    const bounds = new mapboxgl.LngLatBounds()

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div')
        el.className = 'marker'

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map)

        // Add Popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>${loc.day}. ${loc.description}</p>`)
            .addTo(map)

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates)
    })

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    })
})
