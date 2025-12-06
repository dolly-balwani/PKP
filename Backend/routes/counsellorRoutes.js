const express = require('express');
const router = express.Router();
const {
    createCounsellorProfile,
    getCounsellorByUserId,
    getAllCounsellors
} = require('../controllers/counsellorController');

router.post('/', createCounsellorProfile);
router.get('/', getAllCounsellors);
router.get('/:userId', getCounsellorByUserId);

module.exports = router;
