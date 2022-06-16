
import axios from "axios";
import Notiflix from 'notiflix';



const API_KEY = '28025746-c4df93d18fee554bb72ff63c8';
const BASE_URL = 'https://pixabay.com/api/';
let resultLength;
let totalHits;
let currentPage = 0;



const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onFormSubmitSearchPhotos);
loadMoreBtn.addEventListener('click', onLoadMore)

async function onFormSubmitSearchPhotos(e) {
  e.preventDefault()
  const keyWord = e.target[0].value;
  const photos = await getPhotos(keyWord);
  renderPhotos(photos);
}


function renderPhotos(photos) {
  const markup = photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
    <div class="photo-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" max-width="300px"/>
  </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
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
    const result = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: word,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40,
      }
    });

    currentPage += 1;
    resultLength += result.data.hits.length;
    totalHits = result.data.totalHits;
    
    
    if (totalHits < 1) {
      // loadMoreBtn.classList.add('ishidden')
      return errorSearchPhotos()
    }

    return result.data.hits;    
 
  } catch (error) {
    console.log(error);
   } 
  
}


async function onLoadMore() {
  try {
    // currentPage += 1;
    const keyWord = input.value;
    const imageAdd = await getPhotos(keyWord);   
    renderPhotos(imageAdd);
    
    resultLength += result.data.hits.length;
    totalHits = result.data.totalHits;
    if (resultLength >= totalHits) {
      return enoughSearchPhotos()
    }
  }
  catch (error){
    console.log(error);

  }
}

function errorSearchPhotos() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function enoughSearchPhotos() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}
