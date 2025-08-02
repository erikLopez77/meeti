import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = 19.0403035;
const lng = -98.1816911;
const map = L.map('mapa').setView([lat, lng], 13);// se crea mapa en div "mapa"
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
        if (marker) {
            map.removeLayer(marker);
        }
        console.log(L.esri, "+"); // debería mostrar un objeto con métodos
        console.log(L.esri.Geocoding, "++"); // debería mostrar otro objeto con más funciones


        // instancia de geocodificación inversa de Esri
        const geocodeService = L.esri.Geocoding.geocodeService();
        console.log(geocodeService, " +++")
        //instancia para geocodificacion directa (address->coord)
        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then((resultado) => {
            geocodeService.reverse().latlng(resultado[0].bounds[0], 15).run(function (error, result) {
                console.log(L.esri); // debería mostrar un objeto con métodos
                console.log(L.esri.Geocoding); // debería mostrar otro objeto con más funciones

                //mostrar el mapa en la direccion encontrada
                map.setView(resultado[0].bounds[0], 15);
                //agregar el pin en la ubicacion
                marker = new L.marker(resultado[0].bounds[0], {
                    draggable: true,
                    autoPan: true
                })
                    .addTo(map)
                    .bindPopup(resultado[0].label)//contenido de popup es la direccion
                    .openPopup();//se abre el popup

                //detectar si se mueve el marcador
                marker.on('moveend', function (e) {
                    marker = e.target;
                    const position = marker.getLatLng();
                    map.panTo(new L.LatLng(position.lat, position.lng));

                    //reverse geocoding cuando el usuario reubica el pin
                    geocodeService.reverse().latlng(position, 15).run(function (error, result) {
                        console.log(result, "res");
                        //asigna los valores del popup
                        //marker.bindPopup(result.address.LongLabel);
                    })
                })

            });
        })
    }
}
