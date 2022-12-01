const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const { createUser, getUserById, getUserByUsername } = require('../db/users');
const { requireUser } = require('./utils')

const usersRouter = express.Router();

usersRouter.post('/register', async (req, res, next) => {

    const { username, password, birthday, admin } = req.body;

    try {

        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: 'UserExistsError',
                message: "Username is already taken",
                error: "error",
            });
        }

        if (password.length < 8) {
            res.send({
                name: "Password too short",
                message: "Password must be at least 8 characters long",
                error: "error",
            })
        }

        if (birthday.length = 0) {
            res.send({
                name: "Birthday Error",
                message: "Please submit a valid birthday",
                error: "error",
            })
        }

        const user = await createUser({
            username,
            password,
            birthday,
            admin
        });

        const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);

        res.send({
            message: "thank you for signing up",
            token,
            user,
        });

    } catch ({ name, message, error }) {
        next({ name, message, error })
    }
})

usersRouter.post('/login', async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {

        const user = await getUserByUsername(username);
        const hashedPassword = user.password;
        const isValid = await bcrypt.compare(password, hashedPassword)

        if (user && isValid) {

            const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '1w' });
            res.send({ message: "you're logged in!", user, token });

        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }

    } catch (error) {
        next(error);
    }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {

    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    try {
        if (auth.startsWith(prefix)) {

            const token = auth.slice(prefix.length)
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                req.user = await getUserById(id);
                res.send(req.user);
            }
        } else { res.status(401) }
    }
    catch (error) {
        next(error);
    }
});

module.exports = usersRouter;