
import bcrypt from "bcrypt";

class Security {
    static generatePasswordHash(password) {
        return bcrypt.hashSync(password, 10);
    }

    static validatePassword(password, candidate) {
        return bcrypt.compareSync(password, candidate);
    }
}

module.exports = Security;
