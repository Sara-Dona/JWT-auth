require("dotenv").config();
require("./config/database").connect();
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES

app.post("/register", async (req, res) => {
  // Recupérer le user input
  try {
    const { name, lastName, email, password } = req.body;
    // Valider le user input
    if (!(name && lastName && email && password)) {
      return res.status(400).send({
        success: false,
        message: "All input are required",
      });
    }

    // Valider si le user existe déja
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists, please login",
      });
    }
    // Hashé le mdp
    const hashedPassword = await bcrypt.hash(password, 10);
    // Creer le user donc le SAVE
    const user = await User.create({
      name,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Mettre le JWT
    const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    user.token = token;
    return res.status(200).send({
      success: true,
      message: "Un User a bien étais enregistrer",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
/* -----------------LOGIN________________________ */

app.post("/login", async (req, res)=>{
    try {
        // On recupere l'email et le password du req
        const { email, password} = req.body
        if(!(email && password)){
            return res.status(400).send({
                success: false, 
                message: "All input are required"
            });
        }
        // on trouve le user en fct de email
        const user = await User.findOne({email})
        //si ya pas user:
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign({user_id: user.id, email}, process.env.TOKEN_KEY, {expiresIn: "2h"})
            user.token = token;
            return res.status(200).send({
                success: true,
                message: "Le user a  été Trouvé",
                user
            })
        }
        // om compare le password avec celui hashé
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = app;