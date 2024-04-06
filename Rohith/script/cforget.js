document.querySelector('#otp2').addEventListener('click', (e) => {
    var a = document.querySelector('#name').value;
    var a1 = document.querySelector('#ot').value;
    if (a === '') {
        alert('Enter the mail id');
    }
    else {
        if (document.querySelector('#otp2').innerHTML === 'Send Otp') {
            fetch('/otp1/' + a)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert('opt sent successfully')
                        document.querySelector('.in5').style.display = 'flex';
                        document.querySelector('#otp2').innerHTML = 'Submit';
                    }
                    else {
                        alert('mail id not present')
                    }
                })
        }
        else {
            if (a1 === '') {
                alert('Enter the otp')
            }
            else {
                fetch('/validate2/' + a + '/' + a1)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert('Password Sent to mail successfully')
                            window.location.href = 'companylogin.html'
                        }
                        else {
                            alert(data.message)
                        }
                    })
            }
        }
    }
})