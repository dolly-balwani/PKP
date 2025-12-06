const Counsellor = require('../models/Counsellor');
const User = require('../models/User');

// @desc    Create or update counsellor profile
// @route   POST /api/counsellors
// @access  Private (should be, but public for now for simplicity/speed)
const createCounsellorProfile = async (req, res) => {
    const {
        userId,
        specializations,
        bio,
        qualifications,
        experienceYears,
        languages,
        availability
    } = req.body;

    // validation
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'counsellor') {
            return res.status(403).json({ message: 'User is not a counsellor' });
        }

        // Build profile object
        const profileFields = {
            user: userId,
            bio,
            experienceYears,
            specializations: specializations || [],
            qualifications: qualifications || [],
            languages: languages || [],
            availability: availability || {}
        };

        // Upsert (Create or Update)
        // Using findOneAndUpdate with upsert: true
        let counsellor = await Counsellor.findOneAndUpdate(
            { user: userId },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Mark user profile as complete
        if (!user.isProfileComplete) {
            user.isProfileComplete = true;
            await user.save();
        }

        res.json(counsellor);

    } catch (error) {
        console.error('Create Profile Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get counsellor profile by User ID
// @route   GET /api/counsellors/:userId
// @access  Public
const getCounsellorByUserId = async (req, res) => {
    try {
        const counsellor = await Counsellor.findOne({ user: req.params.userId }).populate('user', ['fullName', 'email', 'profileImage']);

        if (!counsellor) {
            return res.status(404).json({ message: 'Counsellor profile not found' });
        }

        res.json(counsellor);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all counsellors
// @route   GET /api/counsellors
// @access  Public
const getAllCounsellors = async (req, res) => {
    try {
        const counsellors = await Counsellor.find().populate('user', ['fullName', 'email', 'profileImage']);
        res.json(counsellors);
    } catch (error) {
        console.error('Get All Counsellors Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createCounsellorProfile,
    getCounsellorByUserId,
    getAllCounsellors
};
