const isEmail = require("validator/lib/isEmail");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const NotFound = require("../utils/Errors/NotFound");
const ConflictError = require("../utils/Errors/ConflictError");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");
const randomName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const { Schema } = mongoose;

const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    default: "Пользователь",
  },
  avatar: {
    type: String,
    required: false,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Alexander_von_Benckendorff.jpg/800px-Alexander_von_Benckendorff.jpg",
  },
});

User.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFound("Пользователь не найден"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new ConflictError("Неправильные почта или пароль")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", User);
