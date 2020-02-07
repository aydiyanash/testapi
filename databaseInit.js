'use strcit';

const { sequelize } = require('./models');


class Database {
    constructor(logging = true) {
        this.logging = logging;
    }

    async init() {
        await sequelize.authenticate();

        console.info('Sucessfully Connected to mySQL database ✅');

        return await sequelize.sync({
            logging: this.logging
        });
    }
}

module.exports = Database;