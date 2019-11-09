/*
    Here only map visualization can be left.
    The other logic and map modification can be moved in requests.js. Make a function which accepts x and y.
    It will be called from fetch_selected_city_coordinates when x and y are obtained.
    It will fetch the weather for the given coordinates and visualize them properly on the map.
    After all done don't forget to delete this comment, as by the clean code convention such comments are just noise.
*/

var x;
var y;
navigator.geolocation.getCurrentPosition(getPosition);

function getPosition(position){
    x=position.coords.latitude
    y=position.coords.longitude
    var mymap = L.map('mapid').setView([x, y], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    L.marker([x, y]).addTo(mymap).bindPopup('You are currently here.').openPopup();


    const request = new Request("https://samples.openweathermap.org/data/2.5/weather?lat=" + x + "&lon=" + y + "&appid=8d50b46972b36311b1bdd74f434be1b0");
    
    const gosho = fetch(request).then(response => {
        if (response.status === 200) {
            console.log(response.json());
            return response.json();
        }
    });
}