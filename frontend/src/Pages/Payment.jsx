import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../axios.service/authService';
import { useNavigate, useLocation } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, amount, shippingAddress, timeSlot, location }) => {
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
                return_url: `${window.location.origin}/order-success`,
            },
            redirect: 'if_required' 
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                await api.post('/orders/create', {
                    shippingAddress: shippingAddress || "Manual verification required",
                    paymentMethod: "Stripe",
                    totalAmount: amount,
                    timeSlot: timeSlot,
                    location: location,
                    paymentIntentId: paymentIntent.id
                });
                navigate('/');
            } catch (err) {
                console.error("Order creation failed", err);
                setMessage("Payment succeeded but order creation failed. Please contact support.");
            }
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-slideUp">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <PaymentElement />
            </div>
            {message && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {message}
                </div>
            )}
            <button 
                disabled={isLoading || !stripe || !elements} 
                className="w-full btn-primary group flex items-center justify-center gap-3 py-4 text-lg"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>Pay ₹{amount.toLocaleString()}</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </>
                )}
            </button>
        </form>
    );
};

const Payment = () => {
    const navigate = useNavigate();
    const locationState = useLocation();
    const { shippingAddress, timeSlot, coordinates } = locationState.state || {};
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState(0);
    const [isFetching, setIsFetching] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        api.post('/payment/create-payment-intent', {})
            .then((res) => {
                setClientSecret(res.data.data.clientSecret);
                setAmount(res.data.data.amount);
            })
            .catch((err) => {
                console.error("Error creating payment intent", err);
                setErrorMsg(err.response?.data?.message || "There was a problem starting your payment intent.");
            })
            .finally(() => setIsFetching(false));
    }, []);

    const options = {
        clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#8b5cf6',
                colorBackground: '#1e293b',
                colorText: '#f8fafc',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                borderRadius: '12px',
            },
        },
    };

    return (
        <div className="min-h-screen bg-slate-900 section-padding flex items-center justify-center">
            <div className="container-custom max-w-2xl w-full">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-4xl font-extrabold gradient-text mb-3">Complete Your Purchase</h1>
                    <p className="text-slate-400">Secure checkout powered by Stripe</p>
                </div>

                <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    
                    {isFetching ? (
                        <div className="flex flex-col items-center py-20 animate-pulse">
                            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
                            <p className="text-slate-400">Initializing secure payment...</p>
                        </div>
                    ) : clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm 
                                clientSecret={clientSecret} 
                                amount={amount} 
                                shippingAddress={shippingAddress}
                                timeSlot={timeSlot}
                                location={coordinates}
                            />
                        </Elements>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-white mb-2">Unable to load checkout</h3>
                            <p className="text-slate-400 mb-6">{errorMsg}</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
                                <button onClick={() => navigate('/products')} className="btn-secondary">Back to Shop</button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-6 grayscale opacity-50 contrast-125">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                    <div className="h-4 w-px bg-slate-700" />
                    <p className="text-xs text-slate-500 tracking-widest uppercase font-bold">Encrypted & Secure</p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
