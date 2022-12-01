/* eslint-disable */
import '@babel/polyfill';
import {login, logout} from './login';
import {displayMap} from './mapbox'
import {updateSettings} from './updateSettings'



const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.getElementById('logoutBtn')
const updateDataBtn = document.querySelector('.form-user-data')
const updatePasswordBtn = document.querySelector('.form-user-settings')
//VALUES

if(mapBox){
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations)
}

if(loginForm){
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if(updateDataBtn){
  updateDataBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({name, email}, 'data');
  })
}

if(updatePasswordBtn){
  updatePasswordBtn.addEventListener('submit', async (e) => {
    e.preventDefault()
    document.querySelector('.btn--save--password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

    document.querySelector('.btn--save--password').textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  })
}

if(logOutBtn){
  logOutBtn.addEventListener('click', logout);
}




