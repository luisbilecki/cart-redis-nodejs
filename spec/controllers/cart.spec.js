const request = require('supertest');
const uuid = require('uuid/v4');

const app = require('../../src/server');
const redisInstance = require('../../src/services/redis');

const getSession = () => uuid();

const cartKey = (session) => `cart:${session}`;

describe('Cart Controller', () => {
  describe('GET /carts/:session', () => {
    it('should return empty items for new cart', (done) => {
      request(app)
        .get(`/carts/${getSession()}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(result => {
          expect(result.status).toEqual(200);
          expect(result.body.success).toBeTruthy();
          expect(result.body.items).toEqual({});

          done();
        });
    });

    it('should return cart items', async() => {
      // Fake data
      const sessionId = getSession();
      await addCartItem(sessionId, 9000, 1);

      const result = await request(app)
        .get(`/carts/${sessionId}`)
        .set('Accept', 'application/json');

      expect(result.status).toEqual(200);
      expect(result.body.success).toBeTruthy();
      expect(result.body.items).toEqual({
        '9000': '1',
      });
    });
  });

  describe('POST /carts/:session/items', () => {
    it('should return 400 with invalid data', () => {
      return request(app)
        .post(`/carts/${getSession()}/items`)
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('should return success true when item is inserted', async() => {
      const sessionId = getSession();
      const result = await request(app)
        .post(`/carts/${sessionId}/items`)
        .send({
          itemId: 9000,
          quantity: 1,
        })
        .set('Accept', 'application/json');
      
      const cartItem = await redisInstance.hget(cartKey(sessionId), 9000);
      expect(result.status).toEqual(200);
      expect(result.body.success).toBeTruthy();
      expect(cartItem).toBeDefined();
      expect(cartItem).toEqual('1');
    });
  });

  describe('PUT /carts/:session/items/:itemId', () => {
    it('should return 400 with invalid itemId in path', () => {
      return request(app)
        .put(`/carts/${getSession()}/items/abc`)
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('should return 400 with invalid quantity', () => {
      return request(app)
        .put(`/carts/${getSession()}/items/145`)
        .send({ quantity: 0 })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('should do not update when item not exists', async() => {
      const sessionId = getSession();
      await addCartItem(sessionId, 9100, 3);

      const result = await request(app)
        .put(`/carts/${sessionId}/items/9150`)
        .send({ quantity: 5 })
        .set('Accept', 'application/json');
      
      expect(result.status).toEqual(404);
      expect(result.body.error).toEqual('Not Found');
    });

    it('should update item quantity', async() => {
      const sessionId = getSession();
      await addCartItem(sessionId, 9100, 3);

      const result = await request(app)
        .put(`/carts/${sessionId}/items/9100`)
        .send({ quantity: 5 })
        .set('Accept', 'application/json');
      const customerItem = await redisInstance.hget(cartKey(sessionId), 9100);

      expect(result.status).toEqual(200);
      expect(result.body.success).toBeTruthy();
      expect(customerItem).toEqual('5');
    });    
  });

  describe('DELETE /carts/:session/items/:itemId', () => {
    it('should delete item from cart', async() => {
      const sessionId = getSession();
      await addCartItem(sessionId, 9100, 3);
      await addCartItem(sessionId, 9300, 2);

      const result = await request(app)
        .delete(`/carts/${sessionId}/items/9100`)
        .set('Accept', 'application/json');
      const customerCart = await redisInstance.hgetall(cartKey(sessionId));

      expect(result.status).toEqual(200);
      expect(result.body.success).toBeTruthy();
      expect(customerCart).toEqual({
        '9300': '2'
      });
    });

    it('should return success false with unknown itemId', (done) => {
      request(app)
        .delete(`/carts/${getSession()}/items/9100`)
        .set('Accept', 'application/json')
        .then(result => {
          expect(result.status).toEqual(200);
          expect(result.body.success).toBeFalsy();
          done();
        });
    });

    it('should return 400 when itemId is not integer', () => {
      return request(app)
        .delete(`/carts/${getSession()}/items/invalid-itemId`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

    });
  });

  describe('DELETE /carts/:session', () => {
    it('should clear customer cart', async() => {
      // Add item on cart
      const sessionId = getSession();
      await addCartItem(sessionId, 9100, 3);

      const result = await request(app)
        .delete(`/carts/${sessionId}`)
        .set('Accept', 'application/json');
      const customerCart = await redisInstance.hgetall(cartKey(sessionId));

      expect(result.status).toEqual(200);
      expect(result.body.success).toBeTruthy();
      expect(customerCart).toEqual({});
    });
  });
});

const addCartItem = (cartId, itemId, quantity) => {
  return redisInstance.hset(cartKey(cartId), itemId, quantity);
};
