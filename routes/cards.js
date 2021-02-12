const cardsRouter = require("express").Router();
const { Joi, celebrate } = require("celebrate");
const { getCards, createCard, deleteCard } = require("../controllers/cards");

cardsRouter.get("/", getCards);

cardsRouter.delete(
  "/:_cardId",
  celebrate({
    params: Joi.object().keys({
      _cardId: Joi.string().hex().required().length(24),
    }),
  }),
  deleteCard
);

cardsRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      title: Joi.string().required().min(3),
      text: Joi.string().required().min(2).max(87),
      date: Joi.string().required(),
    }),
  }),
  createCard
);

module.exports = cardsRouter;
