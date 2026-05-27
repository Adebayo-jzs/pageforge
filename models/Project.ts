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
    type: {
      type: String,
      enum: ["html", "react"],
      default: "html",
    },
    brandConfig: {
      type: Object,
      required: false,
    },
    layoutPlan: {
      type: Object,
      required: false,
    },
    files: [
      {
        path: String,
        content: String,
      }
    ],
    pages: {
      type: [
        {
          name: String,
          path: String,
          html: String,
          reactCode: String,
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

if (mongoose.models.Project) {
  delete mongoose.models.Project;
}
const Project = mongoose.model("Project", ProjectSchema);

export default Project;
