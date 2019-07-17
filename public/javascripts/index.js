const port = 7000;
const baseurl = "https://xl2json.herokuapp.com";

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail.value)) {
    return (true)
  }
  alert("Invalid Email ID. Please enter your valid Email ID.")
  return (false)
}

function gotomain() {

  url1 = baseurl + '/main';
  $.ajax({
    url: url1,
    type: 'GET',
    dataType: 'json',
    success: function (res) {
    }
  })
}

function checklogin() {
  var userId = localStorage.getItem("UserId");
  if (userId == null) {
    alert("please login before continuing");
    location.href = "index.html";
  }
}
function authenticate(form1) {
  email = form1.text1.value;
  password = form1.text2.value;
  url1 = baseurl + '/login';
  var datatosend = {
    "Email": email,
    "Password": password
  };
  $.ajax({
    url: url1,
    type: 'POST',
    dataType: 'json',
    data: datatosend,
    success: function (res) {
      alert(res.message);
      if (res.message == "User Authenticated") {
        localStorage.setItem("UserId", email);
        gotomain();
      }
    }
  });
}
