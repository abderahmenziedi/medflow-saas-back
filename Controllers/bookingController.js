import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Stripe from "stripe";


export const getcheckoutSession = async (req, res) => {
    try {
        // Validate doctor and user existence
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({success: false, message: "Doctor not found"});
        }
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        // Validate required doctor fields
        if (!doctor.ticketPrice) {
            return res.status(400).json({success: false, message: "Doctor ticket price is missing"});
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Prepare product data with fallbacks for optional fields
        const productData = {
            name: doctor.name || 'Medical Consultation',
            description: doctor.bio || 'Consultation with medical professional',
        };
        
        // Only add images if they exist and are valid URLs
        if (doctor.photo && doctor.photo.startsWith('http')) {
            productData.images = [doctor.photo];
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
           
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor._id}`,
            customer_email: user.email,
            client_reference_id: req.params.doctorId,
             line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(doctor.ticketPrice * 100),
                        product_data: productData,
                    },
                    quantity: 1,
                },
            ],
        });

        const booking = await Booking.create({
            doctor: doctor._id,
            user: user._id,
            ticketPrice: doctor.ticketPrice,
            session: session.id,
        });

        await booking.save();

        res.status(200).json({success: true, message: "Payment session created successfully", session});

    } catch (error) {
        console.log('Stripe payment error:', error);
        res.status(500).json({success: false, message: "Payment session creation failed", error: error.message});
    }
};
