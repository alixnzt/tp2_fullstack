'use strict';
module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define('Author', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING
    }, {});
    Author.associate = function (models) {
        // associations can be defined here
    };
    return Author;
};