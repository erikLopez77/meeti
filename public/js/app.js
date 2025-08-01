import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = 19.0403035;
const lng = -98.1816911;
const map = L.map('mapa').setView([lat, lng], 13);
let markers = new L.FeatureGroup().addTo(map);
let marker;

document.addEventListener('DOMContentLoaded', function () {

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input', buscarDireccion);
});

function buscarDireccion(e) {
    if (e.target.value.length > 8) {
        //si existe un pin anterior limpiarlo
        markers.clearLayers();

        //usar provider
        const geocodeService = L.esri.Geocoding.geocodeService();
        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then((resultado) => {
            geocodeService.reverse().latlng(resultado[0].bounds[0], 15).run(function (error, result) {
                llenarInputs(result);

                //mostrar el mapa
                map.setView(resultado[0].bounds[0], 15);
                //agregar el pin
                marker = new L.marker(resultado[0].bounds[0], {
                    draggable: true,
                    autoPan: true
                })
                    .addTo(map)
                    .bindPopup(resultado[0].label)
                    .openPopup();

                //detectar e
                marker.on('moveend', function (e) {
                    marker = e.target;
                    console.log(marker);
                })

            });


        })
    }
}
