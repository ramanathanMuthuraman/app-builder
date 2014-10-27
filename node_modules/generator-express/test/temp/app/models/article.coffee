# Example model


module.exports = (sequelize, DataTypes) ->

  Article = sequelize.define 'Article',
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    text: DataTypes.STRING
