const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [
            {model: Category}
        ]
    }).then(articles => {
        res.render('admin/articles', {
            articles
        })
    })
});

router.get('/admin/articles/new', adminAuth, (req, res) => {

    Category.findAll().then(categories => {
        res.render('admin/articles/new', {
            categories
        });
    });
});

router.post('/admin/articles/save', adminAuth, (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.category;

    Article.create({
        title,
        slug: slugify(title).toLowerCase(),
        body,
        categoryId
    }).then(() => {
        res.redirect('/admin/articles')
    })

});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article !== undefined){

            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {
                    article,
                    categories,
                })
            })

        } else {
            res.redirect('/')
        }
    }).catch(() => {
        res.redirect('/')
    })
})

router.post('/admin/articles/update/:id', adminAuth, (req, res) => {
    let id = req.params.id;
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.category;

    Article.update({
        title,
        slug: slugify(title).toLowerCase(),
        body,
        categoryId
    }, {
        where: {
            id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(() => {
        res.redirect('/');
    })
})

router.post('/admin/articles/delete/:id', adminAuth, (req, res) => {
    let id = req.params.id;

    if(id !== undefined){

        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            });

        } else {
            res.redirect('/admin/articles');
        }

    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page === 1){
        offset = 0;
    } else {
        offset = (page - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset,
        order: [
            ['id', 'DESC']
        ],
    }).then(articles => {

        let next;

        next = offset + 4 < articles.count;

        let result = {
            page: Number(page),
            next,
            articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {
                result,
                categories,
            })
        });
    })

})

module.exports = router;
