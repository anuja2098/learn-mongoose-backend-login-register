const mongoose = require("mongoose");

const GenderEnum = {
  Male: "Male",
  Female: "Female",
  Other: "Other",
};

const capitalizeFirstLettter = (v) => {
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    set: capitalizeFirstLettter,
    trim: true,
    validate: {
      validator: function (v) {
        return v.length <= 12;
      },
      message: "length should not exceed 12 characters",
    },
  },
  lastName: {
    type: String,
    trim: true,
    set: capitalizeFirstLettter,
    validate: {
      validator: function (v) {
        return v.length <= 12;
      },
      message: "length should not exceed 12 characters",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return v.length <= 30;
      },
      message: "length should not exceed 30 characters",
    },
  },

  hashedPassword: {
    type: String,
  },
  jobTitle: {
    type: String,
    trim: true,
    set: capitalizeFirstLettter,
    validate: {
      validator: function (v) {
        return v.length <= 15;
      },
      message: "length should not exceed 15 characters",
    },
  },
  gender: {
    type: String,
    enum: Object.values(GenderEnum),
    trim: true,
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  userSchema,
  UserModel,
};
