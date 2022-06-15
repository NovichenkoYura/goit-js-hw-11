
import axios from "axios";
import Notiflix from 'notiflix';



const API_KEY = '28025746-c4df93d18fee554bb72ff63c8';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery')

searchForm.addEventListener('submit', onFormSubmitSearchPhotos)

function onFormSubmitSearchPhotos() {
  getPhotos;
  renderPhotos;    
}


async function getPhotos(e) {
  e.preventDefault()
    const result = await axios.get(`${BASE_URL}`, {
    params: {
             key: API_KEY,
            q: e.target[0].value,
             image_type: "photo",
             orientation: "horizontal",
             safesearch: true,        
      }
     })
  return result
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
  galleryList.insertAdjacentHTML('beforeend', renderPhotos);
}