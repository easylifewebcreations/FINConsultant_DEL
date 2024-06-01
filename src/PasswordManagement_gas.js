function ChangePassword(_jsonData) {
  // Get json data
  const data = JSON.parse(_jsonData)
  const dataID = data.dataID
  const username = data.username
  const oldPassword = data.oldPassword
  const newPassword = data.newPassword
  // Set result variable
  let result = Lib_wss.ResultInit(false)
  // Spreadsheet & folder
  const sheetInfo = GetSheetInfo(SHEET_USER_DETAILS)
  if (sheetInfo) {
    const spreadsheetID = sheetInfo.spreadsheetID
    const sheetName = sheetInfo.sheet
    // const keyHeader = sheetInfo.keyHeader
    // Read item
    const herders = GetHeaders(sheetName)
    const criteriaObj = [
      { header: sheetInfo.keyHeader, value: dataID }
    ]
    const readItem = Lib_wss.ReadItem(spreadsheetID, sheetName, criteriaObj)
    if (readItem) {
      // ******************** Found item ********************
      // Set values for update
      const item = readItem.item
      let oldPasswordEncode = Lib_wss.EncodeSignin(username, oldPassword)
      if (item.Password === oldPasswordEncode) {
        item.Password = Lib_wss.EncodeSignin(username, newPassword)
        item.ForceReset = NO
        // Update data
        const updateItem = Lib_wss.UpdateItem(spreadsheetID, sheetName, herders, criteriaObj, item)
        if (updateItem) {
          // ******************** Updata success ********************
          result.state = true
          result.message = PROCESS_MSG_SAVE_SUCCESS
        } else {
          // ******************** Update failure ********************
          result.state = false
          result.message = PROCESS_MSG_SAVE_FAILURE
        }
      } else {
        // ******************** Password is wrong ********************
        result.state = false
        result.message = SIGNINOUT_MSG_PASSWORD_WRONG
      }
    } else {
      // ******************** Not found item ********************
      result.state = false
      result.message = PROCESS_MSG_READ_FAILURE
    }
  } else {
    // ******************** In-correct data ********************
    result.state = false
    result.message = PROCESS_MSG_OTHERWISE
  }
  // Return
  return JSON.stringify(result)
}


function ForceResetPassword(_jsonData) {
  // Get json data
  const data = JSON.parse(_jsonData)
  // const sheet = data.sheet
  const dataID = data.dataID
  // Set result variable
  let result = Lib_wss.ResultInit(false)
  // Spreadsheet & folder
  const sheetInfo = GetSheetInfo(SHEET_USER_DETAILS)
  if (sheetInfo) {
    const spreadsheetID = sheetInfo.spreadsheetID
    const sheetName = sheetInfo.sheet
    const criteriaObj = [
      { header: sheetInfo.keyHeader, value: dataID }
    ]
    const readItem = Lib_wss.ReadItem(spreadsheetID, sheetName, criteriaObj)
    if (readItem) {
      const item = readItem.item
      const forceReset = item.ForceReset
      switch (forceReset) {
        case YES:
          result.state = RESET
          result.message = SIGNINOUT_MSG_FORCE_CHANGE_PASSWORD
          break
        case NO:
          result.state = true
          result.message = GREETING_MSG_HELLO
          break
        default:
          result.state = false
          result.message = PROCESS_MSG_OTHERWISE
          break
      }
    } else {
      // ******************** Not found item ********************
      result.state = false
      result.message = PROCESS_MSG_READ_FAILURE
    }
  } else {
    // ******************** In-correct data ********************
    result.state = false
    result.message = PROCESS_MSG_OTHERWISE
  }

  return JSON.stringify(result)
}