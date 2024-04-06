function imgchange() {
    const x = document.querySelector('.eye');
    if (x.src.endsWith("hide.png")) {
        x.src = "visible.png";
        document.querySelector('.pass').type = 'password';
    } else {
        x.src = "hide.png";
        document.querySelector('.pass').type = 'text';
    }
}

document.querySelector('#logincheck').addEventListener('click', (event) => {
    event.preventDefault();
    var u = document.querySelector('#user').value;
    var p = document.querySelector('#password').value;
    if (u === '') {
        alert('Enter the user name');
    } else if (p === '') {
        alert('Enter the password');
    } else {
        verify(u,p);
    }
});
function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + value + expires + '; path=/';
}
function verify(u, p) {
    var url = '/ulogin/' + u + '/' + p;
    console.log('login');
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('login successful');
                setCookie('uid', u, 7);
                parent.window.location.href = 'userdashboard.html';
            }
            else {
                alert("username or password is incorrect");
            }
        })
}