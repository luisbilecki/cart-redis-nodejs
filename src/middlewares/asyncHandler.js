module.exports = (f) => {
  return (req, res, next) => {
    (
      async() => {
        try {
          await f(req, res, next);
        } catch(err) {                    
          next(err);
        }
      }
    )();
  };
};
