var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var user = require("./DBschema/user");
var excel2json = require("./excel2json");
var fs = require('fs');
var bodyParser = require('body-parser');
var xlsx = require('xlsx');


// view engine setup
var PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server started on port ` + PORT));
app.use(express.static('public'))
app.use(express.static('views'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res, next) {
  res.sendFile('/index.html');
});
app.get('/main', function (req, res, next) {
  res.sendFile(path.resolve(".") + '/views/' + '/main.html');
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS,PATCH');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.post('/login', function (req, res) {
  var { email, password } = req.body;
  mongoose.connect(process.env.connectionString);
  user.findOne(email).select(Password).exec().then(user => {
    if (err) {
      message = err.message;
      res.statusMessage(message);
      res.send("error Occured");
    }
    else {
      if (password == user[0].Password) {
        res.statusMessage("User Authenticated");
        res.send("Welcome User");
      }
      else {
        res.statusMessage("Invalid details");
        res.send("UserId or Password mismatch");
      }
    }
  })
});

app.post('/upload', function (req, res) {
  console.log(req.files, " files");
  console.log(req.body, " body");
  // console.log(req, "request");
  var Uploadedfile = req.body.file1;
  fs.readFile(req.body.file1, function (error) {
    var dirname = path.resolve(".") + '/UploadFile/';
    var newPath = dirname + 'file1.json';
    var data = xlsx.utils.sheet_to_json(Uploadedfile);
    fs.writeFile(newPath, data, function (err) {
      if (err) {
        res.send("Failed to upload File");
      }
      else {
        res.sendFile('/main.html');
      }
    });
    excel2json(newPath);
    res.send();
  });
});

app.get('/view/:file', function (req, res) {
  file = req.params.file;
  var dirname = path.resolve(".") + '/UploadFile/';
  var jsondata = fs.read(dirname + file);
  res.json(jsondata);
});

app.get('/download', function (req, res) {
  file = req.params.file;
  var dirname = path.resolve(".") + '/UploadFile/';
  fs.readdir(dirname, function (err, list) {
    if (err) {
      return res.json(err);
    }
    else {
      res.json(list);
    }
  });
});

app.get('/download/:file(*)', function (req, res) {
  file = req.params.file;
  var dirname = path.resolve(".") + '/UploadFile/';
  var downloadpath = dirname + file;
  res.download(downloadpath);
});


