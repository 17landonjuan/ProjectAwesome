var totalGas;
var distance;
var duration;
var map;
var highwayMPG;
var year;
var make;
var convertedDistance;
var totalNumOnTrip = 1;
var hours;
var minutes;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {
            lat: 39,
            lng: -94.5786
        }
    });
    directionsDisplay.setMap(map);

    $("#submit").on("click", function myfunction() {
        event.preventDefault();
        $("#results").empty();
        $("#autocompleteEnd").attr("style", "");
        $("#autocompleteStart").attr("style", "");
        // console.log(document.getElementById('start').value);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    })

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
            origin: $("#autocompleteStart").val(),
            destination: $("#autocompleteEnd").val(),
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                distance = response.routes[0].legs[0].distance.value;
                duration = response.routes[0].legs[0].duration.value;
                console.log(duration);
            } else {
                $("#autocompleteEnd").val('').css("background-color", "rgba(228, 255, 0, 0.34)");
                $("#autocompleteStart").val('').css("background-color", "rgba(228, 255, 0, 0.34)");

                function moveback() {
                    $('html, body').animate({
                        scrollTop: $("#section2").offset().top
                    }, 500)
                };
                moveback();

                $("#results").empty();
                console.log("Failure");
                // window.alert('Directions request failed due to ' + status);
            }

            function fuelCalc() {
                function getMPG() {

                    var carID = $("#option option:selected").attr("data-id");

                    $.ajax({
                        type: "GET",
                        url: "https://www.fueleconomy.gov/ws/rest/vehicle/" + carID,
                        dataType: "xml",

                    }).then(function (response) {
                        // carID = xmlToJson(response).menuItems.menuItem[0].value["#text"]
                        highwayMPG = xmlToJson(response).vehicle.highway08["#text"];
                        console.log(highwayMPG)
                        $.ajax({
                            type: "GET",
                            url: "http://api.eia.gov/series/?api_key=4e2512a68239a8a4d7fcccd3cea3b0c1&series_id=TOTAL.RUUCUUS.M",
                        }).then(function (response) {
                            // Storing an array of results in the results variable
                            var tripToggle = $('#tripToggle').prop('checked');

                            var results = response.series;

                            // Creating variable to drill down to monthly average price of unleaded gas
                            var avgPriceUnlRegGas = results[0].data[0][1];

                            console.log(avgPriceUnlRegGas);

                            // Variable to create paragraph with gas price info
                            var p1 = $("<p>").text("National Monthly Average Price of Unleaded Gas: $" + avgPriceUnlRegGas);

                            // Appending gas price info paragraph to gas-price div
                            $('.gas-price').append(p1);

                            // Function to calculate total price of gas for trip and divide by user input number of people on tirp
                            var tripCostDividedByFriends = function () {

                                totalNumOnTrip = $("#frnds").val().trim();



                                // Conversion from meters to miles
                                var milesOverMeters = 1 / 1609.34;

                                // Total Trip Distance in Miles

                                var totalTripDistanceMi = Math.round((distance * milesOverMeters) * 100) / 100;

                                // Total gallons of gas used on the trip
                                var totalGasUsed = Math.round((totalTripDistanceMi / highwayMPG) * 100) / 100;

                                // Total cost of gas
                                var totalGasCost = Math.round((totalGasUsed * avgPriceUnlRegGas) * 100) / 100;

                                // Total cost of gas per friend
                                var costOfGasPerFriend = Math.round((totalGasCost / totalNumOnTrip) * 100) / 100;



                                if (tripToggle === true) {
                                    totalTripDistanceMi = totalTripDistanceMi * 2;
                                    totalGasUsed = totalGasUsed * 2;
                                    totalGasCost = totalGasCost * 2;
                                    costOfGasPerFriend = costOfGasPerFriend * 2;
                                    duration = duration * 2;
                                }

                                function hhmmss(secs) {
                                    minutes = Math.floor(secs / 60);
                                    hours = Math.floor(minutes / 60);
                                    minutes = minutes % 60;
                                }

                                hhmmss(duration);

                                var tr1 = $("<tr>");
                                var tr2 = $("<tr>");
                                var tr3 = $("<tr>");
                                var tr4 = $("<tr>");
                                var tr5 = $("<tr>");

                                var p2 = $("<td>").text("Total Distance:");
                                var p3 = $("<td>").text("Total Gas Used:");
                                var p4 = $("<td>").text("Total Cost of Gas:");
                                var p5 = $("<td>").text("Cost of Gas per Person:");
                                var p6 = $("<td>").text("Total Driving Time:");

                                var td1 = $("<td>").text(totalTripDistanceMi + " mi").addClass("resultsBlue");
                                var td2 = $("<td>").text(totalGasUsed + " gallons").addClass("resultsBlue");
                                var td3 = $("<td>").text("$" + totalGasCost.toFixed(2)).addClass("resultsPink");
                                var td4 = $("<td>").text("$" + costOfGasPerFriend.toFixed(2)).addClass("resultsPink");
                                var td5 = $("<td>").text(hours + " h " + minutes + " min").addClass("resultsBlue");

                                tr1.append(p2).append(td1);
                                tr2.append(p3).append(td2);
                                tr3.append(p4).append(td3);
                                tr4.append(p5).append(td4);
                                tr5.append(p6).append(td5);


                                $('#results').append(tr1).append(tr2).append(tr3).append(tr4).append(tr5);


                            };
                            tripCostDividedByFriends();
                        })
                    })
                }
                getMPG();
            }
            fuelCalc();
        });
    }



    var startInput = document.getElementById('autocompleteStart');
    var autocompleteStart = new google.maps.places.Autocomplete(startInput, {
        types: []
    });
    google.maps.event.addListener(autocompleteStart, 'place_changed', function () {
        var place = autocompleteStart.getPlace();
    })

    var endInput = document.getElementById('autocompleteEnd');
    var autocompleteEnd = new google.maps.places.Autocomplete(endInput, {
        types: []
    });
    google.maps.event.addListener(autocompleteEnd, 'place_changed', function () {
        var place = autocompleteEnd.getPlace();
    })

}

var getMakes = function () {
    $("#make").find('option').not(':first').remove();
    $("#model").find('option').not(':first').remove();
    $("#option").find('option').not(':first').remove();
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
    $("#model").find('option').not(':first').remove();
    $("#option").find('option').not(':first').remove();

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

    $("#option").find('option').not(':first').remove();
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