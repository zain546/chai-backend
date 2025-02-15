import asyncHandler from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";
import {ApiResponse} from "../utills/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // Code to register a user
  //get user details from frontend
  //validate user details
  //check if user already exists - email,username
  //check for images and avatar
  //upload images to cloudinary
  //create user object - create entry in db
  //remove password and refresh token from response
  //check for user creation
  //return res

  const { username, email, password, fullName } = req.body;
  console.log("email", email);
  res.status(200).json({ message: "User registered successfully" });

  if (!username || !email || !password || !fullName) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath ) {
    throw new ApiError(400, "Avatar image is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if(!avatar){
    throw new ApiError(400, "Avatar image is required");
  }

  const user = await User.create({
    username: username.toLowerCase(), 
    email,
    password,
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  })
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiError(500, "User not created");
  }
  res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
