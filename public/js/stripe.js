/* eslint-disable */
import axios from 'axios';
import {showAlert} from './alerts';

export const bookTour = async tourId => {
  const stripe = Stripe('pk_test_51MxQI7D1gVud0HLDxeYWbgRYT6zvhyqLgLZmnKREiSWAADS0nk0HwzOkTz7tJp3vddEp54xdEXKBzvJr4wdH0JsO00LjTpV9yv');

  try {
    const session = await axios(`http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`)
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    })

  }catch (err) {
    console.log(err)
    showAlert('error', err.message)
  }
}
