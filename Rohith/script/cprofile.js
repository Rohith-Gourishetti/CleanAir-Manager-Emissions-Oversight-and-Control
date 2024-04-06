fetch('/cfetch')
.then(res=>res.json())
.then(data=>{
    if(data.success){
        document.querySelector('#email').value=data.user.email;
        document.querySelector('#name').value=data.user.name;
        document.querySelector('#phno').value=data.user.number;
    }
    else{
        alert('Failed to fetch details')
    }
});
document.querySelector('#but').addEventListener('click',(eve)=>{
    x=document.querySelector('#name').value;
    y=document.querySelector('#phno').value;
    if(x===''){
        alert('Enter you name');
    }
    else if(y===''){
        alert('Enter your phno');
    }

    else{
        var url = '/adddetails/'+x+'/'+y;
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                alert('data updated successfully');
                window.location.href='eprofile.html';
            }
            else{
                alert('Failed to update the data');
            }
        });
    }
});