'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = modalAuth.querySelector('.close-auth');
const logInForm = modalAuth.querySelector('#logInForm');
const loginInput = modalAuth.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const restaurants = document.querySelector('.restaurants');
const cardsRestaurants = restaurants.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const menu = document.querySelector('.menu');
const cardsMenu = document.querySelector('.cards-menu');
const logo = document.querySelector('.logo');
let login = localStorage.getItem('user');



function toggleModal() {
	modal.classList.toggle("is-open");
}

function toggleModalAuth() { 
	modalAuth.classList.toggle('is-open');
	loginInput.style.borderColor = '';
	if (modalAuth.classList.contains('is-open')) {
		disableScroll();
	} else { 
		enableScroll();
	}
}

function validName(str) { 
	const regName = /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_\.]{1,20}$/;
	return regName.test(str);
}

function authorized() { 

	function logOut() { 
		login = null;
		localStorage.removeItem('user');
		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
	}

	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';
	buttonOut.addEventListener('click', logOut);
}

function notAuthorized() { 

	function logIn(evt) { 
		evt.preventDefault();
		if (validName(loginInput.value)) {
			login = loginInput.value;
			localStorage.setItem('user', login);
			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			logInForm.reset();
			checkAuth();
		} else { 
			loginInput.style.borderColor = '#ff0000';
			loginInput.value = '';
		}
	}

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
	modalAuth.addEventListener('click', function (evt) { 
		if (evt.target.classList.contains('is-open')) { 
			toggleModalAuth();
		}
	})

}

function checkAuth() { 
	if (login) {
		authorized();
	} else { 
		notAuthorized();
	};
}

function disableScroll() { 

	const widthScroll = window.innerWidth - document.body.offsetWidth;

	document.body.dbscrollY = window.scrollY;

	document.body.style.cssText = `
		position: fixed;
		top: ${-window.scrollY}px;
		left: 0;
		width: 100%;
		overflow: hidden;
		height: 100vh;
		padding-right: ${widthScroll}px;
	`;
}

function enableScroll() { 
	document.body.style.cssText = '';
	window.scroll({top: document.body.dbscrollY});
}

function createCardsRestaurants() { 
	const card = `
		<a class="card card-restaurant">
			<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">Пицца плюс</h3>
					<span class="card-tag tag">50 мин</span>
				</div>
				<div class="card-info">
					<div class="rating">
						4.5
					</div>
						<div class="price">От 900 ₽</div>
						<div class="category">Пицца</div>
				</div>
			</div>
		</a>
	`;

	cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood() { 
	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', `
			<img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">Пицца Везувий</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
									«Халапенье», соус «Тобаско», томаты.
					</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price-bold">545 ₽</strong>
				</div>
			</div>
	`);
	cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(evt) { 
	const target = evt.target;
	const restaurant = target.closest('.card-restaurant')
	
	if (restaurant && login) {
		cardsMenu.textContent = '';
		restaurants.classList.add('hide');
		containerPromo.classList.add('hide');
		menu.classList.remove('hide');
		createCardGood();
	} else if (restaurant) { 
		toggleModalAuth();
	}
}

function closeGoods() { 
	restaurants.classList.remove('hide');
	containerPromo.classList.remove('hide');
	menu.classList.add('hide');
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', closeGoods);

checkAuth();
createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();

//slider
new Swiper('.swiper-container', {
	sliderPerView: 1,
	loop: true,
	autoplay: true,
	grabCursor: true,
	effect: 'cube',
	cubeEffect: {
		shadow: false,
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	// effect: 'flip',
	// scrollbar: {
	// 	el: '.swiper-scrollbar',
	// 	draggable: true,
	// },
});
