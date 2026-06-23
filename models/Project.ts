import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: false,
    },
    prompt: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: false, // Optional for new multi-page sites
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
      lowercase: true,
      trim: true,
    },
    customDomain: {
      type: String,
      required: false,
      trim: true,
    },
    domainVerified: {
      type: Boolean,
      default: false,
    },
    deploymentStatus: {
      type: String,
      enum: ["live", "paused", "draft"],
      default: "draft",
    },
    lastDeployedAt: {
      type: Date,
      required: false,
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
