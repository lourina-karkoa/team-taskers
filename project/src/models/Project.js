const mongoose = require("mongoose");
const paginate = require("../plugins/paginate");


const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim:true,
    unique:true,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, {
  timestamps: true
});


projectSchema.plugin(paginate);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
