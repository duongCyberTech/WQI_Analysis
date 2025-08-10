const AuthService = require("../service/auth.Service");

class AuthController {
    async postLogin(req, res) {
        const { email, password } = req.body;
        try {
            const user = await AuthService.login(email, password);
            if (user) {
                return res.status(200).json({ message: "Login successful", user });
            } else {
                return res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }
}
module.exports = new AuthController();