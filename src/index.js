import './css/styles.css';
import imageCard from './templates/image-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  timeout: 5000,
  fontSize: '20px',
  width: '400px',
});

const myGallery = document.querySelector('.gallery');
const inputForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const axios = require('axios');
let searchData = '';
let hitsCount = 0;
let maxHits = 0;
const lightbox = new SimpleLightbox('.gallery a', {});
const searchURL = `https://pixabay.com/api/`;
const searchParams = {
  params: {
    key: `25143671-fc0bcb21b6131bd14acaabd04`,
    q: '',
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    per_page: 40,
    page: 1,
  },
};

inputForm.addEventListener('submit', search);
loadMoreBtn.addEventListener('click', searchMore);

function searchMore() {
  searchParams.params.page+=1;
  hitsCount += searchParams.params.per_page;
  if (hitsCount > maxHits) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
    loadMoreBtn.classList.add('hidden');
  } else {
    fetchImages(searchURL, searchParams);
  }
}

function search(evt) {
  evt.preventDefault();
  if (inputForm.searchQuery.value == '') {
    Notiflix.Notify.warning('The search field must not be empty');
    return;
  } else {
    searchData = inputForm.searchQuery.value;
    searchParams.params.q = searchData;
    searchParams.params.page = 1;
    fetchImages(searchURL, searchParams);
    hitsCount = searchParams.params.per_page;
  }
}
async function fetchImages(url, param) {
  try {
    const response = await axios.get(url, param);
    const fetchGallery = await response.data;
    if (fetchGallery.total == 0) {
      if (!loadMoreBtn.classList.contains('hidden')) loadMoreBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      myGallery.innerHTML = '';
    } else {
      if (searchParams.params.page == 1) {
        maxHits = fetchGallery.totalHits;
        loadMoreBtn.classList.remove('hidden');
        Notiflix.Notify.success(`Hooray! We found ${maxHits} images.`);
        myGallery.innerHTML = '';
      }
      
      const markup = imageCard(fetchGallery.hits);
      myGallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();

      
    }
  } catch (error) {
    Notiflix.Notify.failure(`Oops, there is an error: ${error.message}`);
  }
}
