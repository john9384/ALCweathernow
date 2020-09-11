fetch(
  "https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&media=True",
  {
    method: "GET",
    headers: {
      "x-rapidapi-host": "newscatcher.p.rapidapi.com",
      "x-rapidapi-key": "6a50c75a36msh94eb9c76ff5e30bp1448ecjsn1159c3eb53db"
    }
  }
)
  .then(response => {
    return response.json();
  })
  .then(data => {
    const data_top = data.articles[0];
    const data_1 = data.articles[1];
    const data_2 = data.articles[2];
    const obj_top = {
      headline: data_top.author,
      sum: data_top.summary,
      url: data_top.link
    };
    const obj1 = {
      headline: data_1.author,
      sum: data_1.summary,
      url: data_1.link
    };
    const obj2 = {
      headline: data_2.author,
      sum: data_2.summary,
      url: data_2.link
    };
    top_article(obj_top);
    article_card(obj1, obj2);

    // Populating the news page
    const article_array = data.articles;
    const news_page = document.querySelector(".content-news");
    const loading_div = document.getElementById("loading_temp");
    if (loading_div) {
      loading_div.remove();
    }

    article_array.forEach(article => {
      const article_obj = {
        headline: article.author,
        sum: article.summary,
        url: article.link
      };
      const card = create_article(article_obj);
      news_page.appendChild(card);
    });
  })
  .catch(err => {
    console.log(err);
  });
function article_card(obj1, obj2) {
  const sidebar = document.querySelector(".sidebar");
  sidebar.innerHTML = `
  <div class="article-card">
    <h3 class="article-card__head">${obj1.headline}</h3>
    <p class="article-card__sum">
          ${obj1.sum}
    </p>
    <button class="article-card__action">
            <a href="${obj1.url}" class="article-card__link">Read Full Article</a>
    </button>
  </div>
  <div class="article-card">
    <h3 class="article-card__head">${obj2.headline}</h3>
    <p class="article-card__sum">
          ${obj2.sum}
    </p>
    <button class="article-card__action">
            <a href="${obj2.url}" class="article-card__link">Read Full Article</a>
    </button>
  </div>`;
}

function top_article(obj) {
  const article = document.querySelector(".articles");
  if (article) {
    article.innerHTML = `
    <h2 class="articles__head">${obj.headline}</h2>
    <p class="articles__sum">${obj.sum}</p>
    <a href="${obj.url}" class="articles__link"><button class="articles__button">Read Full article </button></a>       
  `;
  }
}
function create_article(obj) {
  const article = document.createElement("div");
  article.classList.add("articles");
  article.innerHTML = `
    <h2 class="articles__head">${obj.headline}</h2>
    <p class="articles__sum">${obj.sum}</p>
    <a href="${obj.url}" class="articles__link"><button class="articles__button">Read Full article</button></a>       
  `;
  return article;
}
