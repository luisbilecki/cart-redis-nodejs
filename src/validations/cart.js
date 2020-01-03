const { body, param } = require('express-validator');

module.exports = {
  addItemRules: [body('quantity').isInt({ gt: 0 }), body('sku').isInt()],
  updateItemRules: [param('sku').isInt(), body('quantity').isInt({ gt: 0 })],
  deleteItemRules: [param('sku').isInt()],
};
