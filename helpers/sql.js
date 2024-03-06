const { BadRequestError } = require("../expressError");

/**
 * Aids in creating SET clause for SQL UPDATE statements.
 * 
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

/**
 * Generates a SET clause for SQL UPDATE statements.
 *
 * @param {Object} dataToUpdate - Data to be updated.
 * @param {Object} jsToSql - Mapping of JS property names to SQL column names.
 * @throws {BadRequestError} Throws an error if no data is provided.
 * @returns {Array} Array of strings representing the SET clause.
 * @example
 * const setClause = sqlForPartialUpdate({ firstName: 'Aliya', age: 32 }, { firstName: 'first_name' });
 * // Returns: ['"first_name"=$1', '"age"=$2']
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
