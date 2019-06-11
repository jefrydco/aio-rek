'use strict'

const Controller = require('../base/Controller')

class SubjectController extends Controller {
  constructor() {
    super(SubjectController.name)
  }
}

module.exports = new SubjectController()
