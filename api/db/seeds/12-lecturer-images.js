const lecturerImages = require('../fixtures/lecturer-images.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('lecturer_images')
  await qb.del()
  return qb.insert(lecturerImages)
}
