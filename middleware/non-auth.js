export default ({ store, redirect }) => {
  if (!store.getters['user/isAuth']) {
    redirect({ name: 'index' })
  }
}
