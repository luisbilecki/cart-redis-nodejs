const { body, param } = require('express-validator');

module.exports = {
  addItemRules: [body('quantity').isInt({ gt: '1'}), body('sku').isInt()],
  updateItemRules: [param('sku').isInt(), body('quantity').isInt({ gt: '1'})],
  deleteItemRules: [param('sku').isInt()],
};
