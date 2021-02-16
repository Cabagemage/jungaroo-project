 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Joi, celebrate, errors } = require("celebrate");
const helmet = require("helmet");
const { limiter } = require("./utils/optional/limiter.js");
const router = require("./routes/index.js");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { mongoDBUrl, mongoDBOptions } = require("./utils/configs/config.js");


const { PORT = 3000 } = process.env;

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socketIo.on("connection", (socket) => {
  console.log('user on')
});
app.io = socketIo;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email()
        .error(new Error("Email обязательное поле!")),
      password: Joi.string()
        .required()
        .min(3)
        .error(new Error("Пароль должен состоять минимум из 3 символов")),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(3),
    }),
  }),
  createUser
);

app.use(errors());
app.use(auth);
app.use("/", router);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

mongoose.connect(mongoDBUrl, mongoDBOptions);

app.use(limiter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const { message } = err;
  res.status(statusCode).send({ message });
  next();
});

server.listen(PORT, () => console.log("SERVER IS RUNNING"));


