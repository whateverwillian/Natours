import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { bookTour } from './stripe'

// import { updateSettings } from './updateSettings'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form')
const logOutBtn = document.querySelector('.nav__el--logout')
const bookBtn = document.getElementById('book-tour')

// const userDataForm = document.querySelector('.form-user-data') // Num vou fazer
// const userPasswordForm = document.querySelector('.form-user-password') // Num vou fazer

// DELEGATIONS
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault()

        // VALUES
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        login(email, password)
    })
}

if (logOutBtn) logOutBtn.addEventListener('click', logout)

if (bookBtn) {
    bookBtn.addEventListener('click', async e => {
        e.target.textContent = 'Processing...'
        const {tourId} = e.target.dataset
        await bookTour(tourId)
        e.target.textContent = 'book tour now!'
    })
}