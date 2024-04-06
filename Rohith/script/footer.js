document.querySelector('.sub').addEventListener('click',(eve)=>{
    x=document.querySelector('#email').value;
    if(x===''){
        alert('Enter your mail id to subscribe');   
    }
    else{
        var url='/subscribe/'+x;
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                alert('Thank you for subscribing for updates')
            }
            else{
                alert('Failed to subscribe please try again')
            }
        })
    }
})