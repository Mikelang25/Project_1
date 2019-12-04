    // Defining variables

var premierTeams = [];
var current;
var currentTime;
var firebaseConfig;
var database;
var selectedTeam;
var selectedUserTeam;

$(document).ready(function() {
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
 //listen for auth changes (user login/logout)
 auth.onAuthStateChanged(user => {
    if (user) {
        console.log(user);
        $("#currentUserDetails").empty();
        $("#currentUserDetails").append("First Name: " + user.displayName + "<br>");
        $("#currentUserDetails").append("Email: " + user.email);
    }
    else {
        console.log("user logged out");
    }

});
//login user with modal/form
$("#userLoginForm").submit(function (event) {
    event.preventDefault();

    var userEmailForLogin = $("#userInputEmail").val().trim();
    var userPasswordForLogin = $("#userInputPassword").val().trim();

    console.log(userEmailForLogin);
    console.log(userPasswordForLogin);
    // $("#exampleModalLogin").modal("hide");
    // $("#userInputEmail").val("");
    // $("#userInputPassword").val("");
    auth.signInWithEmailAndPassword(userEmailForLogin, userPasswordForLogin).then(cred => {

        var user = firebase.auth().currentUser;
        $("#currentUserDetails").append("First Name: " + user.displayName + "<br>");
        $("#currentUserDetails").append("Email: " + user.email);


    })

});
//logout user
$("#logoutB").on("click", function (event) {
    event.preventDefault();
    // $("#currentUser").val("");
    $("#currentUserDetails").empty("");
    auth.signOut().then(() => {

    });
})

//new user login form
$("#newUserInputForm").submit(function (event) {
    event.preventDefault();

    var newUserFirstNameSubmitted = $("#newUserInputFirstNameA").val().trim();

    var newUserEmailSubmitted = $("#newUserInputEmailA").val().trim();
    var newUserPasswordSubmitted = $("#newUserInputPasswordA").val().trim();
    console.log(newUserFirstNameSubmitted);
    console.log(newUserEmailSubmitted);
    console.log(newUserPasswordSubmitted);
    // $("#exampleModalA").modal("hide");
    // $("#newUserInputFirstNameA").val("");
    // $("#newUserInputPasswordA").val("");

    // $("#extraDiv").append(newUserEmailSubmitted);
    // $("#extraDiv2").append(newUserPasswordSubmitted);
    // $("#extraDiv3").append(newUserFirstNameSubmitted);
    auth.createUserWithEmailAndPassword(newUserEmailSubmitted, newUserPasswordSubmitted).then(cred => {

        console.log(cred);
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: newUserFirstNameSubmitted,

        }).then(function () {
            // Update successful.
            console.log(user.displayName);

            // $("#extraDiv4").html("Cheers " + user.displayName);
        }).catch(function (error) {
            // An error happened.
        });


    });


});
 // //add new favorite team
 $("select.teamList").change(function (event) {
    var user = firebase.auth().currentUser;
    event.preventDefault();
    var selectedTeam = $(this).children("option:selected").val();
    console.log(selectedTeam)
    console.log(user.displayName);
    $(".favoriteTeamBox").html(user.displayName + ", your Favorite Team: " + selectedTeam);
    var selectedUserTeam = {
        selectedTeamForDatabase: selectedTeam
    }

    // Uploads new favorite team data to the database
    database.ref(user.uid).set(selectedUserTeam);

});
// Initial Values
var userMessage = "";


// Capture Button Click
$("#submitButtonForMessage").on("click", function (event) {
    event.preventDefault();

    userMessage = $("#userMessage1").val().trim();
    console.log(userMessage);

    //Code for the push
    database.ref().push({

        message: userMessage,

    });
});

//add user messages from user from firebase to html
database.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().message);
    // Change the HTML to reflect
    $("#recentMember").prepend(childSnapshot.val().message);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});



//Mike Begin 

// Calls the sportDB api to get the upcoming 15 premier league matches 
var queryURL = "https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328"
$.ajax({
    url: queryURL,
    method: "GET"
}) .then(function(response) {
   
    for(var i=0; i < 15; i++){
        var convertedTime = moment(response.events[i].strTime,"HH:mm").format("hh:mm a");
        var newGame = $("<div>").addClass("game")
        var teams = $("<p>").text(response.events[i].strEvent);
        var gameTime = $("<p>").text(response.events[i].dateEvent + " at " + convertedTime);
        newGame.append(teams,gameTime);
        
        $("#upcoming-games").append(newGame);
    }
});

//Calls the sportDB api to get all the teams in the premier league 
var queryURL2 = "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=English%20Premier%20League"
$.ajax({
    url: queryURL2,
    method: "GET"
}) .then(function(response2) {
    for(var j=0;j<20;j++){
        var newTeam = {
            teamName: response2.teams[j].strTeam,
            teamId: response2.teams[j].idTeam
        }
        premierTeams.push(newTeam);

        //Takes the current team and id and creates the favorite team dropdown that the user will be able to select 
        var newOption = $("<option>").text(response2.teams[j].strTeam).attr("teamID",response2.teams[j].idTeam)
        var newOption2 = $("<option>").text(response2.teams[j].strTeam).attr("id",response2.teams[j].idTeam)
        $("#team-dropdown").append(newOption);
        $("#team-select").append(newOption2);
    }
});


function leagueInfo(){
    //Calls the sportDB api to get all team details of premier league seasons 
    var queryURL3 = "https://www.thesportsdb.com/api/v1/json/1/search_all_seasons.php?id=4328"
    $.ajax({
        url: queryURL3,
        method: "GET"
    }) .then(function(response3) {
            var currentSeason = response3.seasons.length - 1
            var queryURL4 = "https://www.thesportsdb.com/api/v1/json/1/lookuptable.php?l=4328&s=" + response3.seasons[currentSeason].strSeason
            $.ajax({
                url: queryURL4,
                method: "GET"
            }) .then(function(response4) {
                    console.log(response4);
                for(var k=0; k<response4.table.length;k++){
                    var tableTeam = response4.table[k].name;
                    var tableGP = response4.table[k].played;
                    var tableWins = response4.table[k].win;
                    var tableDraws = response4.table[k].draw;
                    var tableLosses = response4.table[k].loss;
                    var tablePoints = response4.table[k].total;

                    var tableItem = $("<tr>").append(
                        $("<td>").text(response4.table[k].name),
                        $("<td>").text(response4.table[k].played),
                        $("<td>").text(response4.table[k].win),
                        $("<td>").text(response4.table[k].draw),
                        $("<td>").text(response4.table[k].loss),
                        $("<td>").text(response4.table[k].total)                        
                    )
                    $("#premiere-standings").append(tableItem);
                }
                    
            });
    });
}
leagueInfo();


function teamResults(teamID){
    //Calls the sportDB api to get all team details of premier league seasons 
    var queryURL5 = "https://www.thesportsdb.com/api/v1/json/1/eventslast.php?id=" + teamID
    $.ajax({
        url: queryURL5,
        method: "GET"
    }) .then(function(response5) {
        console.log(response5)
        for(var l=0; l<response5.results.length;l++){
            var gameMatch = $("<div>").addClass("hist-games");
            var gameTeams = $("<p>").text(response5.results[l].strEvent).addClass("game-teams");
            var gameLeague = $("<p>").text(response5.results[l].strLeague).addClass("game-details");
            var gameResults = $("<p>").text(response5.results[l].intHomeScore + " - " + response5.results[l].intAwayScore).addClass("game-results");
            gameMatch.append(gameTeams,gameLeague,gameResults);
            $("#hist-results").append(gameMatch);
        }
    });
}

//This will empty the historical results div and make another call for the last 5 match results for the chosen team
$("#team-select").on('change',function(){
    $("#hist-results").empty();
    var getValue=$(this).find('option:selected').attr('id');
    teamResults(getValue);
  });

teamResults("133604");

//Mike End 

    
 //current London date and time function shown in html
 function currentTime() {
    var current = moment().tz('Europe/London').format('MMMM Do YYYY, h:mm:ss A');
    $("#time").html("London time: " + current);
    setTimeout(currentTime, 1000);
};
currentTime();
});