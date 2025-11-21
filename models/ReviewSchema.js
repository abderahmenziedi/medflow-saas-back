import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Populate user details on find
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// Calculate average rating
reviewSchema.statics.calculateAverageRating = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avRating: { $avg: "$rating" },
      },
    },
  ]);

  // Handle case when no reviews exist yet
  const numOfRating = stats.length > 0 ? stats[0].numOfRating : 0;
  const avRating = stats.length > 0 ? stats[0].avRating : 0;

  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: numOfRating,
    averageRating: avRating,
  });
};

// Recalculate rating after saving a review
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.doctor);
});

// Recalculate after deleting a review too (optional but recommended)
reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.doctor);
  }
});

export default mongoose.model("Review", reviewSchema);
