const { UserModel } = require("../schemas/user.schema");
const { isValidObjectId } = require("../utils");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    console.log(users);
    return res.status(200).json({ users });
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
      });
    }
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "id is invalid",
      });
    }
    // const user = await UserModel.find({_id: id })
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const body = req.body;
    const { firstName, lastName, email, jobTitle, gender } = body;

    if (!firstName) {
      return res.status(400).json({
        message: "Missing required params - firstName",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Missing required params - email",
      });
    }

    const doesUserExist = await UserModel.findOne({ email });
    if (doesUserExist) {
      return res.status(400).json({
        message: "User with email already exists",
      });
    }

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      jobTitle,
      gender,
    });

    await user.save();

    return res.status(201).json({
      user,
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
      });
    }
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "id is invalid",
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      deleted: true,
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
};
