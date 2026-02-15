import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        basePrice: {
            type: Number,
            required: true,
        },
        icon: {
            type: String, // String identifier or URL for an icon
            default: "Hammer",
        },
    },
    {
        timestamps: true,
    }
);

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
