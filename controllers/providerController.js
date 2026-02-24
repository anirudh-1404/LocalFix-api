import { Provider } from "../models/providerSchema.js";
import fs from "fs";

// Enroll Service Provider
export const enrollProvider = async (req, res) => {
    try {
        const {
            businessName, phone, dob, gender, primaryService, otherServices,
            additionalSkills, experience, serviceCategory, description,
            address, city, area, pincode, workingDays, workingHours,
            emergencyAvailability, idType, idNumber, email, ownerName
        } = req.body;

        const userId = req.user?.id || req.body.userId;

        // Check if provider already exists by email (even if no userId)
        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) {
            return res.status(400).json({ message: "An enrollment request with this email already exists" });
        }

        // Map files to specific fields (req.files is an object with fieldname keys when using upload.fields)
        const profilePhoto = req.files['profilePhoto']?.[0]?.path;
        const certification = req.files['certification']?.[0]?.path;
        const idImage = req.files['idImage']?.[0]?.path;

        const otherDocs = req.files['documents']?.map(file => ({
            name: file.originalname,
            path: file.path
        })) || [];

        const providerData = {
            email,
            ownerName,
            phone,
            dob,
            gender,
            profilePhoto,
            businessName,
            primaryService: (primaryService === "other" || !primaryService) ? null : primaryService,
            otherServices,
            additionalSkills: additionalSkills ? JSON.parse(additionalSkills) : [],
            experience,
            serviceCategory,
            description,
            certification,
            address,
            city,
            area,
            pincode,
            workingDays: workingDays ? JSON.parse(workingDays) : [],
            workingHours: workingHours ? JSON.parse(workingHours) : {},
            emergencyAvailability: emergencyAvailability === 'true',
            idProof: {
                idType,
                idNumber,
                idImage,
            },
            documents: otherDocs,
        };

        if (userId) {
            providerData.user = userId;
        }

        const provider = await Provider.create(providerData);

        res.status(201).json({
            message: "Enrollment request submitted successfully",
            success: true,
            data: provider,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Providers (Admin)
export const getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.find().populate("user", "name email");
        res.status(200).json({
            success: true,
            data: providers,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Provider by ID/User ID
export const getProviderProfile = async (req, res) => {
    try {
        const provider = await Provider.findOne({
            $or: [{ _id: req.params.id }, { user: req.params.id }]
        }).populate("user", "name email");

        if (!provider) {
            return res.status(404).json({ message: "Provider profile not found" });
        }

        res.status(200).json({
            success: true,
            data: provider,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Provider Profile
export const updateProviderProfile = async (req, res) => {
    try {
        const provider = await Provider.findOneAndUpdate(
            { user: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!provider) {
            return res.status(404).json({ message: "Provider profile not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            data: provider,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Enrollment Status (Admin)
export const updateProviderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const provider = await Provider.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        res.status(200).json({
            message: `Enrollment request ${status}`,
            success: true,
            data: provider,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Provider
export const deleteProvider = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        // Delete associated documents from storage
        provider.documents.forEach((doc) => {
            if (fs.existsSync(doc.path)) {
                fs.unlinkSync(doc.path);
            }
        });

        await Provider.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Provider profile and documents deleted successfully",
            success: true,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
