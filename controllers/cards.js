const Card = require("../models/card");
const NotFound = require("../utils/Errors/NotFound");
const BadRequest = require("../utils/Errors/BadRequest");
const ForbiddenError = require("../utils/Errors/ForbiddenError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFound("Карточки не найдены");
    })
    .then((cards) => {
      res.send({ date: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user.id;

  const { title, text, date } = req.body;
  Card.create({
    title,
    text,
    date,
    owner,
  })

    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err && !title) {
        const error = new BadRequest("С названием что-то не так");
        next(error);
      } else if (err) {
        const error = new BadRequest("С ссылкой на статью что-то не так");
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user.id;
  const { _cardId } = req.params;
  Card.findById(_cardId)
    .populate("owner")
    .then((card) => {
      if (card.owner.id === userId) {
        Card.findByIdAndDelete(_cardId).then((thisCard) => {
          res.status(200).send(thisCard);
        });
      } else {
        const err = new ForbiddenError(
          "Запрещено удалять чужие карточки"
        );
        next(err);
      }
    })
    .catch((err) => {
      if (err) {
        const error = new NotFound("Карточка не существует");
        next(error);
      }
    });
};
