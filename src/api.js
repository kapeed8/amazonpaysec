require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const stripe = require("stripe")(process.env.TEMPKEY);

const app = express();
const router = express.Router();

app.use(cors({ origin: true }));
app.use(express.json());

router.get("/", (req, res) => {
  res.json({
    hello: "deepak jaiswar",
  });
});

router.get("/payment/create", async (req, res) => {
  const total = req.query.total;
  console.log("backend recieve Amount:", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "INR",
  });
  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
