const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
//Pour sécuriser toutes les routes
const auth = require('../middleware/auth');
//Pour gérer les images
const multer = require('../middleware/multer-config');


//Routes CRUD des sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);


//Route pour les likes et dislikes
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;