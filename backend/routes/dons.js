const express = require("express");
const router = express.Router();
const Don = require("../models/dons");
const User = require("../models/users");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configuration multer pour les images
const upload = multer({ dest: "/tmp" });

// Fonction pour calculer la distance entre deux points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en km
}

// GET - Récupérer tous les dons
router.get("/", async (req, res) => {
  const { latitude, longitude } = req.query;

  // Récupérer tous les dons
  const dons = await Don.find()
    .populate("user", "userName")
    .sort({ createdAt: -1 });

  if (dons) {
    // Si l'utilisateur a fourni sa position, calculer les distances
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);

      if (!isNaN(userLat) && !isNaN(userLon)) {
        const donsWithDistance = dons.map((don) => {
          const distance = calculateDistance(
            userLat,
            userLon,
            don.latitude,
            don.longitude
          );
          return {
            ...don.toObject(),
            distance: Math.round(distance * 10) / 10, // Arrondir à 1 décimale
          };
        });

        return res.json({ result: true, dons: donsWithDistance });
      }
    }

    // Sinon, retourner les dons sans distance
    res.json({ result: true, dons });
  } else {
    console.error("Erreur lors de la récupération des dons");
    res.status(500).json({ result: false, message: "Erreur serveur" });
  }
});

// POST - Créer un nouveau don
router.post("/", upload.single("image"), async (req, res) => {
  const { title, description, latitude, longitude, user } = req.body;

  // Vérifier les champs obligatoires
  if (!title || !description || !latitude || !longitude || !user) {
    return res.status(400).json({
      result: false,
      message: "Tous les champs sont obligatoires",
    });
  }

  // Vérifier si l'utilisateur existe
  let userId = user;
  if (typeof user === "string" && user.includes("@")) {
    const userDoc = await User.findOne({ email: user });
    if (!userDoc) {
      return res.status(400).json({
        result: false,
        message: "Utilisateur non trouvé",
      });
    }
    userId = userDoc._id;
  }

  // Upload de l'image sur Cloudinary si elle existe
  let imageUrl = null;
  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    if (uploadResult && uploadResult.secure_url) {
      imageUrl = uploadResult.secure_url;
    } else {
      return res.status(500).json({
        result: false,
        message: "Erreur lors de l'upload de l'image",
      });
    }
  }

  // Créer le don
  const newDon = new Don({
    title,
    description,
    image: imageUrl,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    user: userId,
  });

  const savedDon = await newDon.save();

  if (savedDon) {
    res.status(201).json({ result: true, don: savedDon });
  } else {
    console.error("Erreur lors de la création du don");
    res.status(500).json({ result: false, message: "Erreur serveur" });
  }
});

// GET - Récupérer un don par ID
router.get("/:id", async (req, res) => {
  const don = await Don.findById(req.params.id).populate("user", "userName");

  if (!don) {
    return res.status(404).json({
      result: false,
      message: "Don non trouvé",
    });
  }

  res.json({ result: true, don });
});

// PUT - Modifier un don
router.put("/:id", async (req, res) => {
  const { title, description, latitude, longitude } = req.body;

  if (!title || !description || !latitude || !longitude) {
    return res.status(400).json({
      result: false,
      message: "Tous les champs sont obligatoires",
    });
  }

  const updatedDon = await Don.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
    { new: true }
  );

  if (!updatedDon) {
    return res.status(404).json({
      result: false,
      message: "Don non trouvé",
    });
  }

  res.json({ result: true, don: updatedDon });
});

// DELETE - Supprimer un don
router.delete("/:id", async (req, res) => {
  const deletedDon = await Don.findByIdAndDelete(req.params.id);

  if (!deletedDon) {
    return res.status(404).json({
      result: false,
      message: "Don non trouvé",
    });
  }

  res.json({ result: true, message: "Don supprimé avec succès" });
});

module.exports = router;
