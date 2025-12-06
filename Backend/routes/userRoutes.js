const express = require('express');
const router = express.Router();
const { registerUser, getUserByFirebaseUid } = require('../controllers/userController');

router.post('/', registerUser);
router.get('/firebase/:uid', getUserByFirebaseUid);

module.exports = router;
