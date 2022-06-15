
import axios from "axios";
import Notiflix from 'notiflix';



const API_KEY = '28025746-c4df93d18fee554bb72ff63c8';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('.search-form');

searchForm.addEventListener('submit', getPhotos)


function getPhotos(e) {
     return axios.get(`${BASE_URL}`, {
    params: {
             key: API_KEY,
            q: e.target.value,
             image_type: photo,
             orientation: horizontal,
             safesearch: true,        
    }
  })    
}
