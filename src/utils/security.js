
import bcrypt from "bcrypt";
import _trim from "lodash/trim";

class Security {
    static generatePasswordHash(password, option = 10) {
        return bcrypt.hashSync(_trim(password), option);
    }

    static validatePassword(password, candidate) {
        return bcrypt.compareSync(password, candidate);
    }
}

module.exports = Security;
