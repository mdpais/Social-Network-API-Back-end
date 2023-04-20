const { User, Thought } = require("../models");

// Get all users
function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
}

// Create a user
//   example data:
//   {
//     "username": "lernantino",
//     "email": "lernantino@gmail.com"
//   }

function createUser(req, res) {
  User.create(req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
}

// Get a single user
function getSingleUser(req, res) {
  User.findOne({ _id: req.params.userId })
    .populate({ path: "thoughts" })
    .populate({ path: "friends"})
    .then((user) => {
      if (!user) {
        res.status(404).json(`User id not found! (${req.params.userId})`);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => res.status(500).json(err));
}

// Update user
function updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: req.body },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).json(`User id not found! (${req.params.userId})`);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => res.status(500).json(err));
}

// Delete user
function deleteUser(req, res) {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).json(`User id not found! (${req.params.userId})`);
        return;
      }
      Thought.deleteMany({ _id: { $in: user.thoughts } })
        .then(() => res.status(200).json(`User and associated thoughts deleted`))
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
}

// Add a friend to a user
function addFriend(req, res) {
  User.findOne({ _id: req.params.friendId })
    .then((friend) => {
      if (!friend) {
        res.status(404).json(`Friend id not found (${req.params.friendId})`);
        return;
      } 
      User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { new: true }
        )
        .populate({path: "friends"})
        .then((user) => {
          if (!user) {
            res.status(404).json(`User id not found! (${req.params.userId})`);
            return;
          } 
          res.status(200).json(user);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
}

// Remove a friend from a user
function removeFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).json(`User id not found! (${req.params.userId})`);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  getUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};
