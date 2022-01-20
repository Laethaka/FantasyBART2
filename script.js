// console.log(moment().hour());
// console.log(moment().minute());
// console.log(moment().second());

//FIREBASE INITIALIZATION
var config = {
    apiKey: "AIzaSyA4SDJvTZhgwIP2P-N04gZJ7nG9GrhKI5I",
    authDomain: "logicmay7.firebaseapp.com",
    databaseURL: "https://logicmay7.firebaseio.com",
    projectId: "logicmay7",
    storageBucket: "logicmay7.appspot.com",
    messagingSenderId: "333072418936"
};
firebase.initializeApp(config);

var database = firebase.database();

//ADDER BUTTON
$('#adderButton').on('click', function() {
    var name = $('#newName').val();
    var destination = $('#newDestination').val();
    var start = $('#newStartTime').val();
    var frequency = $('#newFrequency').val();

    database.ref('trains/' + name).set({
        trainName: name,
        trainDestination: destination,
        trainStart: start,
        trainFrequency: frequency
    });

    $('#newName, #newDestination, #newStartTime, #newFrequency').val('');
});


//TABLE UPDATING FROM FIREBASE
database.ref('trains/').on('value', function(snapshot) {
    $('#trainTable').empty();
    var idx;
    for (idx in snapshot.val()) {
        
        //BASIC INFO ENTRIES
        var tRow = $('<tr>');
        var cellName = $('<td>').text(snapshot.val()[idx].trainName)
        var cellDest = $('<td>').text(snapshot.val()[idx].trainDestination)
        var cellFreq = $('<td>').text(snapshot.val()[idx].trainFrequency)

        //COMPUTING NEXT ARRIVAL TIME
        var startTrain = moment(snapshot.val()[idx].trainStart, 'HHmm');
        var currentTime = moment();
        nextTrain = startTrain.clone()
        while (nextTrain.isBefore(currentTime)) {
            nextTrain.add(snapshot.val()[idx].trainFrequency, 'minutes')
        }
        var cellNext = $('<td>').text(nextTrain.format('HH:mm'));

        //COMPUTING ETA
        var cellETA = $('<td>').text(nextTrain.fromNow());

        //ADDING ROW TO TABLE
        tRow.append(cellName, cellDest, cellFreq, cellNext, cellETA)
        $('#trainTable').append(tRow);
    }
});


