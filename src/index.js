
import axios from "axios";
import Notiflix from 'notiflix';



const API_KEY = '28025746-c4df93d18fee554bb72ff63c8';
const BASE_URL = 'https://pixabay.com/api/';
let resultLength = 0;
let totalHits = 0;
let currentPage = 1;
let isAllData = false;



const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onFormSubmitSearchPhotos);
loadMoreBtn.addEventListener('click', onLoadMore)

async function onFormSubmitSearchPhotos(e) {
  e.preventDefault()
  isAllData = false;
  currentPage = 1;
  galleryList.innerHTML = '';
  const keyWord = e.target[0].value;
  const photos = await getPhotos(keyWord);
  renderPhotos(photos);

}


function renderPhotos(photos) {
  const markup = photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
    <div class="card">
  <a href="${largeImageURL}">
    <img class="image-card" src="${webformatURL}" alt="${tags}" loading="lazy" max-width="300px"/>
  </a>
  
  <div class="about">
    <p class="about-item">
      <b>Likes</b>${likes}
    </p>
    <p class="about-item">
      <b>Views</b>${views}
    </p>
    <p class="about-item">
      <b>Comments</b>${comments}
    </p>
    <p class="about-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`
  })
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.style.display = 'block';
}

async function getPhotos(word) {

  try {
    if (isAllData) {
      enoughSearchPhotos()
      return[]
    }
    const result = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: word,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40,
        page: `${currentPage}`,

      }
    });

    currentPage += 1;
    resultLength += result.data.hits.length;
    totalHits = result.data.totalHits;

console.log(resultLength + ' ' + totalHits)
    if (totalHits < 1) {
      errorSearchPhotos()
      return []; 
    }

    else if (resultLength >= totalHits) {
      isAllData = true;
      
    }

    return result.data.hits;

  } catch (error) {
    console.log(error);
  }

}


async function onLoadMore() {
  try {
    hideLoadMoreBtn();
    const keyWord = input.value;
    const imageAdd = await getPhotos(keyWord);
    showLoadMoreBtn();
    renderPhotos(imageAdd);

  }
  catch (error) {
    console.log(error);

  }
}

function errorSearchPhotos() {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function enoughSearchPhotos() {
  loadMoreBtn.style.display = 'none';
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

function hideLoadMoreBtn() {
   loadMoreBtn.style.display = 'none'
}

function showLoadMoreBtn() {
   loadMoreBtn.style.display = 'block'
}