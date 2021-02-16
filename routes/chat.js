const chatRouter = require("express").Router();
const Message = require("../models/message");
const express = require("express");


const { Joi, celebrate } = require("celebrate");
const {
  getMessages,
  createMessage,
  deleteMessage,
} = require("../controllers/chat");


chatRouter.get('/', getMessages)


chatRouter.delete(
  "/:_messageId",
  celebrate({
    params: Joi.object().keys({
      _messageId: Joi.string().hex().required().length(24),
    }),
  }),
  deleteMessage
);

chatRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      text: Joi.string().required(),
      date: Joi.string().required(),
    }),
  }),
  createMessage
);

module.exports = chatRouter;
