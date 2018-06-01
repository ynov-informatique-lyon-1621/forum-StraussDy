const Sequelize = require('sequelize');

function defineComment(database) {
    const Comment = database.define('comment', {
        content: {
            type: Sequelize.TEXT
        }
    });
    Comment.associate = ({ Question, User }) => {
        Comment.belongsTo(Question);
        Comment.belongsTo(User);
    };
    return Comment;
}

module.exports = defineComment;
