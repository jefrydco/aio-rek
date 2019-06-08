export default ({ store: { getters }, redirect }) => {
  if (!getters['user/isAuth']) {
    redirect({ name: 'index' })
  }
}
