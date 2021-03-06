const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool }= require('pg');

// node-postgres
const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryStr = `
    SELECT users.*
      FROM users 
      WHERE email = $1
  `;
  return pool.query(queryStr, [email])
    .then(res => res.rows[0])
    .catch(err => console.log(err.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryStr = `
  SELECT users.*
    FROM users 
    WHERE id = $1
`;
return pool.query(queryStr, [id])
  .then(res => res.rows[0])
  .catch(err => console.log(err.stack));
}
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const queryStr = `
    INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
  `;
  return pool.query(queryStr, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(err => console.log(err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryStr = `
  SELECT properties.*, res.*, avg(rating) AS average_rating 
    FROM properties
    JOIN property_reviews AS reviews
    ON reviews.property_id = properties.id
    JOIN reservations AS res
    ON res.property_id = reviews.property_id
    JOIN users
    ON reviews.guest_id = users.id
    WHERE res.guest_id = $1
    AND end_date < now()::date
    GROUP BY properties.id, res.id
    ORDER BY start_date
    LIMIT $2
  `;
  return pool.query(queryStr, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => console.log(err.stack));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryStr = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
    FROM properties
    FULL OUTER JOIN property_reviews ON properties.id = property_reviews.property_id
  `;
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryStr += `WHERE city LIKE $${queryParams.length}`;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryStr += `AND owner_id = $${queryParams.length}`;
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryStr += `AND cost_per_night >= $${queryParams.length}`;
    queryParams.push(options.maximum_price_per_night * 100);
    queryStr += `AND cost_per_night <= $${queryParams.length}`;
  }
  queryStr += `GROUP BY properties.id `;
  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryStr += `HAVING avg(rating) >= $${queryParams.length}`;
  }
  queryParams.push(limit);
  queryStr +=  `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  return pool.query(queryStr, queryParams)
    .then(res => res.rows)
    .catch(err => err.stack);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  let attrStr = '';
  let costStr = '';
  let propertyValues = [];
  for (let [key, value] of Object.entries(property)) {
    if (value && key !== 'owner_id') {
      attrStr += (key + ', ');
      propertyValues.push(value);
    } else if (value) {
      attrStr += key;
      propertyValues.push(value);
    } else attrStr += '';
  }
  propertyValues.forEach((e, index) => {
    if (index !== propertyValues.length - 1) costStr += (`$${index + 1} ,`);
    else costStr += `$${index + 1}`;
  });
  const queryStr = `
    INSERT INTO properties (${attrStr})
    VALUES (${costStr})
    RETURNING *;
  `;
  return pool.query(queryStr, propertyValues)
    .then(res => res.rows)
    .catch(err => console.log(err));
}
exports.addProperty = addProperty;