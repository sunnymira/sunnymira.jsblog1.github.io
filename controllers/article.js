const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
    createGet: function (req, res) {
        res.render('article/create');
    },
    createPost: function (req, res) {
        let articleArgs = req.body;

        let errorMsg = '';
        if(!req.isAuthenticated()) {
            errorMsg = 'You must be logged to create articles.';
        } else if(!articleArgs.title) {
            errorMsg = 'Invalid title!';
        } else if(!articleArgs.content) {
            errorMsg = 'Invalid content!';
        }

        if(errorMsg) {
            res.render('article/create', {
                error: errorMsg,
                title: articleArgs.title,
                content: articleArgs.content
            });
            return;
        }

        articleArgs.authorId = req.user.id;

        Article
            .create(articleArgs)
            .then(article => {
                res.redirect('/');
            });
    },
    details: function (req, res) {
        let articleId = req.params.id;

        Article
            .findById(articleId, {
                include: [{
                    model: User
                }]
            })
            .then(article => {
                res.render('article/details', article.dataValues)
            });
    }
};