let currentUser = null;
let currentCharacter = null;

// Search
const searchForm = document.querySelector('#searchForm');
const searcherDiv = document.querySelector('#searcherDiv');
const logoutButton = document.querySelector('#logoutButton');
const searchInput = document.querySelector('#searchInput');
const errorSearch = document.querySelector('#errorSearch');
const image = document.querySelector('#image');
// Table fields
const idField = document.querySelector('#idField');
const nameField = document.querySelector('#nameField');
const statusField = document.querySelector('#statusField');
const speciesField = document.querySelector('#speciesField');
const typeField = document.querySelector('#typeField');
const genderField = document.querySelector('#genderField');
// End table fields
// End search

// Login
const loginForm = document.querySelector('#loginForm');
const loginDiv = document.querySelector('#loginDiv');
const emailInput = document.querySelector('#email');
const errorEmail = document.querySelector('#errorEmail');
const passwordInput = document.querySelector('#password');
const errorPassword = document.querySelector('#errorPassword');
// End login

async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');

  return response.json();
}

async function getCharacter(id) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`
  );

  if (response.status === 404) return false;

  return response.json();
}

function toggleImage() {
  if (currentCharacter === null) return;

  if (image.getAttribute('src') === '') {
    image.setAttribute('src', currentCharacter.image);
    return;
  }

  image.setAttribute('src', '');
}

async function search(e) {
  e.preventDefault();

  if (!validateSearch()) return;

  let id = searchInput.value;

  const character = await getCharacter(id);

  if (!character) {
    errorSearch.innerText = "Doesn't exist a character with that ID";
    errorSearch.style.display = 'inline';
    return;
  }

  currentCharacter = character;

  idField.innerHTML = character.id;
  nameField.innerHTML = character.name;
  statusField.innerHTML = character.status;
  speciesField.innerHTML = character.species;
  typeField.innerHTML = character.type;
  genderField.innerHTML = character.gender;

  image.setAttribute('src', '');
}

function toggleDivVisibility() {
  if (loginDiv.offsetParent === null) {
    searcherDiv.style.display = 'none';
    loginDiv.style.display = 'block';
  } else {
    loginDiv.style.display = 'none';
    searcherDiv.style.display = 'block';
    searcherDiv.querySelector('h3').innerText = `Welcome ${currentUser.name}!`;
  }
}

async function login(e) {
  e.preventDefault();

  let isValidCount = 0;

  isValidCount += validateEmail() ? 0 : 1;
  isValidCount += validatePassword() ? 0 : 1;

  if (isValidCount != 0) return;

  const users = await getUsers();

  const user = users.filter((user) => user.email === emailInput.value)[0];

  if (user === undefined) {
    errorPassword.innerText = 'The credentials are invalid';
    errorPassword.style.display = 'inline';
    return;
  }

  if (user.id != passwordInput.value) {
    errorPassword.innerText = 'The credentials are invalid';
    errorPassword.style.display = 'inline';
    return;
  }

  currentUser = user;

  toggleDivVisibility();
}

function validateEmail() {
  const emailValue = emailInput.value;

  if (emailValue.length < 4) {
    console.log('hola');
    errorEmail.innerText = 'The email field must have more than 3 characters';
    errorEmail.style.display = 'inline';
    return false;
  }

  if (!emailValue.includes('@')) {
    errorEmail.innerText = 'The email field must contain a valid email';
    errorEmail.style.display = 'inline';
    return false;
  }

  errorEmail.style.display = 'none';

  return true;
}

function validatePassword() {
  const passwordValue = passwordInput.value;
  const regex = /^\d{1,2}$/;

  if (!regex.test(passwordValue)) {
    errorPassword.innerText = 'The password is not valid';
    errorPassword.style.display = 'inline';
    return false;
  }

  errorPassword.style.display = 'none';

  return true;
}

function validateSearch() {
  let id = searchInput.value;

  if (id != parseInt(id)) {
    errorSearch.innerText = 'The search term must be a integer';
    errorSearch.style.display = 'inline';
    return false;
  }

  errorSearch.style.display = 'none';

  return true;
}

emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);
loginForm.addEventListener('submit', login);

searchInput.addEventListener('input', validateSearch);
searchForm.addEventListener('submit', search);
logoutButton.addEventListener('click', toggleDivVisibility);
nameField.addEventListener('click', toggleImage);
