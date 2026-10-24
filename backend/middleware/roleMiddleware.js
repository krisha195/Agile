const authorize = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.role;

  if (!role) return res.status(401).json({ message: 'Not authenticated' });

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  next();
};

module.exports = { authorize };