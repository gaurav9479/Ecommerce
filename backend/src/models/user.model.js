import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        Name:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        // address: {
        //     street: {
        //     type: String,
        //     required: true
        //     },
        //     city: {
        //         type: String,
        //         required: true
        //     },
        //     state: {
        //         type: String,
        //         required: true
        //     },
        //     postalCode: {
        //         type: String,
        //         required: true
        //     },
        //     country: {
        //         type: String,
        //         required: true,
        //         default: "India"  // or your most common country
        //     },
        //     landmark: {
        //         type: String
        //     },
        //     phone: {
        //         type: String,
        //         required: true
        //     }
        // },
        phone:{
            type:Number,
            unique:true
        },
        //cart: {
            // {
            //     product: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'Product',
            //     required: true
            //     },
            //     quantity: {
            //         type: Number,
            //         default: 1
            //     }
            // }

        //},

        

        isAdmin: {
            type: Boolean,
            default: false
        },

        createdAt: {
            type: Date,
            default: Date.now
        },
        refreshToken:{
            type:String
        }
        
        

    }
)
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    console.log("Passwords recived",this.password)
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            Name:this.fullName,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        },
        
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)