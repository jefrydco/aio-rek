'use strict'

import { types as notificationTypes } from '~/store/notification'

export default ({ store: { commit } }, inject) => {
  const notify = ({ isError, kind, message }) => {
    commit(`notification/${notificationTypes.SET_NOTIFICATION}`, {
      isError,
      kind,
      message
    })
  }
  inject('notify', notify)
}
