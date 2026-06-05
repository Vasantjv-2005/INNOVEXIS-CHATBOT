const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");

// LOAD ENV
dotenv.config();

// Require Passport Config
require("./config/passport");

// DATABASE
const connectDB = require("./config/db");

// SOCKET
const {
  initSocket,
} = require(
  "./sockets/socketHandler"
);

// ROUTES
const authRoutes = require(
  "./routes/authRoutes"
);

const chatRoutes = require(
  "./routes/chatRoutes"
);

const userRoutes = require(
  "./routes/userRoutes"
);

const adminRoutes = require(
  "./routes/adminRoutes"
);

const imageRoutes =
  require(
    "./routes/imageRoutes"
  );

// const passwordRoutes =
//   require(
//     "./routes/passwordRoutes"
//   );

// ERROR MIDDLEWARE
const errorMiddleware = require(
  "./middleware/errorMiddleware"
);

// CONNECT DATABASE
connectDB();

const app = express();

const server =
  http.createServer(app);

// INITIALIZE SOCKET
initSocket(server);

// SECURITY
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "*",

    credentials: true,
  })
);

app.use(passport.initialize());

// BODY PARSER
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/api/image",
  imageRoutes
);
// LOGGER
app.use(morgan("dev"));

// STATIC FOLDER
app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚀 AI Chatbot Backend Running Successfully",
  });
});

// API ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/user",
  userRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// app.use(
//   "/api/password",
//   passwordRoutes
// );

// ERROR HANDLER
app.use(
  errorMiddleware
);

// PORT
const PORT =
  process.env.PORT || 5000;

// START SERVER
server.listen(PORT, () => {
  console.log(
    `✅ Server running on port ${PORT}`
  );
});