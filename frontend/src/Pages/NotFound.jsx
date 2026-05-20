import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">

            <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float top-20 left-10" />
            <div className="absolute w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float bottom-20 right-10" style={{ animationDelay: '1.5s' }} />

            <div className="text-center space-y-8 animate-bounceIn relative z-10">

                <div className="relative">
                    <h1 className="text-[12rem] font-black leading-none gradient-text opacity-20 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl animate-float">🛸</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-white neon-glow-text">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                        Looks like this page flew off into the cosmos. Let's get you back to shopping!
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/" className="btn-primary">
                        🏠 Back to Home
                    </Link>
                    <Link to="/products" className="btn-outline">
                        🛍️ Browse Products
                    </Link>
                </div>


                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-yellow-400 animate-float"
                        style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.4}s`,
                            fontSize: `${0.6 + Math.random() * 0.8}rem`,
                            opacity: 0.6
                        }}
                    >
                        ✦
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotFound;
