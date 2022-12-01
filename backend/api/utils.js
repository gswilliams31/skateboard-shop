function requireUser(req, res, next) {

  if (!req.user) {

    next({
      error: "error",
      name: "MissingUserError",
      message: "You must be logged in to perform this action"
    });
    res.status(401)
  }
  next();
}

function requireAdmin(req, res, next) {

  if (!req.user.admin) {
    next({
      error: "Admin error",
      name: "NotAnAdmin",
      message: "Not Admin"
    });
    res.status(401)
  }
  next();
}

module.exports = {
  requireUser,
  requireAdmin
}