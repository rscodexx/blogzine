const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/connection');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

app.set('view engine', 'ejs');

app.use(session({
    secret: 'testing',
    cookie: {
        maxAge: 30000
    }
}));

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(() => {
        console.log('Conexão realizada com sucesso.')
    }).catch((error) => {
        console.log('Não foi possível se conectar ao banco de dados: '+error)
    });

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render('index', {
                articles,
                categories
            })
        })

    });
});

app.get('/view/:slug', (req, res) => {

    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug
        }
    }).then(article => {
        if(article !== undefined){

            Category.findAll().then(categories => {
                res.render('article', {
                    article,
                    categories,
                });
            })

        } else {
            res.redirect('/');
        }
    }).catch(() => {
        res.redirect('/')
    })
});

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug
        },
        include: [
            { model: Article }
        ]
    }).then(category => {

        if(category !== undefined){
            Category.findAll().then(categories => {
                res.render('index', {
                    articles: category.articles,
                    categories
                })
            })
        } else {
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/');
    })
})

app.listen(8080, () => {
    console.log('Server is running');
})
