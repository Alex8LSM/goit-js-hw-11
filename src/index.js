import './css/styles.css';
import imageCard from './templates/image-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  timeout: 5000,
  //   useIcon: false,
  fontSize: '20px',
  width: '400px',
});

const myGallery = document.querySelector('.gallery');
const inputForm = document.querySelector('#search-form');

inputForm.addEventListener('submit', search);

function search(evt) {
  evt.preventDefault();
  if (inputForm.searchQuery.value == "") {
   Notiflix.Notify.warning('The search field must not be empty');
    return;
  } 
  else {
    const searchParams = new URLSearchParams({
      key: `25143671-fc0bcb21b6131bd14acaabd04`,
      q: inputForm.searchQuery.value,
      image_type: `photo`,
      orientation: `horizontal`,
      safesearch: `true`,
    });
    const searchURL = `https://pixabay.com/api/?${searchParams}`;
    console.log(searchURL);
    fetchImages(searchURL);
  }
}

function fetchImages(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(fetchGallery => {
      if (fetchGallery.total == 0) {
        myGallery.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        const markup = imageCard(fetchGallery.hits);
        myGallery.innerHTML = markup;

        const lightbox = new SimpleLightbox('.gallery a', {
          // captionsData: 'alt',
          // captionDelay: 250,
        });
        console.log(fetchGallery);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(`Oops, there is an error: ${error}`);
    });
}