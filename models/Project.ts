import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: false, // Optional for new multi-page sites
    },
    pages: {
      type: [
        {
          name: String,
          path: String,
          html: String,
        },
      ],
      required: false, // Optional for older single-page sites
    },
    provider: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
