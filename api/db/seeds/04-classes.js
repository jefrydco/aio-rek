const classes = require('../fixtures/classes.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('classes')
  await qb.del()
  return qb.insert(classes)
}
