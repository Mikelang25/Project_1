$(document).ready(function () {

    // Defining variables

    var premierTeams = [];
    var current;
    var currentTime;
    var firebaseConfig;
    var database;
    var selectedTeam;
    var selectedUserTeam;
    var userEmailForLogin;

    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBkKBSDoo-b9RbS4wUHmCJ79eELR5NCy_Q",
        authDomain: "project-one-sample.firebaseapp.com",
        databaseURL: "https://project-one-sample.firebaseio.com",
        projectId: "project-one-sample",
        storageBucket: "project-one-sample.appspot.com",
        messagingSenderId: "8126571456",
        appId: "1:8126571456:web:8732aa8e00fb6ea9c1de25",
        measurementId: "G-J90PRM2FYK"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    var database = firebase.database();
    var auth = firebase.auth();

    $("#chat-content").empty();
    //listen for auth changes (user login/logout)

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log(user);

            $("#btn-sub-msg").show();
            $("#chat-content").css("background-color", "white")
            $("#chat-content").removeClass("text-center");
            $("#user-logged-in").text("Cheers!  " + user.displayName);
            $("#currentUserDetails").empty();
            $("#currentUserDetails").append("First Name: " + user.displayName + "<br>");
            $("#currentUserDetails").append("Email: " + user.email);
            $("#chat-content").empty();

            //query to database for all user messages limited to last 25 messages

            var ref = firebase.database().ref();
            ref.on("child_added", function (snapshot) {

                var messagesStored = $("<p>").text(snapshot.val().message);

                $("#chat-content").append(messagesStored);

            });

        }
        else {
            $("#chat-content").css("background-color", "black");
            $("#chat-content").empty();
            $("#btn-sub-msg").hide();
            var lockImage = $("<div>").html("<i class='fas fa-user-lock fa-9x'></i>").css("color","white").addClass("lock-image")
            $("#chat-content").addClass("text-center");
            var loginMessage = $("<div>").text("Access only for Premier League Fan Zone Users! Create an account or login to chat with us").css("color","white").css("font-size","18pt")
            $("#chat-content").append(lockImage,loginMessage);

            console.log("user logged out");
        }

    });
    //login user with modal/form
    $("#userLoginForm").submit(function (event) {
        event.preventDefault();
        userEmailForLogin = $("#userInputEmail").val().trim();
        var userPasswordForLogin = $("#userInputPassword").val().trim();
        //email and password verification
        firebase.auth().signInWithEmailAndPassword(userEmailForLogin, userPasswordForLogin).catch(function (error) {
            // Handle Errors here.
            alert("Either the email or the password associated with this email is incorrect - Please login again.");
        });


        $("#exampleModalLogin").modal("hide");
        $("#userInputEmail").val("");
        $("#userInputPassword").val("");

    });

    //logout user
    $("#logoutB").on("click", function (event) {
        event.preventDefault();
        // $("#currentUser").val("");
        $("#currentUserDetails").empty("");
        $("#user-logged-in").empty("");
        auth.signOut().then(() => {
        $("#chat-content").empty();
        alert("you have been logged out")
        });
    })

    //new user login form
    $("#newUserInputForm").submit(function (event) {
        event.preventDefault();

        var newUserFirstNameSubmitted = $("#newUserInputFirstNameA").val().trim();

        var newUserEmailSubmitted = $("#newUserInputEmailA").val().trim();
        var newUserPasswordSubmitted = $("#newUserInputPasswordA").val().trim();
        $("#exampleModalA").modal("hide");
        $("#newUserInputFirstNameA").val("");
        $("#newUserInputPasswordA").val("");


        firebase.auth().createUserWithEmailAndPassword(newUserEmailSubmitted, newUserPasswordSubmitted).catch(function (error) {
            // Handle Errors here.

        }).then(function () {
            // Update successful.

            var user = firebase.auth().currentUser;
            $("#user-logged-in").text("Welcome!  " + user.displayName);
            user.updateProfile({
                displayName: newUserFirstNameSubmitted,
            })

                .catch(function (errorObject) {
                    // An error happened.
                    console.log("Errors handled: " + errorObject.code);
                });
         


        });




    });

    // Initial Values
    var userMessage = "";


    // Capture Button Click for adding user message
    $("#btn-sub-msg").on("click", function (event) {
        var user = firebase.auth().currentUser;
        userMessage = user.displayName + " : " + $("#userMessage1").val().trim();

        //Code for the push to firebase database
        database.ref().push({

            message: userMessage,

        });

        $("#userMessage1").val("")
    
    $("#chat-content").empty();
    //add user messages from firebase to html
    database.ref().on("child_added", function (childSnapshot) {
        // Change the HTML to reflect
        var newMessage = $("<p>").text(childSnapshot.val().message);
        $("#chat-content").append(newMessage);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});


    //Mike Begin 

    // Calls the sportDB api to get the upcoming 15 premier league matches 
    var queryURL = "https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (var i = 0; i < 15; i++) {
            var convertedTime = moment(response.events[i].strTime, "HH:mm").format("hh:mm a");
            var newGame = $("<div>").addClass("game")
            var teams = $("<p>").text(response.events[i].strEvent).addClass("game-item");
            var gameTime = $("<p>").text(response.events[i].dateEvent + " at " + convertedTime).addClass("game-item");
            newGame.append(teams, gameTime);

            $("#upcoming-games").append(newGame);
        }
    });

    //Calls the sportDB api to get all the teams in the premier league 
    var queryURL2 = "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=English%20Premier%20League"
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response2) {
        for (var j = 0; j < 20; j++) {
            var newTeam = {
                teamName: response2.teams[j].strTeam,
                teamId: response2.teams[j].idTeam
            }
            premierTeams.push(newTeam);

            //Takes the current team and id and creates the favorite team dropdown that the user will be able to select 
            var newOption = $("<option>").text(response2.teams[j].strTeam).attr("teamID", response2.teams[j].idTeam)
            var newOption2 = $("<option>").text(response2.teams[j].strTeam).attr("id", response2.teams[j].idTeam)
            $("#team-dropdown").append(newOption);
            $("#team-select").append(newOption2);
        }
    });


    function leagueInfo() {
        //Calls the sportDB api to get all team details of premier league seasons 
        var queryURL3 = "https://www.thesportsdb.com/api/v1/json/1/search_all_seasons.php?id=4328"
        $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function (response3) {
            var currentSeason = response3.seasons.length - 1
            var queryURL4 = "https://www.thesportsdb.com/api/v1/json/1/lookuptable.php?l=4328&s=" + response3.seasons[currentSeason].strSeason
            $.ajax({
                url: queryURL4,
                method: "GET"
            }).then(function (response4) {
                for (var k = 0; k < response4.table.length; k++) {

                    var tableItem = $("<tr>").append(
                        $("<td>").text(response4.table[k].name),
                        $("<td>").text(response4.table[k].played),
                        $("<td>").text(response4.table[k].win),
                        $("<td>").text(response4.table[k].draw),
                        $("<td>").text(response4.table[k].loss),
                        $("<td>").text(response4.table[k].total)
                    )
                    tableItem.addClass("table-content")
                    $("#premiere-standings").append(tableItem);
                }

            });
        });
    }
    leagueInfo();


    function teamResults(teamID) {
        //Calls the sportDB api to get all team details of premier league seasons 
        var queryURL5 = "https://www.thesportsdb.com/api/v1/json/1/eventslast.php?id=" + teamID
        $.ajax({
            url: queryURL5,
            method: "GET"
        }).then(function (response5) {

            for (var l = 0; l < response5.results.length; l++) {
                var gameMatch = $("<div>").addClass("hist-games");
                var gameTeams = $("<p>").text(response5.results[l].strEvent).addClass("game-teams");
                var gameLeague = $("<p>").text(response5.results[l].strLeague).addClass("game-details");
                var gameResults = $("<p>").text(response5.results[l].intHomeScore + " - " + response5.results[l].intAwayScore).addClass("game-results");
                gameMatch.append(gameTeams, gameLeague, gameResults);
                $("#hist-results").append(gameMatch);
            }
        });
    }

    function teamHighlights(teamName) {
        //Calls the sportDB api to get all live games
        var queryURL6 = "https://www.thesportsdb.com/api/v1/json/4013017/eventshighlights.php?l=English%20Premier%20League"
        $.ajax({
            url: queryURL6,
            method: "GET"
        }).then(function (response6) {
            for (var h = 0; h < response6.tvhighlights.length; h++) {
                var matchTeams = response6.tvhighlights[h].strEvent
                var matchLink = response6.tvhighlights[h].strVideo
                if (matchTeams.includes(teamName)) {

                    var highTitle = $("<p>").text(response6.tvhighlights[h].strEvent).addClass("lbl-high");
                    $("#title-high").append(highTitle);

                    var updatedLink = matchLink.replace("watch?v=", "embed/")
                    $("#video-player").attr("src", updatedLink)
                }
            }
        });
    }

    function liveScore() {
        //Calls the sportDB api to get all live games
        var queryURL7 = "https://www.thesportsdb.com/api/v1/json/4013017/latestsoccer.php?l=English%20Premier%20League"
        $.ajax({
            url: queryURL7,
            method: "GET"
        }).then(function (response7) {
            console.log(response7)
            for (var l = 0; l < response7.teams.Match.length; l++) {
                var liveLeague = response7.teams.Match[l].League 
                if(liveLeague =="English Premier League"){
                    var liveMatch = $("<div>")
                    var liveHome = $("<p>").text(response7.teams.Match[l].HomeTeam);
                    var liveAway = $("<p>").text(response7.teams.Match[l].AwayTeam);
                    var homeGoals = $("<p>").text(response7.teams.Match[l].HomeGoals);
                    var awayGoals = $("<p>").text(response7.teams.Match[l].AwayGoals);
                    var matchPart = $("<div>").append(liveHome,liveAway).css("display","inline-block").css("margin-right","15px");
                    var matchScore = $("<div>").append(homeGoals,awayGoals).css("display","inline-block").css("margin-right","10px");
                    var updatedTime= response7.teams.Match[l].Time.replace("Finished","FT");
                    updatedTime = updatedTime.replace("Not started","0'");
                    var timeLeft = $("<div>").text(updatedTime).css("display","inline-block");
                    liveMatch.append(matchPart,matchScore,timeLeft).css({"float":"left","padding":"20px"}).addClass("live-match");
                    $("#live-scores").append(liveMatch);
                }
            }
        });
    }

    //This will empty the historical results div and make another call for the last 5 match results for the chosen team
    $("#team-select").on('change', function () {
        $("#hist-results").empty();
        $("#title-high").empty();
        var getValue = $(this).find('option:selected').attr('id');
        var teamValue = $(this).find('option:selected').text();
        teamResults(getValue);
        teamHighlights(teamValue);
    });

    function locateWeather(){

        $("#weather-info").empty();
        $("#weather-icon").empty();

        var locationSelected = "London";
        var queryURL8 = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=HttSJfsjnPLSqcMJkfz97hZrKXcNXMHH&q=" + locationSelected;

        $.ajax({
            url: queryURL8,
            method: "GET"
        }) .then(function(response) {
            var queryURL9 = "https://dataservice.accuweather.com/forecasts/v1/daily/1day/" + response[0].Key + "?apikey=HttSJfsjnPLSqcMJkfz97hZrKXcNXMHH&details=true&metric=true";
            $.ajax({
                url: queryURL9,
                method: "GET"
            }) .then(function(weather) {
                console.log(weather);
                var weatherInfo = $("<div>").addClass("weather")
                var temp = $("<div>").text("High / Low: "  + (parseInt(weather.DailyForecasts[0].Temperature.Maximum.Value)*1.8 +32).toFixed(0) + " F" + "       " + (parseInt(weather.DailyForecasts[0].Temperature.Minimum.Value)*1.8 +32).toFixed(0)+" F").addClass("weather-item");
                var temp2 = $("<div>").text(weather.Headline.Text).addClass("weather-item");
                weatherInfo.append(temp);
                weatherInfo.append(temp2);
                $("#weather-info").append(weatherInfo);
                var currentWeather = weather.Headline.Category;
                var iconSelect; 
                var iconColor;
                switch(currentWeather){

                    case "snow/rain":
                        iconSelect = "<i class='fas fa-snowflake fa-6x' color='blue'></i>"
                        iconColor = "lightblue"
                    break;
                    case "snow/ice":
                            iconSelect = "<i class='fas fa-snowflake fa-6x' color='blue'></i>"
                            iconColor = "lightblue"
                        break;
                    case "cooler":
                        iconSelect = "<i class='fas fa-temperature-low fa-6x'></i>"
                        iconColor = "lightblue"
                    break;
                    case "rain":
                        iconSelect = "<i class='fas fa-cloud-rain fa-6x'></i>"
                        iconColor = "grey"
                    break;
                    case "":
                        iconSelect = "<i class='fas fa-sun fa-6x'></i>"
                        iconColor = "orange"
                    break;
                    case "thunderstorm":
                        iconSelect = "<i class='fas fa-poo-storm fa-6x'></i>"
                        iconColor = "orange"
                    break;
                    case "snow":
                        iconSelect = "<i class='fas fa-snowflake fa-6x' color='blue'></i>"
                        iconColor = "lightblue"
                    break;
                    case "wind":
                        iconSelect = "<i class='fas fa-wind fa-6x' color='black'></i>"
                        iconColor = "grey"
                    break;

                }

                var weatherIcon = $("<div>").html(iconSelect).addClass("weather-icon-sun").css("color",iconColor);
                $("#weather-icon").append(weatherIcon);

                var sunRise =$("<div>").text("Sun Rise: " + moment(weather.DailyForecasts[0].Sun.Rise).format("hh:mm a")).addClass("weather-item");
                var sunSet = $("<div>").text("Sun Set: " + moment(weather.DailyForecasts[0].Sun.Set).format("hh:mm a")).addClass("weather-item");

                $("#weather-info").append(sunRise);
                $("#weather-info").append(sunSet);

            });
        });
    }




    liveScore();
    locateWeather();
    teamResults("133604");
    teamHighlights("Arsenal")

    //Mike End 


    //current London date and time function shown in html
    function currentTime() {
        var current = moment().tz('Europe/London').format('MMMM Do YYYY, h:mm:ss A');
        $("#time").html("London time: " + current);
        setTimeout(currentTime, 1000);
    };
    currentTime();

    // Helper functions
    function focusWaiter(element) {
        setTimeout(function() {
            $(element).focus();
        }, 500);
    }
    // Wait for input to focus on
    $("#login-button").on("click", function(){
        focusWaiter('#userInputEmail');
    });
    $("#new-user-button").on("click", function(){
        focusWaiter('#newUserInputFirstNameA');
    });

});