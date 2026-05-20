import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity cannot be less than 1"]
                },
                price: {
                    type: Number,
                    required: true
                },
                title: {
                    type: String,
                    default: ""   // Snapshot at order time — survives product deletion
                }
            }
        ],
        shippingAddress: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            default: "Stripe"
        },
        paymentIntentId: {
            type: String,
            required: true
        },
        // ── Full 8-stage order lifecycle ────────────────────────────────────────
        status: {
            type: String,
            enum: [
                'Pending',          // Created but payment not yet initiated
                'PaymentPending',   // Stripe intent created, awaiting card auth
                'Confirmed',        // Payment succeeded
                'Packed',           // Warehouse has packed the order
                'Shipped',          // In transit
                'Delivered',        // Delivered to customer
                'Cancelled',        // Cancelled (stock restored)
                'Returned'          // Customer returned (stock restored)
            ],
            default: 'Confirmed'
        },
        // ── Payment tracking ────────────────────────────────────────────────────
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
            default: 'Paid'
        },
        // ────────────────────────────────────────────────────────────────────────
        totalAmount: {
            type: Number,
            required: true
        },
        discountAmount: {
            type: Number,
            default: 0
        },
        couponCode: {
            type: String,
            default: ''
        },
        timeSlot: {
            type: String
        },
        location: {
            lat: Number,
            lng: Number
        },
        // Status transition timestamps
        confirmedAt: Date,
        packedAt: Date,
        shippedAt: Date,
        deliveredAt: Date,
        cancelledAt: Date,
        returnedAt: Date,

        trackingNumber: {
            type: String,
            default: () => 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
        },
        estimatedDelivery: {
            type: Date
        },
        cancellationReason: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

export const Orders = mongoose.model("Orders", orderSchema);