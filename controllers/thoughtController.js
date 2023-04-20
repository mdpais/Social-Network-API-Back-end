const { Thought, User } = require('../models');

// Get all thoughts 
function getThoughts(req, res) {
  Thought.find({})
    .then((thoughts) => res.status(200).json(thoughts))
    .catch((err) => res.status(500).json(err));
}

// Create a thought 
// {
//   "thoughtText": "Here's a cool thought...",
//   "username": "lernantino",
//   "userId": "5edff358a0fcb779aa7b118b"
// }
function createThought(req, res) {
  User.findById(req.body.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json( `User id not found! (${req.body.userId})` );
        return;
      } 
      Thought.create(req.body)
        .then((thought) => {  
          return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $addToSet: { thoughts: thought._id } },
              { new: true }
            )
          .populate({ path: "thoughts"});
        })
        .then((user) => {
          res.status(200).json({message: "Thought created, and attached to the user!", user: user});
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
}

// Get a single thought
function getSingleThought(req, res) {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) => {
      if (!thought) {
        res.status(404).json(`Thought id not found! (${req.params.thoughtId})`);
      } else {
        res.status(200).json(thought);
      }
    })
    .catch((err) => res.status(500).json(err));
}

// Update thought
function updateThought(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { new: true }
  )
    .then((thought) => {
      if (!thought) {
        res.status(404).json(`Thought id not found! (${req.params.thoughtId})`);
      } else {
        res.status(200).json({message: "Thought updated!", thought: thought});
      }
    })
    .catch((err) => res.status(500).json(err));
}

// Delete thought
function deleteThought(req, res) {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) => {
      if (!thought) {
        res.status(404).json(`Thought id not found! (${req.params.thoughtId})`);
      } else {
        res.status(200).json(`Thought deleted (${req.params.thoughtId})`);
      }
    })
    .catch((err) => res.status(500).json(err));
}

// Add a reaction to a thought
function createReaction(req, res) {
  Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true }
    )
    .then((thought) => {
      if (!thought) {
        res.status(404).json(`Thought id not found! (${req.params.thoughtId})`);
      } else {
        res.status(200).json({message: "Reaction added to the thought!", thought: thought});
      } 
    })
    .catch((err) => res.status(500).json(err));
}

// Remove a reaction from a thought
function deleteReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: {reactionId: req.params.reactionId } } },
    { new: true }
  )
    .then((thought) => {
      if (!thought) {
        res.status(404).json(`Thought id not found! (${req.params.thoughtId})`);
      } else {
        res.status(200).json({message: "reaction removed from the thought!", thought: thought});
      }
    })
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  getThoughts,
  createThought,
  getSingleThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
};