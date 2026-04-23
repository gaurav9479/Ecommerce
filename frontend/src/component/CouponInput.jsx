import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const CouponInput = ({ orderAmount = 0, onCouponApplied }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [applied, setApplied] = useState(null);

    const handleApply = async () => {
        if (!code.trim()) { toast.error('Enter a coupon code'); return; }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/api/v1/coupons/validate`, { code: code.trim(), orderAmount });
            setApplied(data.data);
            onCouponApplied?.(data.data);
            toast.success(`🎉 ${data.message}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid coupon');
            setApplied(null);
            onCouponApplied?.(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setApplied(null);
        setCode('');
        onCouponApplied?.(null);
        toast('Coupon removed', { icon: '🗑️' });
    };

    return (
        <div className="space-y-2">
            {applied ? (
                <div className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-green-500/30">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎟️</span>
                        <div>
                            <p className="text-green-400 font-bold text-sm">{applied.code} Applied!</p>
                            <p className="text-slate-400 text-xs">{applied.discountPercent}% off your order</p>
                        </div>
                    </div>
                    <button onClick={handleRemove} className="text-slate-400 hover:text-red-400 transition-colors text-sm">
                        Remove
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApply()}
                        placeholder="Enter coupon code..."
                        className="input-field text-sm flex-1 font-mono tracking-widest"
                    />
                    <button
                        onClick={handleApply}
                        disabled={loading}
                        className="btn-primary text-sm whitespace-nowrap disabled:opacity-50"
                    >
                        {loading ? '...' : 'Apply'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CouponInput;
