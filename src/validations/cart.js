const { body, param } = require('express-validator');

module.exports = {
  addItemRules: [param('session').not().isEmpty(), body('quantity').isInt({ gt: 0 }), body('sku').isInt()],
  updateItemRules: [param('session').not().isEmpty(), param('sku').isInt(), body('quantity').isInt({ gt: 0 })],
  deleteItemRules: [param('session').not().isEmpty(), param('sku').isInt()],
};
