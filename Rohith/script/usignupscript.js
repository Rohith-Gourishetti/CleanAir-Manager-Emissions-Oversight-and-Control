document.querySelector('#otp1').addEventListener('click', function () {
  var v = document.querySelector('#name').value;
  var c = document.querySelector('#password').value;
  var f = document.querySelector('#pass2').value;
  var o = document.querySelector('#ot').value;
  var d = document.querySelector('#otp1').innerHTML;
  if (v === '') {
    alert('Enter your user name');
  }
  else if (c === '' || f === '') {
    alert('Enter your password');
  }
  else if (c !== f) {
    alert('Password and confirm password do not match');
  }
  else if (!isValidEmail(v)) {
    alert("Please enter a valid email address");
  }
  else if (!isValidPassword(c)) {
    alert("password must contain 1 small and 1 captial character,a number,a special character");
  }
  else if (d !== 'Submit') {
    ex(v);
  }
  else if (d === 'Submit') {
    if (o === '') {
      alert('enter the otp');
    }
    else {
      val(v, c, o);
    }
  }
});
function ex(v) {
  var b = '/otp/' + v;
  fetch(b)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.querySelector('.in5').style.display = 'flex';
        document.querySelector('#otp1').innerHTML = 'Submit';
        alert("mail sent successfully");
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error requesting OTP:', error);
    });
}
function val(v, c, o) {
  var b = '/validate4/' + v + '/' + c + '/' + o;
  console.log('ok');
  fetch(b)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('sign up successful');
        document.location.href = 'ulogin.html';
      }
      else {
        alert(data.message);
      }
    })
}
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  return passwordRegex.test(password);
}
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}