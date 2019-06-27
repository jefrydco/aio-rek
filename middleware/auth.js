export default ({
  store: {
    getters,
    state: {
      user: { user }
    }
  },
  redirect
}) => {
  if (getters['user/isAuth']) {
    const { role } = user
    if (role === 'admin') {
      redirect({ name: 'admin' })
    } else if (role === 'device') {
      redirect({ name: 'device' })
    }
  }
}
