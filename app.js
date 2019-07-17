var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var user = require("./DBschema/user");
var excel2json = require("./excel2json");
var fs = require('fs');


// view engine setup
var PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
app.use(express.static('public'))
app.use(express.static('views'))
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
  fs.readFile(req.files.image.path, function (req, res) {
    var dirname = path.resolve(".") + '/UploadFile/';
    var newPath = dirname + req.files.image.orignalFilename;
    fs.writeFile(newPath, data, function (err) {
      if (err) {
        res.json("Failed to upload File");
      }
      else {
        excel2json(newPath);
        res.json("Upload Successful");
      }
    });
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


