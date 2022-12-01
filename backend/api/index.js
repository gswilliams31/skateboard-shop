const express = require('express');
const apiRouter = express.Router();
const { JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')
const { getUserById } = require('../db/users.js')

apiRouter.get('/health', (req, res, next) => {

    try {
        let response = { message: 'all is well' }
        res.send(response)

    } catch (error) {
        console.error
        throw error
    }
    next()
});

apiRouter.use(async (req, res, next) => {

    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {

        next();

    } else if (auth.startsWith(prefix)) {

        const token = auth.slice(prefix.length)

        try {

            const { id } = jwt.verify(token, JWT_SECRET)
            if (id) {

                req.user = await getUserById(id);
                console.log(req.user)
                next();
            }

        } catch ({ name, message }) {
            next({ name, message })
        }

    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        })
    }
})

apiRouter.use((req, res, next) => {

    if (req.user) {
        console.log('user is set:', req.user)
    }
    next()
})




const productsRouter = require('./productsRouter');
apiRouter.use('/products', productsRouter);

const reviewsRouter = require('./reviewsRouter');
apiRouter.use('/reviews', reviewsRouter);

const usersRouter = require('./usersRouter');
apiRouter.use('/users', usersRouter);

const cartRouter = require('./cartRouter');
apiRouter.use('/cart', cartRouter);

apiRouter.use("*", async (req, res) => {
    await res.status(404).send({
        message: 'Not a valid url'
    })
});

apiRouter.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message,
        error: error.error
    });
});

module.exports = apiRouter;