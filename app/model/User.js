/**
 * Created by vslimit on 2017/9/10.
 */
const db = require('../util/db');
const crypto = require('crypto');
const uuid = require('node-uuid');

const User = db.defineModel('users', {
    name: {
        type: db.STRING(),
        allowNull: true
    },
    email: {
        type: db.STRING(),
        unique: true,
        allowNull: true
    },
    password: db.VIRTUAL(),
    mobile: {
        type: db.STRING(),
        unique: true
    },
    provider: db.STRING(),
    hashed_password: db.STRING(),
    salt: db.STRING(),
    auth_token: {
        type: db.STRING(),
        allowNull: true
    },
    access_token: {
        type: db.STRING(),
        allowNull: true
    }

});

User.beforeValidate(function (user) {
    if (user.isNewRecord) {
        let salt = this.methods.makeSalt();
        user.set('salt', salt);
        user.set('hashed_password', this.methods.encryptPassword(user.password, salt));
    }
});

User.afterCreate(function (user) {
    console.log(JSON.stringify(user));
    user.access_token = this.methods.makeAccessToken(user.id);
    console.log(user.access_token);
    user.save();
});

User.methods = {
    authenticate: function (password, salt, hashed_password) {
        return this.encryptPassword(password, salt) === hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password, salt) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeAccessToken: function (id) {
        return crypto
            .createHmac('sha1', id.toString())
            .update(uuid.v4() + Date.now())
            .digest('hex');
    },

   load: function (condition) {
        return User.findOne({where: condition});
    },

    count: function (condition) {
        return User.count({where: condition});
    },
};

module.exports = User;