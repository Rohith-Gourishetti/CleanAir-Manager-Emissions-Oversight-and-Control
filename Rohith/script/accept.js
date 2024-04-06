function accept(a) {
    var d = document.querySelectorAll(".email")[a].innerHTML;
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
function reject(a) {
    var d = document.querySelector(".vis");
    d.style.display = "flex";
    var e = document.querySelector("#send");
    var d = document.querySelectorAll(".email")[a];
    console.log(d);
    e.value = d.innerHTML;
}
document.querySelector('#cls').addEventListener('click', function (eve) {
    document.querySelector('.vis').style.display = 'none';
});
document.querySelector('#send').addEventListener('click', function (eve) {
    sendmail();
});
function sendmail() {
    var a = document.querySelector("#message").value;
    var e = document.querySelector("#send").value;
    if (a === '') {
        alert("Enter the message");
    }
    else {
        fetch('/reject/' + e + '/' + a)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Email sent successfully");
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
}
fetch('/fetchall')
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            var users = data.user;
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

        `;
                box.innerHTML = content;
                var previewButton = document.createElement('button');
                var previewLink = document.createElement('a');
                previewLink.href = '/uploads/' + users[i].fileName;
                previewLink.target = "_blank";
                previewLink.innerText = "Preview";
                previewButton.appendChild(previewLink);
                var acceptButton = document.createElement('button');
                acceptButton.innerText = "Accept";
                acceptButton.id = "accept" + i;
                var rejectButton = document.createElement('button');
                rejectButton.innerText = "Reject";
                rejectButton.id = "reject" + i;
                var box3 = document.createElement('div');
                box3.className = "b2";
                var box4 = document.createElement('div');
                box4.className = "b2";
                var box5 = document.createElement('div');
                box5.className = "b2";
                box3.appendChild(previewButton);
                box4.appendChild(acceptButton);
                box5.appendChild(rejectButton);
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
                rejectButton.addEventListener('click', function (event) {
                    var currentIndex = Number(event.currentTarget.id.slice(-1));
                    reject(currentIndex);
                });
            }
        } else {
            alert('Failed to fetch data');
        }
    })
    .catch(err => {
        alert("Failed to fetch data1");
    });