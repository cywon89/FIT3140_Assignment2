
//load required modules
var fs = require('fs')
    , http = require('http')
    , express = require('express')
    , b = require('bonescript')
    , admin = require("firebase-admin")
    , date = new Date();

//create HTTP server
var app = express();
app.get('/', function(req,res){
    res.sendfile(__dirname+'/index.html')
})
var server = http.createServer(app);

//Initialise firebase
//this is retrueved from Project Settings -> Service Accounts
//Admin SDK Configuration Support
var admin = require("firebase-admin");
//fetch service account
var serviceAccount = require("path/to/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trafficanalyzer-a0c72.firebaseio.com"
});

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyByJX3HPuRMsFxgf3BDTW4laFLiZIqfa2o",
    authDomain: "trafficanalyzer-a0c72.firebaseapp.com",
    databaseURL: "https://trafficanalyzer-a0c72.firebaseio.com",
    projectId: "trafficanalyzer-a0c72",
    storageBucket: "trafficanalyzer-a0c72.appspot.com",
    messagingSenderId: "338644690212"
  };

  firebase.initializeApp(config);
  
  firebase.auth().signInWithEmailAndPassword('fit3140.s12018.10m@gmail.com', iloveclarissa).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Connected to Firebase Successful!")
    // 
  });
  

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name
var sensorRef = db.ref("/Sensor");

ref.on("value", function(snapshot) {   //this callback will be invoked with each new object
  console.log(snapshot.val());         // How to retrive the new added object
}, function (errorObject) {             // if error
  console.log("The read failed: " + errorObject.code);
});

//set pins for led and motion sensor
var led = "P8_11"
    , motion = "P9_11";
b.pinMode(led, b.OUTPUT);
b.pinMode(motion, b.INPUT);
setInterval(checkPIR, 1000); //listening every 1000millisecond


var sensorState = 0  //starting state of sensor off
var motionCounter = 0;

//this function checks state of motion
//prints to console if motion is detected
function checkPIR(){
    b.digitalRead(motion, printStat);
}


// led pin lights up when a motion is detected
function printStat(x){
    if (x.value === 1){
       
        motionCounter += 1;
        console.log('counter: ' + motionCounter);
    }else{  
        b.digitalWrite(led,1);
        motionCounter = 0;
        pushData();
    }
}

//long motion: turns on led
if (motionCounter >= 3){
    b.digitalWrite(led, 1);
}
else{ //short motion: no led
    b.digitalWrite(led, 0);
}


var index = 0;

function pushData(){
    ref.push({
        id: 1,
        type: 'motion',
        status: 'on'
    });
}


server.listen(3004);
console.log('Running...')