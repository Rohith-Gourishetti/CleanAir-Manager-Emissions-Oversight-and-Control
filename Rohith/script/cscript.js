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

    // Combine the conditions to check for empty values
    if (!u || !p) {
        alert('Enter both the username and password');
    } else {
        verify(u, p);
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
    var url = `/clogin/${u}/${p}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Login successful');
                setCookie('cid', u, 7);
                parent.window.location.href = '/cdashboard';

            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });

}
