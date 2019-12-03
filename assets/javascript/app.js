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





    // Calls the sportDB api to get the upcoming 15 premier league matches 
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

    //Calls the sportDB api to get all the teams in the premier league 
    var queryURL2 = "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=English%20Premier%20League"
    $.ajax({
        url: queryURL2,
        method: "GET"
    }) .then(function(response2) {
        for(var j=0;j<20;j++){
            premierTeams.push(response2.teams[j].strTeam);
        }
        console.log(premierTeams);
    });
 //current London date and time function shown in html
 function currentTime() {
    var current = moment().tz('Europe/London').format('MMMM Do YYYY, h:mm:ss A');
    $("#time").html("London time: " + current);
    setTimeout(currentTime, 1000);
};
currentTime();
});