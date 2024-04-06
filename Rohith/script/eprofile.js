fetch('/efetch')
.then(res=>res.json())
.then(data=>{
    if(data.success){
        document.querySelector('#email').value=data.user.email;
        document.querySelector('#name').value=data.user.name;
        document.querySelector('#phno').value=data.user.number;
        document.querySelector('#state').value=data.user.state;
        document.querySelector('#district').value=data.user.district;
    }
    else{
        alert('Failed to fetch details')
    }
});
document.querySelector('#but').addEventListener('click',(eve)=>{
    x=document.querySelector('#name').value;
    y=document.querySelector('#phno').value;
    p=document.querySelector('#state').value;
    q=document.querySelector('#district').value;  
    if(x===''){
        alert('Enter you name');
    }
    else if(y===''){
        alert('Enter your phno');
    }
    else if(p==='Select'){
        alert('Select your state');
    }
    else if(q===''){
        alert('Enter your district');
    }
    else{
        var url = '/eadddetails/'+x+'/'+y+'/'+p+'/'+q;
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