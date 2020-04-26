const studentImages = require('../fixtures/student-images.json')

exports.seed = async function (knex, Promise) {
  const qb = knex('student_images')
  await qb.del()
  return qb.insert(studentImages)
}
