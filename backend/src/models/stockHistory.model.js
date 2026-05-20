import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        index: true
    },
    action: {
        type: String,
        enum: [
            'RESERVED', 
            'RESERVATION_RELEASED', 
            'DEDUCTED', 
            'RESTORED_CANCEL', 
            'RESTORED_PAYMENT_FAIL', 
            'RESTORED_RETURN', 
            'ADMIN_ADD', 
            'ADMIN_REDUCE'
        ],
        required: true
    },
    quantityChange: {
        type: Number,
        required: true
    },
    stockBefore: {
        type: Number,
        required: true
    },
    stockAfter: {
        type: Number,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    note: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const StockHistory = mongoose.model("StockHistory", stockHistorySchema);
