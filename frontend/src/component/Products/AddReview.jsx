import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';

const AddReview = ({ productId, onReviewAdded }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to write a review');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/reviews`,
                { productId, rating, comment },
                { withCredentials: true }
            );
            toast.success('Review submitted successfully');
            setComment('');
            setRating(5);
            if (onReviewAdded) onReviewAdded();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="glass rounded-lg p-6 text-center">
                <p className="text-slate-300 mb-4">Please login to write a review</p>

            </div>
        );
    }

    return (
        <div className="glass rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-slate-300 mb-2">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-2xl transition-colors focus:outline-none"
                            >
                                <span className={
                                    (hoverRating || rating) >= star 
                                        ? "text-yellow-400" 
                                        : "text-slate-600"
                                }>
                                    ★
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-slate-300 mb-2">Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        className="input-field w-full h-32 resize-none"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full md:w-auto px-8"
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default AddReview;
