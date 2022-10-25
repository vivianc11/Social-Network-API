const { User, Thought } = require("../models");

module.exports = {
  // GETTING ALL USERS
  getUser(req, res) {
    User.find({})
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json(err));
  },
  // GETTING SINGLE USER
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with that ID!" })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // CREATING A USER
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // UPDATING A USER
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETING A USER AND ASSOCIATED THOUGHTS
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // ADDING A FRIEND
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETING A FRIEND
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "No User find with this ID!" })
            : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};