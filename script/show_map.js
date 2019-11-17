var x;
var y;

navigator.geolocation.getCurrentPosition(getPosition);

var mymap;

function getPosition(position){
    x=position.coords.latitude
    y=position.coords.longitude
    mymap = L.map('mapid').setView([x, y], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    var url = "http://127.0.0.1:5000/?latitude=" + x + "&longtitude=" + y;
    var response = send_request(url, pasteDataOnMap);
    pasteDataOnMap(response);
}

function move_to_postion(latitude,longtitude){
    x=latitude
    y=longtitude
    mymap.setView([latitude, longtitude], 13);

    var url = "http://127.0.0.1:5000/?latitude=" + latitude + "&longtitude=" + longtitude
    var response = send_request(url, pasteDataOnMap);
}

function pasteDataOnMap(response){
    var weather = response["main"];

    var temperature = weather["temp"];
    var pressure = weather["pressure"];
    var humidity = weather["humidity"];

    var tempFromKelvinsToCelsius = weather["temp"] - 273.15;
    
    L.marker([x, y]).addTo(mymap).bindPopup("Temperature : " + tempFromKelvinsToCelsius + " °C, Pressure : " + pressure + " hPa, Humidity : "+ humidity + " %").openPopup();
}