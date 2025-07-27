const { default: mongoose } = require("mongoose");
const paginate = require("../plugins/paginate");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { type: String, unique: true, required: true },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    role: { type: String, enum: ['TeamMember', 'Manager'], default: 'TeamMember' },
   
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {

    if (!this.image && this.name) {

        const firstLetter = this.name.charAt(0).toUpperCase();
        
        this.image = `https://via.placeholder.com/150/CCCCCC/FFFFFF?text=${firstLetter}`;

    }
    next(); 
});

userSchema.plugin(paginate)

const Users = mongoose.model("Users", userSchema)


module.exports = Users;