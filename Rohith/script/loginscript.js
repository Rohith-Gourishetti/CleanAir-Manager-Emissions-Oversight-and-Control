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
        verify(u, p);
    }
});

function verify(u, p) {
    var url = '/ulogin/' + u + '/' + p;

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
       if(data.success){
          alert('login successful');
          parent.window.location.href = '/dashboard/'+u;
       }
       else{
          alert(data.message);
       }
    })
}