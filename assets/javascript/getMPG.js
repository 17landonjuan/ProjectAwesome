function getMPG() {

    var year = $("#year").val();
    var make = $("#make").val();
    var model = $("#model").val();
    var option = $("#option option:selected").attr("data-id");
    console.log(option);



    $.ajax({
        type: "GET",
        url: "https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=" + year + "&make=" + make +
            "&model=" + model,
        dataType: "xml",

    }).then(function (response) {
        var carID = xmlToJson(response).menuItems.menuItem[0].value["#text"]


        $.ajax({
            type: "GET",
            url: "https://www.fueleconomy.gov/ws/rest/vehicle/" + carID,
            dataType: "xml",
        }).then(function (response) {
            highwayMPG = xmlToJson(response).vehicle.highway08["#text"];
            console.log("getMPG done")
            var totalGas = convertedDistance / highwayMPG
            console.log(totalGas)
        })

    })

}