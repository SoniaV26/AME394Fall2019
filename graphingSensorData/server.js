var MS = require("mongoskin");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 3000;
var VALUEt = 0;
var VALUEh = 0;
var VALUEtime = 0;


var db = MS.db("mongodb://localhost:27017/sensorData")
app.get("/getAverage", function (req, res) { // edit this for A6
  var ts = parseInt(req.query.ts);
  var begin = new Date(ts);
  var end = new Date(ts);

     var begin = new Date()
     begin.setHours(0)
     begin.setMinutes(0)
     begin.setSeconds(0)
    

     var end = new Date()
     end.setHours(23)
     end.setMinutes(59)
     end.setMinutes(59)


	db.collection("data").find({ts:{$lte:end.getTime()}, ts:{$gt:begin.getTime()}}).toArray(function(err, result){
    var avg = { // calculate from result
     t: 0,
     h: 0
    }
    //forloop
    for(i=0;i<result.length();i++){
      t.avg += result.length[i].t;
      h.avg += result.length.h;
    }
    t.avg = t.avg/result.length;
    h.avg = h.avg/result.length;
  	res.send(tAvg + " "+  hAvg);
  });
});

app.get("/getLatest", function (req, res) {
  db.collection("data").find({}).sort({time:-1}).limit(10).toArray(function(err, result){
    res.send(JSON.stringify(result));
  });
});

app.get("/getData", function (req, res) {
  var from = parseInt(req.query.from);
  var to = parseInt(req.query.to);
  db.collection("data").find({time:{$gt:from, $lt:to}}).sort({time:-1}).toArray(function(err, result){
    res.send(JSON.stringify(result));
  });
});


app.get("/getValue", function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  res.send(VALUEt.toString() + " " + VALUEh + " " + VALUEtime + "\r");
});

app.get("/setValue", function (req, res) {
  VALUEt = parseFloat(req.query.t);
  VALUEh = parseFloat(req.query.h);
  VALUEtime = new Date().getTime();
	var dataObj = {
		t: VALUEt,
		h: VALUEh,
		time: VALUEtime
	}
	db.collection("data").insert(dataObj, function(err,result){
		console.log("added data: " + JSON.stringify(dataObj));
	});
  res.send(VALUEtime.toString());
});


app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
