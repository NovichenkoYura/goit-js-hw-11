
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";




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

let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onFormSubmitSearchPhotos);
loadMoreBtn.addEventListener('click', onLoadMore)

async function onFormSubmitSearchPhotos(e) {
 
  e.preventDefault()
  hideLoadMoreBtn()
  isAllData = false;
  currentPage = 1;
  resultLength = 0;
  galleryList.innerHTML = '';
  const keyWord = e.target[0].value;
  const photos = await getPhotos(keyWord);
  renderPhotos(photos);
  if (resultLength < totalHits) {  
  showLoadMoreBtn();
  }

  
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
  gallery.refresh();
}

async function getPhotos(word) {

  try {
    if (isAllData) {
      enoughSearchPhotos()
      hideLoadMoreBtn()
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

    console.log('rendered: ' + resultLength + ' whole collection: ' + totalHits)


    if (totalHits < 1) {
      errorSearchPhotos()
      return []; 
    }

    else if (resultLength >= totalHits) {
      isAllData = true;
      enoughSearchPhotos()

    }

    else if (currentPage === 1) {
      foundNumberTotalHits()
    }
    
    return result.data.hits;
    

  } catch (error) {
    console.log(error);
  }

}

async function onLoadMore() {
  try {    
    if (resultLength < totalHits) {
    hideLoadMoreBtn();
    const keyWord = input.value;
    const imageAdd = await getPhotos(keyWord);
    showLoadMoreBtn();
    renderPhotos(imageAdd);
    }

    if (resultLength >= totalHits) {
      isAllData = true;
      hideLoadMoreBtn();
      return;
    }
   

  }
  catch (error) {
    console.log(error);
  }
}


function errorSearchPhotos() {
  
  hideLoadMoreBtn()
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  
}

function enoughSearchPhotos() {
  hideLoadMoreBtn()
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

function foundNumberTotalHits() {  
  Notiflix.Notify.info(`Hooray! We found ${totalHits} totalHits images.`);
}

function hideLoadMoreBtn() {
   loadMoreBtn.style.display = 'none'
}

function showLoadMoreBtn() {
   loadMoreBtn.style.display = 'block'
}

