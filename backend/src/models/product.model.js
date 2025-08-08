import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:String,required:true},
    
},{timestamps:true})
const productModel=mongoose.models.product||mongoose.model("product",productSchema);

export default productModel