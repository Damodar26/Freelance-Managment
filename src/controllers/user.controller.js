import {asyncHandler} from "../utils/asyncHandlers.js"
import {ApiError} from  "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from  "../utils/ApiResponse.js"

/*const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken
    const refreshToken = user.generateRefreshToken

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

    if(!user) {
      throw new ApiError(404, "user does not exist")
    }
  
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}
*/
const  generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend (through postman)
    //validation - not empty
    //check if user already exists : username, email
    //check for images, check for avatars
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refersh token field from response
    //check for user creation 
    //return res

   const {fullName, email, username, password} = req.body
   //console.log("username:",username)

   if(
        [fullName, email, username, password].some((field) =>
            field?.trim()==="")
   ) {
        throw new ApiError(400, "All fields are required")
   }


   const existedUser = await User.findOne({
    $or: [{username}, {email}]
   })
   
   if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path
   //const CoverImageLocalPath = req.files?.CoverImage[0]?.path

   let CoverImageLocalPath
   if (req.files && Array.isArray(req.files.CoverImage)&&req.files.CoverImage.length>0) {
        CoverImageLocalPath = req.files.CoverImage[0].path
    
   }

   if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
   }


  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const CoverImage =  await uploadOnCloudinary(CoverImageLocalPath)

  if(!avatar) {
    throw new ApiError(400, "Avatar is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    CoverImage: CoverImage?.url || "",
    // CoverImage: CoverImage.url ,
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

})


const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username and email
  // find the user 
  // password check
  //access and refresh token
  // send cookie
  //successfully logged in
  
  const {email, username, password} = req.body

  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
  }


  const user = await User.findOne({
    $or: [{username}, {email}]
   })
  
  if(!user) {
    throw new ApiError(404, "user does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials ")
  }
  

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

const options = {
  httpOnly: true,
  secure: true
}
return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
  200,
  {
    user: loggedInUser, accessToken, refreshToken
  },
  "User Logged in successfully"
)



  

})

/*const logoutUser = asyncHandler(async(req, res) => {
 await  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )


  const options = {
    httpOnly: true,
    secure: true
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))

})*/
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}