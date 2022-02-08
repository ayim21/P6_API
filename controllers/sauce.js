const Sauce = require('../models/sauce');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');



exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce created' }))
    .catch(error => res.status(400).json({ error }));
};


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('ID unknown : ' + req.params.id)

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('ID unknown : ' + req.params.id)

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: 'Sauce not found' });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: '403: unauthorized request' });
      }
      const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : {
        ...req.body
      };
      //premier argument est l'objet de comparaison dont l'id est égal à celui envoyé dans les paramètres de la requête
      //deuxième argument est la nouvelle version de l'objet, il faut comme même préciser que l'id correspond à celui des paramètres
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce updated' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) //Pour vérifier s'il s'agit bien d'un MongoDB ObjectId
    return res.status(404).send('ID unknown : ' + req.params.id)
  //On récupère la Sauce dans la BDD pour vérifier qu'elle appartient bien à l'utilisateur qui effectue la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: 'Sauce not found' });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: '403: unauthorized request' });
      }
      //Si c'est bien l'utilisateur de cet objet, alors on supprime Sauce avec son fichier image
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) //on envoie uniquement l'id de Sauce, mais pas de l'utilisateur
          .then(() => res.status(200).json({ message: 'Sauce deleted' }))
          .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
};


exports.likeSauce = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id)

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Case like = 1
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $addToSet: { usersLiked: req.body.userId },
            likes: sauce.likes + req.body.like
          })
          .then(() => res.status(200).json({ message: 'Liked' }))
          .catch(error => res.status(400).json({ error }));
      } else if (req.body.like === 1 && sauce.usersLiked.includes(req.body.userId)) {
        return res.status(200).json({ message: "It's already liked" })
      } else if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId) && sauce.usersDisliked.includes(req.body.userId)) {
        return res.status(200).json({ message: "It's already disliked" })
      }
      //Case like = 0
      if (req.body.like === 0 && sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersLiked: req.body.userId },
            likes: sauce.likes - 1
          })
          .then(() => res.status(200).json({ message: 'Like Cancelled' }))
          .catch(error => res.status(400).json({ error }));
      } else if (req.body.like === 0 && sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersDisliked: req.body.userId },
            dislikes: sauce.dislikes - 1
          })
          .then(() => res.status(200).json({ message: 'Dislike Cancelled' }))
          .catch(error => res.status(400).json({ error }));
      } else if (req.body.like === 0 && !sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
        return res.status(400).json({ error: 'Please give a like or a dislike' })
      }
      //Case like = -1
      if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $addToSet: { usersDisliked: req.body.userId },
            dislikes: sauce.dislikes - req.body.like
          })
          .then(() => res.status(200).json({ message: 'Disliked' }))
          .catch(error => res.status(400).json({ error }));
      } else if (req.body.like === -1 && sauce.usersDisliked.includes(req.body.userId)) {
        return res.status(200).json({ message: "It's already disliked" })
      } else if (req.body.like === -1 && sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {
        return res.status(200).json({ message: "It's already liked" })
      }
    })
    .catch(error => res.status(500).send(error));
}