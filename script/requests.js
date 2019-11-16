var locations_api_url = "https://api.teleport.org/api/"
var country_ids = {}
var admin_division_ids = {}
var city_ids = {}

main()

function main() {
    fetch_countries()

    countries_drop_down = document.getElementById('countries');
    countries_drop_down.addEventListener('change', function() {
        $("#admin_divisions").empty()
        $("#cities").empty()
        var selected_country = this.value
        fetch_admin_divisions(selected_country)
    })

    admin_divisions_drop_down = document.getElementById('admin_divisions');
    admin_divisions_drop_down.addEventListener('change', function() {
        $("#cities").empty()
        var selected_admin_division = this.value
        fetch_cities(selected_admin_division)
    })
}

function fetch_countries() {
    var url = locations_api_url + "countries/"

    send_request(url, function(json_result) {
        var json_links = json_result["_links"]
        var json_countries = json_links["country:items"]

        var countries = json_countries.map(function(json_element) {
            find_entity_id(json_element, "iso_alpha2", "country")
            return json_element.name
        })

        fill_drop_down_list_with_entities(countries, "countries")
    })
}

function fetch_admin_divisions(selected_country) {
    var selected_country_id = country_ids[selected_country]
    var url = locations_api_url + "countries/" + selected_country_id + "/admin1_divisions/"

    send_request(url, function(json_result) {
        var json_links = json_result["_links"]
        var json_admin_divisions = json_links["a1:items"]

        var admin_divisions = json_admin_divisions.map(function(json_element) {
            find_entity_id(json_element, "geonames", "admin_division")
            return json_element.name
        })

        fill_drop_down_list_with_entities(admin_divisions, "admin_divisions")
    })
}

function fetch_cities(selected_admin_division) {
    var countries_drop_down = document.getElementById("countries")
    var selected_country = countries_drop_down.options[countries_drop_down.selectedIndex].text
    var selected_country_id = country_ids[selected_country]
    var selected_admin_division_id = admin_division_ids[selected_admin_division]
    var url = locations_api_url + "countries/" + selected_country_id + "/admin1_divisions/" + selected_admin_division_id + "/cities/"

    send_request(url, function(json_result) {
        var json_links = json_result["_links"]
        var json_cities = json_links["city:items"]

        var cities = json_cities.map(function(json_element) {
            find_entity_id(json_element, "geonameid", "city")
            return json_element.name
        })

        fill_drop_down_list_with_entities(cities, "cities")
    })
}

function send_request(url, callback_on_success) {
    var that = this
    var json_result = {}
    const request = new Request(url)
    fetch(request).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
                callback_on_success(data)
            })
        }
    })
    return json_result
}

// finds the ID of a country, admin_division or city from the href in the returned json element
function find_entity_id(json_element, entity_keyword, entity_type) {
    var entity_name = json_element.name
    var entity_href = json_element.href
    var entity_id_begin_index = entity_href.search(entity_keyword)
    var entity_id = entity_href.slice(entity_id_begin_index, -1)

    set_entity_id(entity_name, entity_id, entity_type)
}

function set_entity_id(entity_name, entity_id, entity_type) {
    if (entity_type == "country") {
        country_ids[entity_name] = entity_id
    } else if (entity_type == "admin_division") {
        admin_division_ids[entity_name] = entity_id
    } else if (entity_type == "city") {
        city_ids[entity_name] = entity_id
    }
}

function fill_drop_down_list_with_entities(entities, drop_down_id) {
    var sorted_entities = entities.sort()
    for (entity of sorted_entities) {
        var drop_down = document.getElementById(drop_down_id)
        var option = document.createElement("option")
        option.text = entity
        drop_down.add(option)
    }
}

function get_weather_for_selected_city() {
    var cities_drop_down = document.getElementById("cities")
    var selected_city_option = cities_drop_down.options[cities_drop_down.selectedIndex]

    if(selected_city_option === undefined) {
        alert("Please select a city!")
        return
    }

    var selected_city = selected_city_option.text
    var selected_city_id = city_ids[selected_city]
    fetch_selected_city_coordinates(selected_city, selected_city_id)
}

function fetch_selected_city_coordinates(selected_city, selected_city_id) {
    var url = locations_api_url + "cities/" + selected_city_id

    send_request(url, function(json_result) {
        var city_location_json = json_result.location.latlon
        var city_latitude = city_location_json.latitude
        var city_longitude = city_location_json.longitude
        console.log(city_latitude)
        console.log(city_longitude)
        move_to_postion(city_latitude,city_longitude);
        // Now use these coordinates to fetch weather forecast for the city and display it on the map!
    })
}