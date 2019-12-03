


$(document).ready(function() {


    var queryURL = "https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328"

    $.ajax({
        url: queryURL,
        method: "GET"
    }) .then(function(response) {
        console.log(response);
        for(var i=0; i < 15; i++){
           var newGame = $("<div>").addClass("game")
           var teams = $("<p>").text(response.events[i].strEvent);
           var gameTime = $("<p>").text(response.events[i].dateEvent + " at " + response.events[i].strTime);
            newGame.append(teams,gameTime);
           
           $("#upcoming-games").append(newGame);
        }
    });


});