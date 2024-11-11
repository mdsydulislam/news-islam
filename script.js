const API_KEY = "3594252382fe4daba0d2bcc2d7a9944e";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("World"));

function reload() {
    window.location.reload();
}

function fetchNews(query = "") {
    fetch(`${url}${query}&apiKey=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => bindData(data.articles))
        .catch((error) => console.error("Error fetching news:", error));
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}


const searchText = document.getElementById("search-text");
const searchLogo = document.getElementById("search-logo");

// Show input when the search logo is clicked
searchLogo.addEventListener("click", () => {
    searchText.classList.toggle("hidden");
    searchText.focus(); // Focus on the input box
});

// Perform search on Enter key press
searchText.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        searchText.classList.add("hidden");
        searchText.value = ""; // Clear the input field after search
        curSelectedNav?.classList.remove("active");
        curSelectedNav = null;
    }
});