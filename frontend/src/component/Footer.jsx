import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
    Shop: [
        { label: 'Smartphones', to: '/products?category=smartphones' },
        { label: 'Laptops', to: '/products?category=laptops' },
        { label: 'Headphones', to: '/products?category=headphones' },
        { label: 'Cameras', to: '/products?category=cameras' },
    ],
    Account: [
        { label: 'My Dashboard', to: '/dashboard' },
        { label: 'My Orders', to: '/dashboard' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'Cart', to: '/cart' },
    ],
    Help: [
        { label: 'Track Order', to: '/dashboard' },
        { label: 'Return Policy', to: '/' },
        { label: 'FAQ', to: '/' },
        { label: 'Sell on GLIPKART', to: '/admin/login' },
    ],
};

const Footer = () => (
    <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }} className="mt-16">
        <div className="container-custom py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <Link to="/" className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>GLIPKART</Link>
                    <p className="mt-3 text-xs leading-relaxed max-w-xs" style={{ color: 'var(--color-text-faint)' }}>
                        Premium electronics & gadgets at the best prices. Fast delivery, easy returns.
                    </p>
                    <div className="flex gap-3 mt-4">
                        {['𝕏', '📸', '▶'].map(icon => (
                            <a key={icon} href="#" className="w-8 h-8 flex items-center justify-center rounded text-sm transition-colors hover:text-white" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
                {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                    <div key={title}>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-secondary)' }}>{title}</h4>
                        <ul className="space-y-2.5">
                            {links.map(l => (
                                <li key={l.label}>
                                    <Link to={l.to} className="text-xs transition-colors hover:text-white" style={{ color: 'var(--color-text-faint)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>© {new Date().getFullYear()} GLIPKART. All rights reserved.</p>
                <div className="flex gap-2">
                    {['Visa', 'Mastercard', 'UPI', 'Stripe'].map(p => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>{p}</span>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
