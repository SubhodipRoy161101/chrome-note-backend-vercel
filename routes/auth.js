const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser");

const router = express.Router();

const JWT_SECRET = "NdtCM93pQD";

router.post(
  "/",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ email: "Already Exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create new user
      user = await User.create({
        email: req.body.email,
        password: secPass,
        name: req.body.name,
      });
      // .then((user) => res.json(user))
      // .catch((err) => res.json({ error: "Email Already Exist" }));
      const data = {
        user: {
          id: User.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({ authToken });
    } catch (error) {
      res.status(500).send("Some error occoured");
    }
  }
);

//create authentication endpoint /auth/login. No login required.
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password can not be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      console.log("Entered Try");
      console.log(email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log("User Dosen't Exist");
        return res
          .status(400)
          .json({ error: "Please Enter Valid Credentials" });
      }
      console.log("User Exists");
      const passCmp = await bcrypt.compare(password, user.password);
      console.log(passCmp);
      if (!passCmp) {
        return res
          .status(400)
          .json({ error: "Please Enter Valid Credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({ authToken });
    } catch (error) {
      res.status(500).send("Some error occoured");
    }
  }
);

// Get logged in user details using POST: api/auth/getdetails . Login Required.
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Some error occoured");
  }
});
module.exports = router;
