var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const moment = require("moment");
require("moment/locale/fr");

// POST route de création de compte
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.status(400).json({ result: false, error: "Champ manquant" });
    return;
  }

  //vérification du format de l'email
  const patternMail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!patternMail.test(req.body.email)) {
    res.status(400).json({ result: false, error: "Email invalide" });
    return;
  }

  // Check si l'utilisateur existe déjà
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.status(200).json({ result: true, token: newDoc.token });
      });
    } else {
      // Si l'utilisateur existe déjà :
      res
        .status(401)
        .json({ result: false, error: "L'utilisateur existe déjà" });
    }
  });
});

// POST route de création de compte
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    return res.status(400).json({ result: false, error: "Champ manquant" });
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (!data) {
      return res
        .status(404)
        .json({ result: false, error: "Utilisateur non trouvé" });
    }
    if (!bcrypt.compareSync(req.body.password, data.password)) {
      return res
        .status(401)
        .json({ result: false, error: "Mauvais mot de passe" });
    }
    res.status(200).json({
      result: true,
      token: data.token,
      username: data.userName,
      prenom: data.firstName,
    });
  });
});

// POST pour ajouter les infos utilisateur de CreateProfile
router.post("/profile", (req, res) => {
  const {
    email,
    userName,
    firstName,
    lastName,
    phone,
    birthday,
    address,
    token,
  } = req.body;

  //vérification des champs
  if (
    !checkBody(req.body, [
      "email",
      "userName",
      "firstName",
      "lastName",
      "phone",
      "address",
      "birthday",
    ])
  ) {
    res.status(400).json({ result: false, error: "Champ manquant" });
    return;
  }

  // vérification du format de l'email
  const patternMail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!patternMail.test(email)) {
    res.status(401).json({ result: false, error: "Email invalide" });
    return;
  }

  //vérification du format du téléphone
  const patternTel = /(0|(\\+33)|(0033))[1-9][0-9]{8}/;
  if (!patternTel.test(phone)) {
    res
      .status(401)
      .json({ result: false, error: "Numéro de téléphone invalide" });
    return;
  }

  // update des infos utilisateurs si token trouvé
  User.findOne({ token: token }).then((data) => {
    if (data) {
      data.email !== email ? (data.email = email) : null;
      data.userName = userName;
      data.firstName = firstName;
      data.lastName = lastName;
      data.phone = phone;
      data.birthday = /*new Date(birthday) OU*/ new Date(
        moment.utc(birthday).startOf("day").toISOString()
      );
      data.address = {
        street: address.properties.name,
        postalCode: address.properties.postcode,
        city: address.properties.city,
        country: "France",
        location: {
          type: address.geometry.type,
          coordinates: address.geometry.coordinates,
        },
      };

      data.save().then((newDoc) => res.json({ result: true, user: newDoc }));

      // réponse si token non trouvé
    } else {
      res.status(404).json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

// GET pour récupérer les informations d'un utilisateur
router.get("/profile/:token", (req, res) => {
  const { token } = req.params;

  User.findOne({ token: token }).then((data) => {
    if (data) {
      res.json({ result: true, user: data });
      // console.log("User found", data)
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

// PUT pour update des infos user et modif mdp
router.put("/profile", (req, res) => {
  const {
    email,
    userName,
    firstName,
    lastName,
    phone,
    token,
    address,
    password,
    newPassword,
    birthday,
  } = req.body;
  console.log(req.body);

  //vérification des champs
  if (
    !checkBody(req.body, [
      "email",
      "userName",
      "firstName",
      "lastName",
      "phone",
      "token",
      "address",
      "birthday",
    ])
  ) {
    console.log(req.body);
    res.status(400).json({
      result: false,
      error: "Champ manquant",
    });
    return;
  }

  // vérification du format de l'email
  const patternMail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!patternMail.test(email)) {
    res.status(400).json({
      result: false,
      error: "format invalide",
    });
    return;
  }

  //vérification du format du téléphone
  const patternTel = /(0|(\\+33)|(0033))[1-9][0-9]{8}/;
  if (!patternTel.test(phone)) {
    res.status(400).json({
      result: false,
      error: "format invalide",
    });
    return;
  }

  // update des infos utilisateurs si token trouvé
  User.findOne({ token: token }).then((data) => {
    if (data) {
      data.email !== email ? (data.email = email) : null;
      data.userName = userName;
      data.firstName = firstName;
      data.lastName = lastName;
      data.phone = phone;
      data.birthday = new Date(birthday);
      data.address = {
        street: address.properties.name,
        postalCode: address.properties.postcode,
        city: address.properties.city,
        country: "France",
        location: {
          type: address.geometry.type,
          coordinates: address.geometry.coordinates,
        },
      };

      data
        .save()
        .then((newDoc) => res.status(200).json({ result: true, user: newDoc }));

      // réponse si token non trouvé
    } else {
      res.status(404).json({
        result: false,
        error: "Utilisateur non trouvé",
      });
    }
  });
  //en cas de modification du mot de passe:
  if (newPassword) {
    if (!checkBody(req.body, ["password", "newPassword"])) {
      res.status(400).json({
        result: false,
        error: "Champ manquant",
      });
      return;
    }

    // update du mot de passe si token trouvé
    User.findOne({ token: token }).then((data) => {
      if (data && bcrypt.compareSync(password, data.password)) {
        const hash = bcrypt.hashSync(newPassword, 10);
        data.password = hash;

        data.save().then(() => res.json({ result: true }));
      } else {
        res.status(404).json({
          result: false,
          error: "Utilisateur non trouvé ou mot de passe erroné",
        });
      }
    });
  }
});

// DELETE pour supprimer le compte utilisateur
router.delete("/profile", (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.status(401).json({ result: false, error: "token manquant" });
    return;
  }

  User.deleteOne({ token: token }).then((data) => {
    if (data) {
      res.status(200).json({ result: true, message: "utilisateur supprimé" });
    } else {
      res
        .status(400)
        .json({ result: false, error: "utilisateur inconnu dans bdd" });
    }
  });
});

module.exports = router;
