import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return{accessToken,refreshToken}
        
    }catch(error){
        throw new ApiError(500,"some errro ouccur in genreating refresh and acccess token")

    }
}
const registerUser= asyncHandler(async(req,res)=>{
    const{Name,email,password,phone,isAdmin}=req.body
    if([Name,email,password,phone].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }
    const exsistedUser=await User.findOne({
        $or:[{email},{phone}]
    })
    if(exsistedUser){
        throw new ApiError(409,"user with same email already exsist")
    }
    const user =await User.create({
        Name,
        email,
        password,
        phone,
        isAdmin:isAdmin||false,
    })
    const createduser=await User.findById(user._id).select(
        "-password"
    )
    if(!createduser){
        throw new ApiError(500,"something went wrong while registerig user")
    }
    return res.status(201).json(
        new ApiResponse(200,createduser,"user ban gaya Success fully")
    )

})
const loginUser=asyncHandler(async(req,res)=>{
    const {email,password,phone,isAdmin}=req.body
    if((!email && !phone) || !password){
        throw new ApiError(400,"phone or email is required")
    }
    const user=await User.findOne({
        $or:[{phone},{email}]
    }).select("+password");
    if(!user){
        throw new ApiError(404,"user does no exsist")
    }
    const is_pass_valid=await user.isPasswordCorrect(password)
    if(!is_pass_valid){
        throw new ApiError(401,"invalid user Credential")
    }
    if(isAdmin && !user.isAdmin){
        throw new ApiError(403,"you are not an admin")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    
    const loggedInUser=await User.findById(user._id).select("-password,-refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in sucessfully"
        )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User loggedout"))
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
    try{
        const decoded=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decoded?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refresh token expired")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,{accessToken,refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
    }catch(error){
        throw new ApiError(401,error?.message||"invalid refresh token")
    }
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid old pass")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res 
        .status(200)
        .json(new ApiResponse(200,{},"Password changed sucessfully"))
})

export{
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword
}