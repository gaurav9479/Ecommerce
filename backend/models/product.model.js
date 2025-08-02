import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    Image:{type:Array,required:true},
    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory:{type:String,required:true},
    size:{type:Array},
    bestseller:{type:Boolean},

},{timestamps:true})
const productModel=mongoose.models.product||mongoose.model("product",productSchema);

export default productModel