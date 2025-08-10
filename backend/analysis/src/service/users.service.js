const pool = require("../config/db.js");

class UserManagement{
    async getUsers(email) {
        let query = "SELECT * FROM users";
        if (email) {
            query += " WHERE email = ?";
            const rows = await pool.query(query, [email]);
            return rows[0];
        }
        const rows = await pool.query("SELECT * FROM users");
        return rows[0];
    }

    async verifyUser(email) {
        await pool.query("UPDATE users SET verified = true WHERE email = ?", [email]);
        return { message: "User verified successfully" };
    }

    async deleteUser(id) {
        await pool.query("DELETE FROM users WHERE id = ?", [id]);
        return { message: "User deleted successfully" };
    }
}

module.exports = new UserManagement();