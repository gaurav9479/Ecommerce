import React from 'react';
import { useParams } from 'react-router-dom';

const steps = [
    { label: 'Order Placed', icon: '📋', desc: 'Your order has been received and is being processed.' },
    { label: 'Processing', icon: '⚙️', desc: 'We are preparing your items for shipment.' },
    { label: 'Shipped', icon: '🚚', desc: 'Your order is on its way to you!' },
    { label: 'Out for Delivery', icon: '🏍️', desc: 'Your order is out for delivery in your area.' },
    { label: 'Delivered', icon: '✅', desc: 'Your order has been successfully delivered.' },
];

const OrderTracking = () => {
    const { orderId } = useParams();

    // Simulate a step based on orderId hash (in real app, fetch from API)
    const currentStep = orderId ? (orderId.charCodeAt(0) % 5) : 2;

    return (
        <div className="min-h-screen py-16">
            <div className="container-custom max-w-3xl">
                {/* Header */}
                <div className="text-center mb-14 animate-slideUp">
                    <h1 className="text-4xl font-bold gradient-text mb-3">Order Tracking</h1>
                    {orderId && (
                        <div className="glass inline-block px-6 py-2 rounded-full">
                            <p className="text-slate-300 text-sm">
                                Order ID: <span className="text-white font-mono font-bold">#{orderId?.slice(-8)?.toUpperCase()}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Estimated Delivery */}
                <div className="glass rounded-2xl p-6 mb-10 text-center animate-slideUp">
                    <p className="text-slate-400 text-sm mb-1">Estimated Delivery</p>
                    <p className="text-2xl font-bold text-white">
                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                    <p className="text-green-400 text-sm mt-1 font-semibold">🚀 On Track</p>
                </div>

                {/* Stepper */}
                <div className="glass rounded-2xl p-8 animate-slideUp">
                    <div className="relative">
                        {/* Progress line */}
                        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-700 rounded-full" />
                        <div
                            className="absolute left-8 top-8 w-0.5 bg-gradient-to-b rounded-full transition-all duration-1000"
                            style={{
                                background: 'linear-gradient(to bottom, var(--color-primary-from), var(--color-primary-to))',
                                boxShadow: 'var(--shadow-glow)',
                                height: `${Math.min((currentStep / (steps.length - 1)) * 85, 85)}%`
                            }}
                        />

                        <div className="space-y-8 relative">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStep;
                                const isCurrent = index === currentStep;

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-6 animate-slideInLeft`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Icon circle */}
                                        <div className={`relative flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                                            isCurrent
                                                ? 'gradient-bg shadow-glow neon-glow scale-110'
                                                : isCompleted
                                                ? 'gradient-bg opacity-70'
                                                : 'bg-slate-800 border-2 border-slate-600 opacity-40'
                                        }`}>
                                            {step.icon}
                                            {isCurrent && (
                                                <div className="absolute -inset-1 rounded-full border-2 border-purple-400 animate-ping opacity-40" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className={`flex-1 pt-3 ${!isCompleted ? 'opacity-40' : ''}`}>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className={`text-lg font-bold ${isCurrent ? 'gradient-text' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                                                    {step.label}
                                                </h3>
                                                {isCurrent && (
                                                    <span className="badge badge-info text-xs animate-pulseGlow">Current</span>
                                                )}
                                                {isCompleted && !isCurrent && (
                                                    <span className="badge badge-success text-xs">✓ Done</span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tracking number */}
                <div className="mt-6 glass rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-sm">Tracking Number</p>
                    <p className="text-white font-mono font-bold text-lg tracking-widest gradient-text">
                        TRK{orderId?.slice(0, 9)?.toUpperCase() || 'XXXXXXXXX'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
