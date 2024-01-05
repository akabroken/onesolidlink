//$(document).ready(function () {
// Initialize the card slide indexes
var cardSlideIndexes = [];
let slideIndex = 0;
showSlides();
loadGoogleMap();

//document.getElementById("overlay").style.display = "block";

// Define the image sliders and their respective card IDs
var imageSliders = [
    { slider: $(".image-slider"), interval: 2000 },
    { slider: $(".image-sliderr"), interval: 2000 },
    { slider: $(".image-sliderrr"), interval: 2000 },
    // Add more sliders here as needed
];

// Initialize the sliders
imageSliders.forEach(function (slider, index) {
    cardSlideIndexes[index] = 0;
    showCardSlides(index);
});

function showCardSlides(sliderIndex) {
    var slides = imageSliders[sliderIndex].slider.find("img");

    slides.hide();
    cardSlideIndexes[sliderIndex]++;

    if (cardSlideIndexes[sliderIndex] > slides.length) {
        cardSlideIndexes[sliderIndex] = 1;
    }

    slides.eq(cardSlideIndexes[sliderIndex] - 1).show();

    setTimeout(function () {
        showCardSlides(sliderIndex);
    }, imageSliders[sliderIndex].interval);
}

function showSlides() {

    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    let texts = document.querySelectorAll('.text');

    // Hide all slides and reset opacity for all texts
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        texts[i].style.display = 'none';
        texts[i].style.opacity = 1; // Reset the opacity
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1; // Reset slideIndex if it exceeds the number of slides
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace("active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    texts[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += " active";

    setTimeout(() => {
        texts[slideIndex - 1].style.opacity = 0; // Fade out the text
        setTimeout(() => {
            showSlides();
        }, 1000); // Delay before showing the next slide
    }, 7000); // Time the text is displayed before fading

}
//});

// JavaScript for handling dropdowns
document.addEventListener("DOMContentLoaded", function () {
    var dropdowns = document.querySelectorAll(".dropdown");

    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener("mouseenter", function () {
            this.querySelector(".dropdown-content").style.display = "block";
        });

        dropdowns[i].addEventListener("mouseleave", function () {
            this.querySelector(".dropdown-content").style.display = "none";
        });
    }
});

const selectRepeating = document.getElementById('repeating');
const inputEventDays = document.getElementById('eventdays');

selectRepeating.addEventListener('change', function () {
    if (selectRepeating.value === 'yes') {
        inputEventDays.style.display = 'block';
        inputEventDays.setAttribute('required', 'true');
    } else {
        inputEventDays.style.display = 'none';
        inputEventDays.removeAttribute('required');
    }
});

/* Google map
        ------------------------------------------------*/
var map = '';
var center;

function initialize() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(37.769725, -122.462154),
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

    google.maps.event.addDomListener(map, 'idle', function () {
        calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(center);
    });
}

function calculateCenter() {
    center = map.getCenter();
}

function loadGoogleMap() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' + 'callback=initialize';
    document.body.appendChild(script);
}

const gallery = document.querySelector('.gallery');
const modal = document.querySelector('.modal');
const modalImage = document.getElementById('modal-image');
const closeBtn = document.querySelector('.close');

gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        modal.style.display = 'block';
        modalImage.src = e.target.src;
    }
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".containerr");
    const textContainer = document.querySelector(".text-containerr");

    // Wait for 2 seconds and then reveal the text
    setTimeout(function () {
        textContainer.style.opacity = 1;
    }, 2000);

    // Detect scroll and reveal image
    window.addEventListener("scroll", function () {
        if (isElementInViewport(container) && container.querySelector("img").style.opacity === "0") {
            container.querySelector("img").style.opacity = 1;
        }
    });

    // Helper function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});


// window.addEventListener("scroll", function () {
//     const imageContainer = document.querySelector(".image-container-min");
//     const img = document.querySelector("img");
//     const textContainer = document.querySelector(".text-container-min");
//     const text = document.querySelector("p");

//     const imageTop = imageContainer.getBoundingClientRect().top;
//     const textTop = textContainer.getBoundingClientRect().top;

//     if (imageTop < window.innerHeight) {
//         img.style.opacity = 1;
//     }

//     if (textTop < window.innerHeight) {
//         text.style.opacity = 1;
//     }
// });

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Add a class to the container after 2 seconds to reveal the text
    setTimeout(function () {
        document.querySelector(".containerr").classList.add("show-text");
    }, 2000);
});
