const DefaultError = require('../errors/defaultError');

const cartKey = (session) => `cart:${session}`;
const expireCartTime = process.env.EXPIRE_CART_TIME || 1800; // in seconds

const getCart = async(req, res, redis) => {
  const { session } = req.params;

  const items = redis.hgetall(cartKey(session));
  res.json({ success: true, items });
};

const addCartItem = async(req, res, redis) => {
  const { session } = req.params;
  const { sku, quantity } = req.body;
  const key = cartKey(session);

  const result = await redis.hset(key, sku, quantity);

  // It was better that expire command runs with hset in only one command
  await redis.expire(key, expireCartTime);

  res.json({ success: !!result });
};

const updateCartItem = async(req, res, next, redis) => {
  const { session, item } = req.params;
  const { quantity } = req.body;
  const key = cartKey(session);

  const cartItem = await redis.hget(key, item);

  // Item found! Can update!
  if (cartItem) {
    const result = await redis.hmset(cartKey(session), item, quantity);
    res.json({ success: !!result });
  } else {
    next(DefaultError.notFound(req, 'Item not found'));
  }
};

const deleteCartItem = async(req, res, redis) => {
  const { session, item } = req.params;
  const result = await redis.hdel(cartKey(session), item);

  res.json({ success: !!result });
};

const clearCart = async(req, res, redis) => {
  const { session } = req.params;
  const result = await redis.del(cartKey(session));
  
  res.json({ success: !!result });
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
