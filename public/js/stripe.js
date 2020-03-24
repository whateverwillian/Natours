import axios from 'axios'
import { showAlert } from "./alert";

const stripe = Stripe('pk_test_ChAJpBbO4MbRiyexrCoK1rsl00H8YSIH3d')

export const bookTour = async tourId => {
    try {
        // 1) Get the session from the server
        const session = await axios(
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`)

        // 2) Create checkout form + charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        showAlert('error', err)
    }
}