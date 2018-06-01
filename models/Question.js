const Sequelize = require('sequelize');

function defineQuestion(database) {
    const Question = database.define('question', {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        },
        resolu: {
            type: Sequelize.DATE
        },

    });
    Question.associate = ({ User, Comment }) => {
        Question.belongsTo(User);
        Question.hasMany(Comment);
    };
    return Question;
}

module.exports = defineQuestion;
