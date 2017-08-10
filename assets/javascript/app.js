$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyBotTjWVeG5KvP_5N2xexuanMQZlOy0D3Y",
    authDomain: "trainscheduler-5f706.firebaseapp.com",
    databaseURL: "https://trainscheduler-5f706.firebaseio.com",
    projectId: "trainscheduler-5f706",
    storageBucket: "",
    messagingSenderId: "759032064457"
  };

  $('#date').html(moment().format('llll'));

  firebase.initializeApp(config);

  //Variable for firebase database
  var database = firebase.database();

  var tMinutesTillTrain = "";
  var nextTrain = "";



  //Add train button on click
  $('#add-train-btn').on('click', function() {
    event.preventDefault();

    //Grab input
    var trainName = $('#name-input').val().trim();
    var place = $('#destination-input').val().trim();
    var time = $('#first-time-input').val().trim();
    var freq = $('#frequency-input').val().trim();
    var nextTrain = "";
    var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    //Temp local object

    var newTrain = {
      name: trainName,
      destination: place,
      firstTime: firstTimeConverted,
      frequency: freq
    };

    //Upload to database
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTimeConverted);
    console.log(newTrain.frequency);

    //Clear input fields
    $('#name-input').val("");
    $('#destination-input').val("");
    $('#first-time-input').val("");
    $('#frequency-input').val("");


  });

  //Adding train info to database
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    //Store in variable
    var trainName = childSnapshot.val().name;
    var place = childSnapshot.val().destination;
    var firstTimeConverted = childSnapshot.val().firstTime;
    var freq = childSnapshot.val().frequency;

    //Train Info
    console.log(trainName);
    console.log(place);
    console.log(firstTimeConverted);
    console.log(freq);



    //Add to table
    $('#train-table> tbody').append("<tr><td>" + trainName + "</td><td>" + place + "</td><td>" + freq + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    console.log
  })

});
