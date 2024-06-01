function LoadSession() {
  const sess = GetSession()
  const result = {
    loggedInd: sess.LoggedIn,
    userID: sess.UserID,
    username: sess.Username,
    firstname: sess.Firstname,
    lastname: sess.Lastname,
    imageLH5: sess.Photo,
    level: sess.Level,
  }
  return JSON.stringify(result)
}
