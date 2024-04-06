function accept(a) {
    var d = document.querySelectorAll(".email")[a].innerHTML;
    alert(d);
    fetch('/accept/' + d)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("successfully updated");
                window.location.href = 'accept.html';
            }
            else {
                alert("Please try again");
            }
        })
        .catch(err => {
            alert("failed to update the data")
        });
}
fetch('/rreject')
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            var users = data.user;
            console.log(users[0]);
            for (var i = 0; i < users.length; i++) {
                var container = document.createElement('div');
                container.className = "container";
                var box = document.createElement('div');
                box.className = "box";
                var box2 = document.createElement('div');
                box2.className = "box2";
                var content = `
              <div class="b1">
                  <p><strong>Company Name:</strong></p>
                  <p>${users[i].name}</p>
              </div>
              <div class="b1">
                  <p><strong>Company Phone Number:</strong></p>
                  <p>${users[i].number}</p>
              </div>
              <div class="b1">
                  <p><strong>Company Email:</strong></p>
                  <p class="email">${users[i].email}</p>
              </div>
              <div class="b1">
                  <p><strong>Address:</strong></p>
                  <p>${users[i].address}</p>
              </div>
              <div class="b1">
                  <p><strong>State:</strong></p>
                  <p>${users[i].state}</p>
              </div>
              <div class="b1">
                  <p><strong>District:</strong></p>
                  <p>${users[i].district}</p>
              </div>
            `;
                box.innerHTML = content;
                var previewButton = document.createElement('button');
                var previewLink = document.createElement('a');
                previewLink.href =  '/uploads/'+users[i].fileName;
                previewLink.target = "_blank";
                previewLink.innerText = "Preview";
                previewButton.appendChild(previewLink);
                var acceptButton = document.createElement('button');
                acceptButton.innerText = "Accept";
                acceptButton.id = "accept" + i;
                var box3 = document.createElement('div');
                box3.className = "b2";
                var box4 = document.createElement('div');
                box4.className = "b2";
                var box5 = document.createElement('div');
                box5.className = "b2";
                box3.appendChild(previewButton);
                box4.appendChild(acceptButton);
                box2.appendChild(box3);
                box2.appendChild(box4);
                box2.appendChild(box5);
                container.appendChild(box);
                container.appendChild(box2);
                document.querySelector('.head').appendChild(container);       
                acceptButton.addEventListener('click', function (event) {
                    var currentIndex = Number(event.currentTarget.id.slice(-1));
                    accept(currentIndex);
                });
            }
        }
         else {
            alert('Failed to fetch data');
        }
    })
    .catch(err => {
        alert("Failed to fetch data");
    });