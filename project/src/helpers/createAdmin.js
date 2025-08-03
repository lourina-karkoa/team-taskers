const { hash } = require("./argon2.helper");

const createAdmin = async (User, email, password) => {
    try {
        const isExist = await User.findOne({ role: "Manager" });
    
        if(isExist) {
            throw new Error("Manager is Existed")
        }
    
        const hashed = await hash(password);
    
        await User.create({ name: "Manager", email, password: hashed, role: "Manager" });
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = createAdmin