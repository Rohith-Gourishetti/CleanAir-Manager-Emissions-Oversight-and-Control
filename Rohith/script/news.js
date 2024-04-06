fetch('https://api.worldnewsapi.com/search-news?api-key=bc5d43e774f7478084d9fd40eebc43b0&text=airpollution')
  .then(res => res.json())
  .then(data => {
    const news = data.news;
    const container = document.querySelector('.container');

    for (let i = 0; i < news.length; i++) {
      const article = news[i];

      // Create elements
      const box = document.createElement('div');
      box.className = 'box';
      
      const imgDiv = document.createElement('div');
      imgDiv.className = 'img';
      
      const img = document.createElement('img');
      img.src = article.image;
      img.alt = article.title;

      const titleDiv = document.createElement('div');
      titleDiv.className = 'img';
      
      const title = document.createElement('p');
      title.className = 'title';
      title.textContent = article.title;

      const buttonDiv = document.createElement('div');
      buttonDiv.className = 'img2';
      
      const button = document.createElement('button');
      
      const link = document.createElement('a');
      link.href = article.url;
      link.textContent = 'Read more';

      // Append elements
      imgDiv.appendChild(img);
      box.appendChild(imgDiv);
      
      titleDiv.appendChild(title);
      box.appendChild(titleDiv);
      
      button.appendChild(link);
      buttonDiv.appendChild(button);
      box.appendChild(buttonDiv);

      // Append box to container
      container.appendChild(box);
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
