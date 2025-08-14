import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:[String],required:true},
    
},{timestamps:true})

export const Product=mongoose.model("product",productSchema)