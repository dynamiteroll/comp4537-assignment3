const express = require("express")
const { handleErr } = require("./errorHandler.js")
const { asyncWrapper } = require("./asyncWrapper.js")
const dotenv = require("dotenv")
dotenv.config();
const userModel = require("./userModel.js")
const { connectDB } = require("./connectDB.js")
const cors = require("cors")


const {
  PokemonBadRequest,
  PokemonDbError,
  PokemonAuthError
} = require("./errors.js")

const auth = express()

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });


  auth.listen(process.env.authServerPORT, async (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.authServerPORT}`);
    const doc = await userModel.findOne({ "username": "admin" })
    if (!doc)
      userModel.create({ username: "admin", password: bcrypt.hashSync("admin", 10), role: "admin", email: "admin@admin.ca" })
  })
})
start()

auth.use(express.json())
auth.use(cors({
  exposedHeaders: ['auth-token-access', 'auth-token-refresh']
}))

const bcrypt = require("bcrypt")
auth.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body;
  try {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userWithHashedPassword = { ...req.body, password: hashedPassword };

  const user = await userModel.create(userWithHashedPassword);
  res.send(user);
  } catch (error) {
    console.log("test1")
    if (userModel.findOne({ username }) && userModel.findOne({ email })) {
      res.status(400)
      throw new PokemonBadRequest("User already exists")
    } else if (req.body.username === "" || req.body.password === "" || req.body.email === ""){
      res.status(400)
      throw new PokemonBadRequest("Some fields are missing")
    } else {
      res.status(400)
      throw new PokemonBadRequest("Something went wrong")
    }
  }
}))

const jwt = require("jsonwebtoken")
let refreshTokens = [] // replace with a db
auth.post('/requestNewAccessToken', asyncWrapper(async (req, res) => {
  // console.log(req.headers);
  const refreshToken = req.header('auth-token-refresh')
  if (!refreshToken) {
    res.status(404)
    throw new PokemonAuthError("No Token: Please provide a token.")
  }

  //detect if token is in db or not
  const refreshTokenToDB = await userModel.findOne({ token: refreshToken });
  if (!refreshTokenToDB) {
    console.log("refresh token not found in db")
    res.status(401)
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }
  
  // if (!refreshTokens.includes(refreshToken)) { // replaced a db access
  //   console.log("token: ", refreshToken);
  //   console.log("refreshTokens", refreshTokens);
  //   throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  // }
  try {
    const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const accessToken = jwt.sign({ user: payload.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    res.header('auth-token-access', accessToken)
    res.send("All good!")
  } catch (error) {
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }
}))

auth.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username })
  if (!user)
    {
      res.status(401)
      throw new PokemonAuthError("User not found")
    }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect)
     {
      res.status(401)
      throw new PokemonAuthError("Password is incorrect")
     }


  const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
  const refreshToken = jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)

  try {
    if (user?.token_invalid) {
      await userModel.updateOne({ email: user.email, password: user.password}, { token_invalid: false})
    } else {
      await userModel.updateOne({ email: user.email, password: user.password}, { token: refreshToken})
    }
  } catch (error) {
    throw new PokemonDbError(error)
  }

  res.header("Authorization", "Bearer " + accessToken + "," + "Refresh " + refreshToken);

  // res.header('Authorization', `Bearer ${accessToken},Refresh ${refreshToken}`)

  res.header('auth-token-access', accessToken)
  res.header('auth-token-refresh', refreshToken)

  // res.send("All good!")
  res.send(user)
}))


auth.get('/logout', asyncWrapper(async (req, res) => {

  // const user = await userModel.findOne({ token: req.query.appid })
  // if (!user) {
  //   throw new PokemonAuthError("User not found")
  // }
  // await userModel.updateOne({ token: user.token }, { token_invalid: true })
  // res.send("Logged out")

  const refreshToken = req.header('auth-token-refresh')
  if (!refreshToken) {
    res.status(404)
    throw new PokemonAuthError("No Token: Please provide a token.")
  }

  const user = await userModel.findOne({ token: refreshToken });
  if (!user) {
    res.status(401)
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }

  await userModel.updateOne({ token: refreshToken }, { token_invalid: true })
  res.send("Logged out")
}))

auth.use(handleErr)

module.exports = auth;