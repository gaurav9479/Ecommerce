import React from 'react';
import StarRating from './StarRating';

const testimonials = [
    { name: 'Priya Sharma', role: 'Verified Buyer', avatar: 'P', rating: 5, comment: "Absolutely love my new purchase! Fast delivery, great packaging, and exactly as described. My go-to for electronics.", product: 'MacBook Pro 14"' },
    { name: 'Rahul Verma', role: 'Regular Customer', avatar: 'R', rating: 5, comment: 'Outstanding quality at unbeatable prices. Ordered three times and each experience has been flawless. Highly recommended!', product: 'Sony WH-1000XM5' },
    { name: 'Ananya Singh', role: 'Premium Member', avatar: 'A', rating: 4, comment: 'Excellent customer service and quick responses. Return process was smooth and hassle-free. Will definitely shop again!', product: 'iPhone 15 Pro' },
];

const Testimonials = () => (
    <section className="container-custom py-10">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Customer Reviews</h2>
            <span className="badge badge-success">⭐ 4.8 avg (2,400+ reviews)</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
                <div key={i} className="p-5 rounded-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <StarRating rating={t.rating} size="sm" />
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>"{t.comment}"</p>
                    <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                            {t.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>{t.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--color-text-faint)' }}>{t.role} • {t.product}</p>
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--color-success)' }}>✓ Verified</span>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default Testimonials;
