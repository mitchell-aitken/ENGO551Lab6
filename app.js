// initialize the map on 'mapid' with a set view
var map = L.map('mapid').setView([51.0447, -114.0719], 13);

// add a dark theme tile layer from CARTO
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO'
}).addTo(map);

// variables for the drawn polyline and the simplified version
var drawnPolyline = null;
var simplifiedLayer = null;

// when the map is clicked
map.on('click', function(e) {
    if (!drawnPolyline) {
        drawnPolyline = L.polyline([e.latlng], {color: 'red'}).addTo(map);
    } else {
        drawnPolyline.addLatLng(e.latlng);
    }
});

// Update tolerance value display
document.getElementById('tolerance').addEventListener('input', function() {
    document.getElementById('toleranceValue').textContent = this.value;
});

// when the simplify button is clicked
document.getElementById('simplify').addEventListener('click', function() {
    if (drawnPolyline) {
        var tolerance = parseFloat(document.getElementById('tolerance').value);
        var simplified = turf.simplify(drawnPolyline.toGeoJSON(), {tolerance: tolerance, highQuality: true, mutate: true});
        // https://www.npmjs.com/package/@turf/simplify
        if (simplifiedLayer) {
            map.removeLayer(simplifiedLayer);
        }
        simplifiedLayer = L.geoJSON(simplified, {
            style: function () {
                return {color: 'blue'};
            }
        }).addTo(map);
        map.removeLayer(drawnPolyline);
        drawnPolyline = null;
    }
});

// when the reset button is clicked
document.getElementById('reset').addEventListener('click', function() {
    if (drawnPolyline) {
        map.removeLayer(drawnPolyline);
        drawnPolyline = null;
    }
    if (simplifiedLayer) {
        map.removeLayer(simplifiedLayer);
        simplifiedLayer = null;
    }
});
