const {
  SECRET_KEY,
  REFRESH_SECRET_KEY,
} = require("../middlewares/fetchUser.middleware");
const { UserModel } = require("../schemas/user.schema");
const { isValidObjectId, hashPassword, verifyPassword } = require("../utils");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    console.log(users);

    return res
      .status(200)
      .json({ users, message: "All user found ", success: true });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "id is invalid",
        success: false,
      });
    }
    // const user = await UserModel.find({_id: id })
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      message: "user fetched by Id",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const body = req.body;
    const { firstName, lastName, email, jobTitle, gender, password } = body;

    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim();
    const trimmedJobTitle = jobTitle?.trim();
    const trimmedGender = gender?.trim();

    const alphabetRegex = /^[A-Za-z\s]+$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!trimmedFirstName) {
      return res.status(400).json({
        message: "Missing required params - firstName",
        success: false,
      });
    } else if (!alphabetRegex.test(trimmedFirstName)) {
      return res.status(400).json({
        message: "Invalid firstName - only alphabets are allowed",
        success: false,
      });
    }

    if (!trimmedLastName) {
      return res.status(400).json({
        message: "Missing required params - lastName",
        success: false,
      });
    } else if (!alphabetRegex.test(trimmedLastName)) {
      return res.status(400).json({
        message: "Invalid lastName - only alphabets are allowed",
        success: false,
      });
    }

    if (!trimmedEmail) {
      return res.status(400).json({
        message: "Missing required params - email",
        success: false,
      });
    } else if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Invalid email- format",
        success: false,
      });
    }

    const doesUserExist = await UserModel.findOne({ email: trimmedEmail });
    if (doesUserExist) {
      return res.status(400).json({
        message: "User with email already exists",
        success: false,
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      jobTitle: trimmedJobTitle,
      gender: trimmedGender,
      hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      user,
      message: "User added successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const body = req.body;
    const { email, password } = body;

    if (!email) {
      res.status(400).json({
        message: "email is required",
        success: false,
      });
    }

    if (!password) {
      res.status(400).json({
        message: "password is required",
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User with email Id doesn't  exist",
        success: false,
      });
    }

    const isPasswordCorrect = await verifyPassword(
      password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credential",
        success: false,
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Send the token to the client
    return res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      refreshToken,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAccessToken = async (req, res, next) => {
  try {
    const accessToken = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      SECRET_KEY,
      { expiresIn: "30s" }
    );

    return res.status(200).json({
      accessToken,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "id is invalid",
        success: false,
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      deleted: true,
      user: deletedUser,
      message: "user deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  deleteUserById,
  getUserInfo,
  getAccessToken,
};
