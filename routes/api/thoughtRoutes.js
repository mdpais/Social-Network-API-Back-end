const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require('../../controllers/thoughtController.js');

// /api/thoughts
router.route('/thoughts').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/thoughts/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/thoughts/:thoughtId/reactions').post(createReaction);

// /api/thoughts/:thoughtId/reactionId
router.route('/thoughts/:thoughtId/:reactionId').delete(deleteReaction);

module.exports = router;
