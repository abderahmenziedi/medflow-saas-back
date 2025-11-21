import Review  from '../models/ReviewSchema.js'
import Doctor from '../models/DoctorSchema.js'

export const getAllReviews = async (req, res) => {
    try{
        const reviews = await Review.find({});
        res.status(200)
        .json({success:true,message:"Successful",data:reviews});
    }catch(err){
        res.status(404)
        .json({success:false,message:"Not Found"});
    }
};

export const createReview = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const userId = req.userId;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        

        const newReview = new Review({
            ...req.body,
            doctor: doctorId,
            user: userId
        });

        const savedReview = await newReview.save();

        // Push review into doctor document
        doctor.reviews.push(savedReview._id);
        await doctor.save();

        res.status(201).json({ success: true, message: "Review submitted", data: savedReview });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
