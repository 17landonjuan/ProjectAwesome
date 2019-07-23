var arrayOfTrackingPoints = [];
var distance;
var map;
var highwayMPG;
var year;
var make;

function initMap() {
    // //var directionsService = new google.maps.DirectionsService;
    // var directionsDisplay = new google.maps.DirectionsRenderer;
    // map = new google.maps.Map(document.getElementById('map'), {
    //     zoom: 4,
    //     center: {
    //         lat: 39,
    //         lng: -94.5786
    //     }
    // });
    // directionsDisplay.setMap(map);

    var getMakes = function () {
        console.log("text");
        $("#make").slice(1).empty();
        year = $("#year").val();
        $.ajax({
            type: "GET",
            url: "https://fueleconomy.gov/ws/rest/vehicle/menu/make?year=" + year,
            dataType: "xml",
        }).then(function (response) {
            var jsonResponse = xmlToJson(response).menuItems.menuItem;
            jsonResponse.forEach(function myFunction(item, index) {
                var option = $("<option>").addClass("makeOption").text(item.text["#text"]);
                $("#make").append(option);
            })
        })
    };

    var getModels = function () {
        $("#model").slice(1).empty();


        make = $("#make").val();
        $.ajax({
            type: "GET",
            url: "https://fueleconomy.gov/ws/rest/vehicle/menu/model?year=" + year + "&make=" +
                make,
            dataType: "xml",
        }).then(function (response) {
            var jsonResponse = xmlToJson(response).menuItems.menuItem;
            jsonResponse.forEach(function myFunction(item, index) {
                var option = $("<option>").addClass("modelOption").text(item.text["#text"]);
                $("#model").append(option);
            })
        })
    };


    var getOptions = function () {
        console.log("test");
        $("#option").slice(1).empty();
        model = $("#model").val();
        $.ajax({
            type: "GET",
            url: "https://fueleconomy.gov/ws/rest/vehicle/menu/options?year=" + year + "&make=" +
                make + "&model=" + model,
            dataType: "xml",
        }).then(function (response) {
            var jsonResponse = xmlToJson(response).menuItems.menuItem;
            if (!Array.isArray(jsonResponse)) {
                var option = $("<option>");
                var tdOption = option.text(jsonResponse.text["#text"]);
                var teOption = tdOption.attr("data-id", jsonResponse.value["#text"])
                $("#option").append(teOption);
            } else {
                jsonResponse.forEach(function myFunction(item, index) {
                    var option = $("<option>");
                    var tdOption = option.text(item.text["#text"]);
                    var teOption = tdOption.attr("data-id", item.value["#text"])
                    $("#option").append(teOption);
                })
            }

        })
    };

    document.getElementById('year').addEventListener('change', getMakes);
    document.getElementById('make').addEventListener('change', getModels);
    document.getElementById('model').addEventListener('change', getOptions);


    $("#submit").on("click", function myfunction() {
        event.preventDefault();
        // console.log(document.getElementById('start').value);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    })

    // calculateAndDisplayRoute(directionsService, directionsDisplay)

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
            origin: $("#start").val(),
            destination: $("#end").val(),
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                distance = response.routes[0].legs[0].distance.value;
                convertedDistance = Math.floor(distance * 0.00062137);
                $("#totalMeters").text("Total Distance: " + convertedDistance + " miles");
                // for (var i = 0; i < response.routes[0].overview_path.length; ++i) {
                //     arrayOfTrackingPoints.push(new google.maps.LatLng(response.routes[0]
                //         .overview_path[
                //             i]
                //         .lat(),
                //         response.routes[0].overview_path[i].lng()));

                //     // arrayOfTrackingPoints.push(
                //     //     JSON.stringify(response.routes[0].overview_path[i].lat()),
                //     //     JSON.stringify(response.routes[0].overview_path[i].lng()))
                // }
            } else {
                window.alert('Directions request failed due to ' + status);
            }
            fuelCalc(distance)
        });
    }

    function fuelCalc(distance) {
        var gasCost = 2.5;
        getMPG();
    }

}

initMap();