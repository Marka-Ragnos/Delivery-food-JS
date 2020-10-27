const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// Day 1
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = modalAuth.querySelector('.close-auth');
const logInForm = modalAuth.querySelector('#logInForm');
const loginInput = modalAuth.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('user');

function toggleModalAuth() { 
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else { 
    enableScroll();
  }
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
    if (!loginInput.value.trim()) {
      loginInput.style.borderColor = '#ff0000';
      loginInput.value = '';
      return;
    } else { 
      login = loginInput.value;
      localStorage.setItem('user', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
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

checkAuth();
