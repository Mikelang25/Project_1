


$(document).ready(function() {
var current;
var currentTime;


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
    //current London date and time function shown in html
function currentTime() {
    var current = moment().tz('Europe/London').format('MMMM Do YYYY, h:mm:ss A');
    $("#time").html("London time: " + current);
    setTimeout(currentTime, 1000);
};
    currentTime();

});