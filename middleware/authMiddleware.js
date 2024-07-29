const setUserMiddleware = (req, res, next) => {
  // console.log("Authenticated User:", req.user); // Debugging line

  if (req.isAuthenticated()) {
    // Ensure that the user object is populated and set in res.locals
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }

  next();
};

module.exports = setUserMiddleware;
