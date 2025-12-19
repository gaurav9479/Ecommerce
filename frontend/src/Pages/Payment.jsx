import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Use a placeholder public key or process.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL mainly for redirects, but here we handle handle inline mostly or redirect
                return_url: `${window.location.origin}/order-success`,
            },
            redirect: 'if_required' 
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment success - Create Order
            try {
                // Assuming address is collected here or handled. For simplified flow, hardcoding default address or just creating order.
                // ideally, we should have shipping address form here too.
                await axios.post('/api/v1/orders/create', {
                    shippingAddress: "123 Main St, Default City", // Simplified
                    paymentMethod: "Stripe",
                    totalAmount: amount
                }, { withCredentials: true });

                alert("Payment Successful! Order Created.");
                navigate('/');
            } catch (err) {
                console.error("Order creation failed", err);
                setMessage("Payment succeeded but order creation failed. Contact support.");
            }
            setIsLoading(false);
        } else {
             setMessage("Unexpected state.");
             setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Pay with Card</h2>
            <PaymentElement />
            {message && <div className="text-red-500 mt-2">{message}</div>}
            <button 
                disabled={isLoading || !stripe || !elements} 
                id="submit"
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
                {isLoading ? "Processing..." : `Pay $${amount}`}
            </button>
        </form>
    );
};

const Payment = () => {
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        axios.post("/api/v1/payment/create-payment-intent", {}, { withCredentials: true })
            .then((res) => {
                setClientSecret(res.data.data.clientSecret);
                setAmount(res.data.data.amount);
            })
            .catch((err) => console.error("Error creating payment intent", err));
    }, []);

    const options = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} amount={amount} />
                </Elements>
            ) : (
                <div>Loading Payment Details...</div>
            )}
        </div>
    );
};

export default Payment;
