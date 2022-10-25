const { User, Thought } = require("../models");

module.exports = {
  // GET ALL THOUGHTS
  getThought(req, res) {
    Thought.find({})
      .then((thought) => res.status(200).json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // GET A SINGLE THOUGHT
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No Thought find with this ID!" })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // CREATE A THOUGHT
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          // PUSH CREATED THOUGHT _ID TO ASSOCIATED USER'S THOUGHTS ARRAY
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // UPDATE A THOUGHT
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE A THOUGHT
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought find with this ID!" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought deleted, but no user found'})
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => res.status(500).json(err));
  },
  // CREATE A REACTION
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought frind with ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE A REACTION
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought find with this ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};