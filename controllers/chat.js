const NotFound = require("../utils/Errors/NotFound");
const BadRequest = require("../utils/Errors/BadRequest");
const ForbiddenError = require("../utils/Errors/ForbiddenError");

module.exports.getMessages = (req, res, next) => {
  Message.find({})
    .orFail(() => {
      throw new NotFound("Сообщения не найдены");
    })
    .then((messages) => {
      res.send({ date: messages });
    })
    .catch(next);
};

module.exports.createMessage = (req, res, next) => {
  const owner = req.user.id;

  const { text, date } = req.body;
  Article.create({
    text,
    date,
    owner,
  })

    .then((message) => res.status(200).send(message))
    .catch((err) => {
      if (err && !text) {
        const error = new BadRequest("Произошла ошибка.");
        next(error);
      }
    });
};

module.exports.deleteMessage = (req, res, next) => {
  const userId = req.user.id;
  const { _messageId } = req.params;
  Card.findById(_messageId)
    .populate("owner")
    .then((card) => {
      if (card.owner.id === userId) {
        Card.findByIdAndDelete(_messageId).then((thisCard) => {
          res.status(200).send(thisCard);
        });
      } else {
        const err = new ForbiddenError("Запрещено удалять чужие карточки");
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
