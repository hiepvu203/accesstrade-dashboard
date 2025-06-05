const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The campaign name is required!"],
    trim: true,
    minlength: [3, "The campaign name must be at least 3 characters long!"],
    maxlength: [150, "The campaign name must not exceed 150 characters!"],
  },
  category: {
    type: String,
    required: [true, "The category is required"],
    trim: true,
    enum: {
      values: ["thời trang", "công nghệ", "du lịch", "ẩm thực", "giáo dục", "sức khoẻ", "tài chính", "khác"],
      message: "The category is invalid",
    },
    default: "Other",
  },
  targetUrl: {
    type: String,
    required: [true, "The destination URL is required!"],
    trim: true,
    match: [
      /^(https?:\/\/[^\s$.?#].[^\s]*)$/,
      "Please enter a valid URL (starting with http or https)!)",
    ],
  },
  commission: {
    type: Number,
    required: [true, "The commission percentage is required"],
    min: [0, "The commission percentage must not be less 0!"],
    max: [100, "The commission percentage must not exceed 100 percentage!"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "The description must not exceed 500 characters!"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required!"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required!"],
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "End date must be after the start date!",
    },
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive", "expired"],
      message: "The status must be active, inactive or expired",
    },
    default: "inactive",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator id is required!"],
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model("Campaign", campaignSchema);