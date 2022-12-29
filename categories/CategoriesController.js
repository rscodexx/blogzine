const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/admin/categories', (req, res) => {

    Category.findAll().then(categories => {
        res.render('admin/categories', {
            categories
        })
    })
})

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new');
});

router.post('/admin/categories/save', (req, res) => {
    let title = req.body.title;

    if(title !== undefined){
        Category.create({
            title,
            slug: slugify(title).toLowerCase()
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('admin/categories/new');
    }
});

router.post('/admin/categories/delete/:id', (req, res) => {
    let id = req.params.id;

    if(id !== undefined){

        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id
                }
            }).then(() => {
                res.redirect('/admin/categories');
            });

        } else {
            res.redirect('/admin/categories');
        }

    } else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', (req, res) => {

    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then(category => {
        if(category !== undefined){
            res.render('admin/categories/edit', {
                category
            });
        } else {
            res.redirect('/admin/categories');
        }
    }).catch(error => {
        res.redirect('/admin/categories');
    })
});

router.post('/admin/categories/update/:id', (req, res) => {
    let id  = req.params.id;
    let title = req.body.title;

    Category.update({
        title,
        slug: slugify(title).toLowerCase()
    }, {
        where: {
            id
        }
    }).then(() => {
        res.redirect('/admin/categories');
    })

})

module.exports = router;
