import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const tick = () => {
            const diff = new Date(targetDate) - Date.now();
            if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0 });
            setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
};

const pad = (n) => String(n).padStart(2, '0');

const FlashDealCard = ({ product }) => {
    const expiresAt = product.flashDeal?.expiresAt || new Date(Date.now() + 6 * 3600000);
    const { h, m, s } = useCountdown(expiresAt);
    const discountedPrice = Math.round(product.price * (1 - (product.discount || 20) / 100));

    return (
        <div className="flex-shrink-0 w-52 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', minWidth: '200px' }}>
            <div className="relative">
                <img src={product.image?.[0] || 'https://placehold.co/400x260/1f2937/6366f1'} alt={product.title} className="w-full h-36 object-cover" />
                <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: '#dc2626' }}>{product.discount || 20}% OFF</span>
            </div>
            <div className="p-3 space-y-2">
                <p className="text-xs font-medium line-clamp-2 leading-snug" style={{ color: 'var(--color-text)' }}>{product.title}</p>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>₹{discountedPrice.toLocaleString()}</span>
                    <span className="text-[11px] line-through" style={{ color: 'var(--color-text-faint)' }}>₹{product.price?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px]" style={{ color: 'var(--color-text-faint)' }}>Ends:</span>
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-warning)' }}>
                        {pad(h)}:{pad(m)}:{pad(s)}
                    </span>
                </div>
                <Link to={`/product/${product._id}`} className="btn-primary w-full text-center text-xs py-1.5 block">
                    Grab Deal
                </Link>
            </div>
        </div>
    );
};

const STATIC_DEALS = [
    { _id: 's1', title: 'Sony WH-1000XM5 Wireless Headphones', price: 29999, discount: 35, image: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=260&fit=crop'], flashDeal: { expiresAt: new Date(Date.now() + 5.5 * 3600000) } },
    { _id: 's2', title: 'Apple AirPods Pro 2nd Generation', price: 24900, discount: 20, image: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=260&fit=crop'], flashDeal: { expiresAt: new Date(Date.now() + 3 * 3600000) } },
    { _id: 's3', title: 'Samsung Galaxy Tab S9 Ultra', price: 74999, discount: 28, image: ['https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=260&fit=crop'], flashDeal: { expiresAt: new Date(Date.now() + 8 * 3600000) } },
    { _id: 's4', title: 'GoPro HERO12 Black Edition', price: 38990, discount: 15, image: ['https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=400&h=260&fit=crop'], flashDeal: { expiresAt: new Date(Date.now() + 2.75 * 3600000) } },
    { _id: 's5', title: 'Jabra Evolve2 85 Wireless Headset', price: 32999, discount: 22, image: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=260&fit=crop'], flashDeal: { expiresAt: new Date(Date.now() + 4 * 3600000) } },
];

const FlashDeals = () => {
    const [deals, setDeals] = useState(STATIC_DEALS);

    useEffect(() => {
        axios.get(`${API}/api/v1/products/flash-deals`).then(res => {
            if (res.data?.data?.length > 0) setDeals(res.data.data);
        }).catch(() => {});
    }, []);

    return (
        <div className="container-custom py-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>🔥 Flash Deals</h2>
                    <span className="text-xs px-2 py-0.5 rounded font-semibold animate-pulseGlow" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                        Limited Time
                    </span>
                </div>
                <Link to="/products" className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>View All →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                {deals.map((product) => (
                    <div key={product._id} className="snap-start">
                        <FlashDealCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashDeals;
