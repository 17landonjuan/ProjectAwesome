
// Boiler plate 'document-ready-function'
$(document).ready(function () {


});
//----------------------------
// Variables
// ---------------------------

var tripStart = "";
var tripEnd = "";
var carMake = "";
var carModel = "";
var carYear = "";
var totalNumOnTrip = "";

// On click, do this: 
$(document).on("click", '#test', function () {

    // Constructing a URL to search EIA for the average price of unleaded regular gas
    var queryURL1 = "http://api.eia.gov/series/?api_key=4e2512a68239a8a4d7fcccd3cea3b0c1&series_id=TOTAL.RUUCUUS.M";

    // Test
    console.log(queryURL1);

    // Performing our AJAX GET request
    $.ajax({
        url: queryURL1,
        method: "GET"
    })

        // After the data comes back from the API, do the actions in this function
        .then(function (response) {

            // Storing an array of results in the results variable
            var results = response.series;

            // Test
            console.log(results);

            // Creating variable to drill down to monthly average price of unleaded gas
            var avgPriceUnlRegGas = results[0].data[0][1];

            console.log(avgPriceUnlRegGas);

            // Variable to create paragraph with gas price info
            var p1 = $("<p>").text("National Monthly Average Price of Unleaded Gas: $" + avgPriceUnlRegGas);

            // Appending gas price info paragraph to gas-price div
            $('.gas-price').append(p1);

            // Function to calculate total price of gas for trip and divide by user input number of people on tirp
            var tripCostDividedByFriends = function () {

                // Variables with paceholder values to calculate total price of gas for trip
                // Get this value from car API
                var mpg = 20;

                // Get this value from Google Maps API (will be in meters)
                var totalTripDistance = 100000;

                // Get this value from user input
                var totalNumOnTrip = 4;

                // Conversion from meters to miles
                var milesOverMeters = 1 / 1609.34;

                // Total Trip Distance in Miles
                var totalTripDistanceMi = totalTripDistance * milesOverMeters;

                // Total gallons of gas used on the trip
                var totalGasUsed = totalTripDistanceMi / mpg;

                // Total cost of gas
                var totalGasCost = Math.round((totalGasUsed * avgPriceUnlRegGas) * 100) / 100;

                // Total cost of gas per friend
                var costOfGasPerFriend = Math.round((totalGasCost / totalNumOnTrip) * 100) / 100;

                console.log("Total Trip Distance: " + totalTripDistanceMi + " mi");
                console.log("Total Gas Used on Trip: " + totalGasUsed + " gallons");
                console.log("Total Cost of Gas on Trip: $" + totalGasCost);
                console.log("Cost of Gas per Friend $ " + costOfGasPerFriend);

                var p2 = $("<p>").text("Total Trip Distance: " + totalTripDistanceMi + " mi");
                var p3 = $("<p>").text("Total Gas Used on Trip: " + totalGasUsed + " gallons");
                var p4 = $("<p>").text("Total Cost of Gas on Trip: $" + totalGasCost);
                var p5 = $("<p>").text("Cost of Gas per Friend: $ " + costOfGasPerFriend);

                $('.gas-price').append(p2);
                $('.gas-price').append(p3);
                $('.gas-price').append(p4);
                $('.gas-price').append(p5);

            };
            tripCostDividedByFriends();

        })
})