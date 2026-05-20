import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductList from './Products/Productlist';
import FlashDeals from './FlashDeals';
import Testimonials from './Testimonials';

const CATEGORIES = [
    { name: 'Smartphones', icon: '📱', to: '/products?category=smartphones' },
    { name: 'Laptops', icon: '💻', to: '/products?category=laptops' },
    { name: 'Headphones', icon: '🎧', to: '/products?category=headphones' },
    { name: 'Cameras', icon: '📷', to: '/products?category=cameras' },
    { name: 'Tablets', icon: '📲', to: '/products?category=tablets' },
    { name: 'Watches', icon: '⌚', to: '/products?category=watches' },
];

const TRUST = [
    { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹500' },
    { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
    { icon: '🔒', title: 'Secure Payment', desc: 'Stripe encrypted checkout' },
    { icon: '💯', title: '100% Authentic', desc: 'Manufacturer warranty' },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'JBL', 'Bose', 'LG', 'OnePlus', 'Xiaomi', 'HP', 'Lenovo', 'Canon'];

const Home = () => {
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

            {/* ── Hero Banner ── */}
            <section style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container-custom py-10 md:py-16">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-5 animate-slideUp">
                            <span className="badge badge-primary text-xs">New Arrivals Every Week</span>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight" style={{ color: 'var(--color-text)' }}>
                                Best Deals on<br />
                                <span style={{ color: 'var(--color-primary)' }}>Electronics & Gadgets</span>
                            </h1>
                            <p className="text-base max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                                Shop the latest smartphones, laptops, audio gear, and more — with fast delivery and easy returns.
                            </p>
                            <div className="flex gap-3">
                                <Link to="/products" className="btn-primary px-6 py-2.5">
                                    Shop Now
                                </Link>
                                <Link to="/products?category=smartphones" className="btn-secondary px-6 py-2.5">
                                    Browse Deals
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 max-w-sm md:max-w-md w-full animate-slideInRight">
                            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&q=80"
                                    alt="Electronics collection"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Trust strip ── */}
            <section style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0" style={{ '--tw-divide-opacity': '1', borderColor: 'var(--color-border)' }}>
                        {TRUST.map((t, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-4">
                                <span className="text-2xl">{t.icon}</span>
                                <div>
                                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{t.title}</p>
                                    <p className="text-[10px]" style={{ color: 'var(--color-text-faint)' }}>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Flash Deals ── */}
            <section style={{ backgroundColor: 'var(--color-bg)' }} className="pt-8">
                <FlashDeals />
            </section>

            {/* ── Shop by Category ── */}
            <section className="container-custom py-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Shop by Category</h2>
                    <Link to="/products" className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>See All →</Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {CATEGORIES.map((cat, i) => (
                        <Link
                            key={i}
                            to={cat.to}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg text-center transition-all hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                        >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }} className="py-8">
                <ProductList featured={true} count={8} title="⭐ Featured Products" />
            </section>

            {/* ── Brand Strip ── */}
            <section className="py-8 overflow-hidden" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="container-custom mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-center" style={{ color: 'var(--color-text-faint)' }}>Top Brands</p>
                </div>
                <div className="flex gap-0 marquee-track whitespace-nowrap">
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <span key={i} className="inline-block px-10 text-sm font-bold" style={{ color: 'var(--color-border-light)' }}>{brand}</span>
                    ))}
                </div>
            </section>

            {/* ── Latest Products ── */}
            <section className="py-8">
                <ProductList count={12} title="🆕 New Arrivals" />
            </section>

            {/* ── Testimonials ── */}
            <section style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <Testimonials />
            </section>

            {/* ── Newsletter ── */}
            <section className="container-custom py-12">
                <div className="max-w-lg mx-auto text-center space-y-4 animate-slideUp">
                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Stay Updated</h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Subscribe for exclusive deals and new arrivals.</p>
                    <form className="flex gap-2" onSubmit={e => { e.preventDefault(); setEmail(''); }}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-field flex-1 text-sm"
                            required
                        />
                        <button type="submit" className="btn-primary px-5 text-sm whitespace-nowrap">Subscribe</button>
                    </form>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-faint)' }}>No spam. Unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
