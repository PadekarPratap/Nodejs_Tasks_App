import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errorHandler.js";
import JWT from "jsonwebtoken";

// to Create a new User
export const registerUser = catchAsyncError(async (req, res, next) => {
  // destructuring name, email & password from req.body
  const { name, email, password } = req.body;

  // checking whether the user already exists or not
  let user = await User.findOne({ email });
  if (user) {
    return next(
      new ErrorHandler(
        `User with the email, ${email} already exists. try logging in.`,
        400
      )
    );
  }

  // hashing the password to save it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // saving the User into the database
  user = await User.create({ name, email, password: hashedPassword });

  // creating a JWT token with user._id as a payload
  const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

  // sending the response that user has been registered successfully along with the cookie
  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // cookie expires in 1d
      sameSite: process.env.NODE_ENV === "Development" ? 'Lax' : 'None',
      secure: process.env.NODE_ENV === "Development" ? false : true
    })
    .json({
      success: true,
      message: "User has been created successfully",
      user,
    });
});

// to login with an already registered user
export const loginUser = catchAsyncError(async (req, res, next) => {
  // destructuring email and password from req.body
  const { email, password } = req.body;

  // checking if the user does not exist
  let user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));

  // checking if the password is matched or not
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched)
    return next(new ErrorHandler("Invalid Email or Password", 400));

  // Creating a JWT token
  const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

  // sending the response along with the cookie
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // expires in 1d
      sameSite: process.env.NODE_ENV === "Development" ? 'Lax' : 'None',
      secure: process.env.NODE_ENV === "Development" ? false : true
    })
    .json({
      success: true,
      message: `welcome back, ${user.name}`,
      user,
    });
});

// getting the details of the single user -> no catchAsyncError required as the func is not async
export const getUserProfile = (req, res, next) => {
  // destructuring name & email from req.user which we saved during isAuthenticated
  const { name, email } = req.user;

  // sending the res containing the user details
  res.status(200).json({
    success: true,
    user: { name, email },
  });
};

// logoutUser
export const logoutUser = catchAsyncError(async (req, res, next) => {
  // getting the token from req.cookies
  const { token } = req.cookies;

  // token wouldn't exist if the user has not loggged or signed in
  if (!token) return next(new ErrorHandler("The user has not logged in", 400));

  // sending the res along with deleting the cookie
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? 'Lax' : 'None',
      secure: process.env.NODE_ENV === "Development" ? false : true
    })
    .json({
      success: true,
      message: "The user has successfully logged out",
    });
});
