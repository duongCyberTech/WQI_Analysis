const client = require('../../database/database.js');

class AuthService {
    async login(email, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
            client.query(sql, [email, password], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
module.exports = new AuthService();