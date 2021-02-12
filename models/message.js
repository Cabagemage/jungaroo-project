const mongoose = require("mongoose");

const { Schema } = mongoose;

const Message = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Message", Message);
