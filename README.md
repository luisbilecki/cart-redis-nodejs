# Cart management with Redis in Node.JS

This repository contains an approach to store the customers' shopping cart in Redis. This approach was based in RedisLabs usage example ([see here](https://redislabs.com/ebook/part-1-getting-started/chapter-2-anatomy-of-a-redis-web-application/2-2-shopping-carts-in-redis/)) and another example ([Cart Management Service](http://alronz.github.io/Factors-Influencing-NoSQL-Adoption/site/Redis/Examples/Cart%20Management%20Service/)).

--------------

## Requirements

This app is not docker based, so you should install Node.js, in order to run the API server.

```
Node.js >= 10.x
Redis
```
--------------
## How to run

1. Run `yarn install` to install required dependencies for this project;

2. Create .env file using the provided template (.env.example);

3. Run API using:
```bash
    yarn start

    or

    node src/server.js
```

4. Run tests using the following command:
```bash
    yarn test
```

5. Linting can be checked using:
```bash
    yarn lint
```

--------------
## Rest API endpoints

The REST API endpoints is described below.


**Get Cart**
----
  Returns json data with cart items for user specified with session_id parameter.

* **URL**

  /carts/:session

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `session=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true, items: { <Item ID>: <Quantity>, ...} }`

* **Sample Call:**

  ```bash
    curl http://localhost:3000/carts/3713ae4a-b7de-42f6-934d-9a74ac233cd5
  ```

**Add Item to Cart**
----
  Add new item to the cart.

* **URL**

  /carts/:session/items

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `session=[string]`

* **Data Params**

  ```json
    {
      "itemId": "integer",
      "quantity": "integer",
    }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true }`
 
* **Error Response:**

  None

* **Sample Call:**

  ```bash
    curl -H "Content-Type: application/json" -X POST -d '{"itemId":900,"quantity":1}' http://localhost:3000/carts/3713ae4a-b7de-42f6-934d-9a74ac233cd5/items
  ```

**Update Cart Item**
----
  Update the quantity of an existent item on customer cart.

* **URL**

  /carts/:session/items/:itemId

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `session=[string]`
   `itemId=[integer]`

* **Data Params**

  ```json
    {
      "quantity": "integer",
    }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```
      {
        "status": 404,
        "error": "Not Found",
        "message": "Item not found",
        "path": "/3713ae4a-b7de-42f6-934d-9a74ac233cd5/items/929",
        "timestamp": 1578089747041
      }
    ```

* **Sample Call:**

  ```bash
    curl -H "Content-Type: application/json" -X PUT -d '{"quantity":3}' http://localhost:3000/carts/3713ae4a-b7de-42f6-934d-9a74ac233cd5/items/929
  ```

**Delete Item from Cart**
----

Delete one item from customer cart.

* **URL**

  /carts/:session/items/:itemId

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `session=[string]`
   `itemId=[integer]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true }`

* **Sample Call:**

  ```bash
    curl -X DELETE http://localhost:3000/carts/3713ae4a-b7de-42f6-934d-9a74ac233cd5/items/5455
  ```

**Clear All Cart Items**
----

Delete all items from customer cart.

* **URL**

  /carts/:session

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:** 
   
   `session=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true }`

* **Sample Call:**

  ```bash
    curl -X DELETE http://localhost:3000/carts/3713ae4a-b7de-42f6-934d-9a74ac233cd5
  ```

--------------
### Notes

* The style of describe endpoints in this file was based on following gist (https://gist.github.com/iros/3426278);
