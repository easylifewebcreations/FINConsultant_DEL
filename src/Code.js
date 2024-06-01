// ************************************
// ************ HTML & URL ************
// ************************************
function doGet() {
  let output = HtmlService.createTemplateFromFile('Index')
  // let output = HtmlService.createTemplateFromFile('Main')
  const sess = GetSession()
  if (sess.LoggedIn) {
    output = HtmlService.createTemplateFromFile('Main')
  }

  return output.evaluate()
    .setTitle('FIN Consultant 2024')
    // .setFaviconUrl('https://sv1.picz.in.th/images/2023/04/18/mmBsC9.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    // .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function Include(_file) {
  return HtmlService.createHtmlOutputFromFile(_file).getContent()
}

function OpenPage(_pageName) {
  return HtmlService.createHtmlOutputFromFile(_pageName).getContent()
}

function GetUrl() {
  var url = ScriptApp.getService().getUrl()
  return url
}


// ************************************
// ************* SESSION **************
// ************************************

function SetSession(_session) {
  const sId = Session.getTemporaryActiveUserKey();
  const uProp = PropertiesService.getUserProperties();
  uProp.setProperty(sId, JSON.stringify(_session));
}

function GetSession() {
  const sId = Session.getTemporaryActiveUserKey();
  const uProp = PropertiesService.getUserProperties();
  const sData = uProp.getProperty(sId);
  return sData ? JSON.parse(sData) : { LoggedIn: false };
}

function RegisterSession(_userID, _username, _firstname, _lastname, _imageLH5, _level) {
  const sess = GetSession()
  sess.LoggedIn = true
  sess.UserID = _userID
  sess.Username = _username
  sess.Firstname = _firstname
  sess.Lastname = _lastname
  sess.ImageLH5 = _imageLH5
  sess.Level = _level
  SetSession(sess)
}

function RemoveSession() {
  const sId = Session.getTemporaryActiveUserKey()
  const uProp = PropertiesService.getUserProperties()
  const deleteAllProp = uProp.deleteAllProperties()
}

function DestroySession() {
  try {
    const sId = Session.getTemporaryActiveUserKey()
    const uProp = PropertiesService.getUserProperties()
    const deleteAllProp = uProp.deleteAllProperties()
    return true
  } catch (error) {
    throw new Error('DestroySession failed with error >> ' + error.message)
  }
}
