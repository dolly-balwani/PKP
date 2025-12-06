const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    counsellor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Linking to the User document of the counsellor
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    durationMinutes: {
        type: Number,
        default: 60
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    },
    meetingLink: {
        type: String // Google Meet or Zoom link
    },
    notes: {
        type: String // Private notes or session summary
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying of a counsellor's schedule
AppointmentSchema.index({ counsellor: 1, scheduledAt: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
