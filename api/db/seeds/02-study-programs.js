const studyPrograms = require('../fixtures/study-programs.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('study_programs')
  await qb.del()
  return qb.insert(studyPrograms)
}
