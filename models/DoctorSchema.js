import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },

  // Fields for doctors only
  specialization: { 
    type: String, 
    enum: ["cardiologue", "dentiste", "generaliste", "aide soignant"] 
  },
  qualifications: [{
    degree: { type: String },
    institute: { type: String },
    from: { type: Date },
    to: { type: Date }
  }],
  experiences: [{
    position: { type: String },
    hospital: { type: String },
    from: { type: Date },
    to: { type: Date }
  }],
  bio: { type: String, maxLength: 50 },
  about: { type: String },
  timeSlots: [{
    day: { type: String },
    startingTime: { type: String },
    endingTime: { type: String }
  }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

// Vérifie si le modèle existe déjà
const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;