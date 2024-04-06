fetch('/ufetch')
.then(res=>res.json())
.then(data=>{
    if(data.success){
        document.querySelector('#email').value=data.user.email;
        document.querySelector('#name').value=data.user.name;
        document.querySelector('#add').value=data.user.address;
        document.querySelector('#phno').value=data.user.phno;
    }
    else{
        alert('Failed to fetch details')
    }
});
document.querySelector('#but').addEventListener('click',(eve)=>{
    x=document.querySelector('#name').value;
    y=document.querySelector('#phno').value;
    a=document.querySelector('#add').value;
    if(x===''){
        alert('Enter you name');
    }
    else if(y===''){
        alert('Enter your phno');
    }
    else if(a===''){
        alert('Enter your address');
    }
    else{
        var url = '/uadddetails/'+x+'/'+y+'/'+a;
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                alert('data updated successfully');
                window.location.href='uprofile.html';
            }
            else{
                alert('Failed to update the data');
            }
        });
    }
});