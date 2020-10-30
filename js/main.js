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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
const RED_COLOR = '#ff0000';

let login = localStorage.getItem('user');

const cart = [];

const getData = async function (url) {
	const response = await fetch(url);

	if (!response.ok) { 
		throw new Error(`Ошибка по адресу ${url},
		статус ошибки ${response.status}!`);
	}

	return await response.json();
};

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
		cartButton.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
	}

	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'flex';
	cartButton.style.display = 'flex';
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
			loginInput.style.borderColor = RED_COLOR;
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

function createCardsRestaurant({ name, time_of_delivery: timeOfDelivery, stars, price, kitchen, image, products }) { 
	const cardRestaurant = document.createElement('a');
	cardRestaurant.className = 'card card-restaurant';
	cardRestaurant.products = products;
	cardRestaurant.info = { name, stars, price, kitchen };

	const card = `
			<img src=${image} alt=${name} class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery}</span>
				</div>
				<div class="card-info">
					<div class="rating">
						${stars}
					</div>
						<div class="price">От ${price} ₽</div>
						<div class="category">${kitchen}</div>
				</div>
			</div>
	`;

	cardRestaurant.insertAdjacentHTML('beforeend', card);
	cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function createCardGood({name, description, price, image, id}) { 
	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', `
			<img src=${image} alt=${name} class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<p class="ingredients">
					${description}
					</p>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart" id="${id}">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price card-price-bold">${price} ₽</strong>
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
		const { name, stars, price, kitchen} = restaurant.info;
		restaurantTitle.textContent = name;
		restaurantRating.textContent = stars;
		restaurantPrice.textContent = `От ${price} ₽`;
		restaurantCategory.textContent = kitchen;
		getData(`./db/${restaurant.products}`)
			.then((data) => data.forEach(createCardGood));
	} else if (restaurant) { 
		toggleModalAuth();
	}
}

function closeGoods() { 
	restaurants.classList.remove('hide');
	containerPromo.classList.remove('hide');
	menu.classList.add('hide');
}

function addToCart(evt) { 
	const target = evt.target;
	const buttonAddToCart = target.closest('.button-add-cart');
	if (buttonAddToCart) { 
		const card = target.closest('.card');
		const title = card.querySelector('.card-title').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddToCart.id;
		const food = cart.find((item) => item.id === id);

		if (food) {
			food.count += 1;
		} else { 
			cart.push({
				title,
				cost,
				id,
				count: 1,
			});
		}
	};
}

function renderCart() { 
	modalBody.textContent = '';
	cart.forEach(({id, title, cost, count}) => { 
		const itemCart = `
			<div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${cost}</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id=${id}>-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id=${id}>+</button>
				</div>
			</div>
		`;
		modalBody.insertAdjacentHTML('afterbegin', itemCart);
	});

	const totalPrice = cart.reduce(function (result, item) {
		return result + parseFloat(item.cost) * item.count;
	}, 0);
	modalPrice.textContent = totalPrice + ' ₽';
}

function changeCount(evt) { 
	const target = evt.target;

	if (target.classList.contains('counter-button')) { 
		const food = cart.find(function (item) {
			return item.id === target.dataset.id;
		})
		if (target.classList.contains('counter-minus')) {
			food.count--;
			if (food.count === 0) { 
				cart.splice(cart.indexOf(food), 1);
			}
		}
		if (target.classList.contains('counter-plus')) food.count++;
		renderCart();
	}
}

function init() { 
	getData('./db/partners.json')
		.then((data) => data.forEach(createCardsRestaurant));

	cartButton.addEventListener('click', () => {
		renderCart();
		toggleModal();
	});
	buttonClearCart.addEventListener('click', () => {
		cart.length = 0;
		renderCart();
	});
	modalBody.addEventListener('click', changeCount);
	cardsMenu.addEventListener('click', addToCart);
	close.addEventListener('click', toggleModal);
	cardsRestaurants.addEventListener('click', openGoods);
	logo.addEventListener('click', closeGoods);
	inputSearch.addEventListener('keypress', function (evt) { 
		if (evt.charCode === 13) { 
			const value = evt.target.value.trim().toLowerCase();

			if (!value) { 
				evt.target.value = '';
				evt.target.style.backgroundColor = RED_COLOR;
				setTimeout(() => evt.target.style.backgroundColor = '', 1000)
				return;
			}

			getData('./db/partners.json')
				.then((data) => data.map((partner) => partner.products))
				.then((linksProduct) => { 
					cardsMenu.textContent = '';
					linksProduct.forEach((link) => { 
						getData(`./db/${link}`)
							.then((data) => { 
								const resultSearch = data.filter((item) => {
									const name = item.name.toLowerCase();
									return name.includes(value);
								});
								restaurants.classList.add('hide');
								containerPromo.classList.add('hide');
								menu.classList.remove('hide');
								restaurantTitle.textContent = 'Рузультат поиска';
								restaurantRating.textContent = '';
								restaurantPrice.textContent = '';
								restaurantCategory.textContent = 'разная кухня';
								resultSearch.forEach(createCardGood);
							})
					})
				})
		};
	});

	checkAuth();

	new Swiper('.swiper-container', {
		sliderPerView: 1,
		loop: true,
		autoplay: true,
		grabCursor: true,
		effect: 'cube',
		cubeEffect: {
			shadow: false,
		},
	});
}

init();