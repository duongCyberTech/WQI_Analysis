const UserManagement = require('../service/users.service');

class UserController{
    async getUsers(req, res) {
        try {
            const email = req.query.email;
            const users = await UserManagement.getUsers(email);
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async verifyUser(req, res) {
        try {
            const email = req.body.email;
            const result = await UserManagement.verifyUser(email);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const result = await UserManagement.deleteUser(id);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UserController();