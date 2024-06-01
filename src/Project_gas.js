// **************************************************** //
// ตรวจสอบโมดูล
// **************************************************** //
function RunningModule(_module) {
  // อาร์เรย์โมดูล
  const modules = [
    // Member
    { module: MODULE_LICENSE, modal: MODAL_LICENSE, sheetName: SHEET_MEMBER_DETAILS },
    // User
    { module: MODULE_USER, modal: MODAL_USER, sheetName: SHEET_USER_DETAILS },
    { module: MODULE_USER_SIGNUP, modal: MODAL_USER_SIGNUP, sheetName: SHEET_USER_DETAILS },
    { module: MODULE_PASSWORD, modal: MODAL_PASSWORD, sheetName: SHEET_USER_DETAILS },
    // Customer
    { module: MODULE_CUSTOMER, modal: MODAL_CUSTOMER, sheetName: SHEET_CUSTOMER_DETAILS },
    // Main contract
    { module: MODULE_MAIN_CONTRACT, modal: MODAL_MAIN_CONTRACT, sheetName: SHEET_MAIN_CONTRACTS },
    // HS rider
    { module: MODULE_HS_PLAN, modal: MODAL_HS_PLAN, sheetName: SHEET_HS_PLANS },
    { module: MODULE_HS_PACKAGE, modal: MODAL_HS_PACKAGE, sheetName: SHEET_HS_PACKAGES },
    // CI rider
    { module: MODULE_CI_PLAN, modal: MODAL_CI_PLAN, sheetName: SHEET_CI_PLANS },
    { module: MODULE_CI_PACKAGE, modal: MODAL_CI_PACKAGE, sheetName: SHEET_CI_PACKAGES },
    // AI rider
    { module: MODULE_AI_PLAN, modal: MODAL_AI_PLAN, sheetName: SHEET_AI_PLANS },
    { module: MODULE_AI_PACKAGE, modal: MODAL_AI_PACKAGE, sheetName: SHEET_AI_PACKAGES },
    // HB rider
    { module: MODULE_HB_PLAN, modal: MODAL_HB_PLAN, sheetName: SHEET_HB_PLANS },
    { module: MODULE_HB_PACKAGE, modal: MODAL_HB_PACKAGE, sheetName: SHEET_HB_PACKAGES },
    // WP rider
    { module: MODULE_WP_PLAN, modal: MODAL_WP_PLAN, sheetName: SHEET_WP_PLANS },
    { module: MODULE_WP_PACKAGE, modal: MODAL_WP_PACKAGE, sheetName: SHEET_WP_PACKAGES },
    // Policy
    { module: MODULE_POLICY, sheetName: SHEET_POLICY_DETAILS },
  ]

  // ค้นหาข้อมูล
  const result = modules.find(res => res.module === _module)

  return result || null
}



function TemplateExistData(_sheetName, _data) {
  let message = ''
  let count = 1
  const totalHeader = _data.length
  _data.forEach(data => {
    message += data
    if (count < totalHeader) {
      message += ', '
    }
    count++
  })

  let result = FinAppsLibrary.ResultInit(true)
  result.state = true
  result.message = 'ข้อมูลซ้ำ: ' + message + ' มีอยู่ในระบบแล้ว'
  result.values = {
    sheetName: _sheetName,
    duplicate: true
  }

  return result
}



// **************************************************** //
// ***** GetFolderFileIDFromSheet ********************* //
// **************************************************** //
// function GetFolderFileIDFromSheet(_targetName, _sheet) {
//   // Set result
//   // let result = null
//   // Spreadsheet
//   // const sheetInfo = SPREADSHEET_LIST.find(buff => buff.sheet === _sheet)
//   const sheetInfo = GetSheetInfo(_sheet)
//   const criteriaObj = [
//     { header: sheetInfo.keyHeader, value: _targetName }
//   ]
//   const initID = GetInitSpreadsheetID()
//   const readItem = Lib_wss.ReadItem(initID, _sheet, criteriaObj)

//   return readItem.item[sheetInfo.headerID] || null
//   // if (readItem) {
//   //   // ******************** FOUND DATA ********************
//   //   result = readItem.item[sheetInfo.headerID]
//   // }
//   // // Return
//   // return result
// }

// **************************************************** //
// อ่านข้อมูลเฮดเดอร์ จาก Global variable
// **************************************************** //
function GetHeaders(_sheetName) {
  // หาข้อมูลเฮดเดอร์
  const headers = HEADERS_LIST.find(buff => buff.sheetName === _sheetName).header

  return headers || null
}

// **************************************************** //
// อ่านข้อมูลชีท จาก Global variable
// **************************************************** //
// Get data form constant variable
function GetSheetInfo(_sheetName) {
  // หาข้อมูลชีท
  const sheetInfo = SPREADSHEET_LIST.find(buff => buff.sheetName === _sheetName)

  return sheetInfo || null
}

// Get data from sheet
// function GetSheetInfo(_sheet) {
//   const sheetInfo = SPREADSHEET_LIST.find(buff => buff.sheet === _sheet)
//   // let result = sheetInfo
//   if (sheetInfo) {
//     sheetInfo.spreadsheetID = GetFolderFileIDFromSheet(sheetInfo.spreadsheet, SHEET_FILES)
//   }
//   // Return
//   return sheetInfo || null
// }

// **************************************************** //
// อ่านข้อมูลโฟลเดอร์ จาก Global variable
// **************************************************** //
function GetFolderInfo(_sheetName) {
  // หาข้อมูลโฟลเดอร์
  const folderInfo = FOLDER_UPLOAD_LIST.find(buff => buff.sheetName === _sheetName)

  return folderInfo || null
}

// Get data from sheet
// function GetFolderInfo(_sheet) {
//   const folderInfo = FOLDER_UPLOAD_LIST.find(buff => buff.sheet === _sheet)
//   // let result = folderInfo
//   if (folderInfo) {
//     folderInfo.folderID = GetFolderFileIDFromSheet(folderInfo.folder, SHEET_FORDERS)
//   }
//   // Return
//   return folderInfo || null
// }

// **************************************************** //
// ฟังก์ชั่นเลือกแปลงข้อมูลอ็อบเจ็คเป็นอาร์เรย์ตามชื่อชีท
// **************************************************** //
function ConvertDataObjectToArray(_module, _data) {
  // เลือกคำสั่ง
  let result = null
  switch (_module) {
    case MODULE_USER:
      result = ConvertDataObjectToArrayUser(_data)
      break
    case MODULE_CUSTOMER:
      result = ConvertDataObjectToArrayCustomer(_data)
      break
    case MODULE_MAIN_CONTRACT:
      result = ConvertDataObjectToArrayMainContract(_data)
      break
    // case SHEET_RIDER_CONTRACTS:
    //   result = ConvertDataObjectToArrayRiderContract(_data)
    //   break
    case MODULE_HS_PLAN:
      result = ConvertDataObjectToArrayPlan(_data)
      break
    case MODULE_HS_PACKAGE:
      result = ConvertDataObjectToArrayHsPackage(_data)
      break
    // case MODULE_CI_PLAN:
    //   result = ConvertDataObjectToArrayCiPlan(_data)
    //   break
    // case MODULE_CI_PACKAGE:
    //   result = ConvertDataObjectToArrayCiPackage(_data)
    //   break
    // case MODULE_AI_PLAN:
    //   result = ConvertDataObjectToArrayAiPlan(_data)
    //   break
    // case MODULE_AI_PACKAGE:
    //   result = ConvertDataObjectToArrayAiPackage(_data)
    //   break
    // case MODULE_HB_PLAN:
    //   result = ConvertDataObjectToArrayHbPlan(_data)
    //   break
    // case MODULE_HB_PACKAGE:
    //   result = ConvertDataObjectToArrayHbPackage(_data)
    //   break
    // case MODULE_WP_PLAN:
    //   result = ConvertDataObjectToArrayWpPlan(_data)
    //   break
    // case MODULE_WP_PACKAGE:
    //   result = ConvertDataObjectToArrayWpPackage(_data)
    //   break
    case MODULE_POLICY:
      result = ConvertDataObjectToArrayPolicy(_data)
      break
  }

  return result
}

// **************************************************** //
// ดึงไอดีโปรไฟล์โดยปริยาย
// **************************************************** //
function GetDefaultProfileImage(_sheetName, _fileName) {
  // Get source folder
  // const sourceFolderID = GetFolderFileIDFromSheet(FOLDER_IMG, SHEET_FORDERS)
  const sourceFolderID = GetFolderInfo(FOLDER_IMG).folderID
  const fileID = FinAppsLibrary.GetFileID(sourceFolderID, DEFAULT_PROFILE_IMAGE, MIMETYPE_IMG_PNG)
  // Get destination folder
  // let destinationFolderName = null
  // if (_sheetName === SHEET_USER_DETAILS) {
  //   destinationFolderName = FOLDER_USER_IMAGES
  // } else if (_sheetName === SHEET_CUSTOMER_DETAILS) {
  //   destinationFolderName = FOLDER_CUSTOMER_IMAGES
  // }
  // const destinationFolderID = GetFolderFileIDFromSheet(destinationFolder, SHEET_FORDERS)
  // const destinationFolderID = GetFolderInfo(destinationFolder).folderID
  const destinationFolderID = GetFolderInfo(_sheetName).folderID
  const destinationFolder = DriveApp.getFolderById(destinationFolderID)
  const file = DriveApp.getFileById(fileID)
  const copiedFile = file.makeCopy(_fileName.toString(), destinationFolder)
  const copiedFileID = copiedFile.getId()
  // Return
  return copiedFileID
}

// function GetDefaultProfileImage(_sheetName, _fileName) {
//   // const sourceFolderID = GetFolderIDInInitSpreadsheet(FOLDER_IMG)
//   const sourceFolderID = GetFolderFileIDFromSheet(FOLDER_IMG, SHEET_FORDERS)
//   let destinationFolder = null
//   if (_sheetName === SHEET_USER_DETAILS) {
//     destinationFolder = FOLDER_USER_IMAGES
//   } else if (_sheetName === SHEET_CUSTOMER_DETAILS) {
//     destinationFolder = FOLDER_CUSTOMER_IMAGES
//   }
//   // const destinationFolderID = GetFolderIDInInitSpreadsheet(destinationFolder)
//   const destinationFolderID = GetFolderFileIDFromSheet(destinationFolder, SHEET_FORDERS)
//   const fileID = Lib_wss.GetFileID(sourceFolderID, DEFAULT_PROFILE_IMAGE, MIMETYPE_IMG_PNG)

//   const desinationFolder = DriveApp.getFolderById(destinationFolderID)
//   const file = DriveApp.getFileById(fileID)
//   const copiedFile = file.makeCopy(_fileName, desinationFolder)
//   const copiedFileID = copiedFile.getId()
//   // Return
//   return copiedFileID
// }

// function GetList(_jsonData) {
//   // Get json data
//   const data = JSON.parse(_jsonData)
//   const sheet = data.sheet
//   // Set result variable
//   let result = Lib_wss.ResultInit(false)
//   // const sheetInfo = GetSheetInfo(SHEET_CONTRACT_RANGE_OF_VALUES)
//   const sheetInfo = GetSheetInfo(sheet)
//   if (sheetInfo) {
//     const spreadsheetID = sheetInfo.spreadsheetID
//     const sheetName = sheetInfo.sheet
//     const items = Lib_wss.ReadItems(spreadsheetID, sheetName, 0)
//     if (items) {
//       // const headers = GetHeaders(SHEET_CONTRACT_RANGE_OF_VALUES)
//       const headers = GetHeaders(sheet)
//       let lists = []
//       headers.forEach(header => {
//         let values = []
//         items.forEach(item => {
//           if (item[header] !== '') {
//             values.push(item[header])
//           }
//         })

//         let list = {
//           header: header,
//           value: values
//         }
//         lists.push(list)
//       })
//       result.state = true
//       result.message = PROCESS_MSG_READ_SUCCESS
//       result.values = lists
//     } else {
//       // ******************** Read failure ********************
//       result.state = false
//       result.message = PROCESS_MSG_READ_FAILURE
//     }
//   } else {
//     // ******************** In-correct data ********************
//     result.state = false
//     result.message = PROCESS_MSG_OTHERWISE
//   }
//   // Return
//   return JSON.stringify(result)
// }

// **************************************************** //
// ***** CheckPhoneNumber ***************************** //
// **************************************************** //
// function CheckPhoneNumber(_phone) {
//   const dashSymbol = '-'
//   const stringPhone = '\'' + _phone
//   return (_phone === '' || _phone === '-') ? dashSymbol : stringPhone
// }

// ************************************
// *** FUNCTION FOR INITIAL SYSTEM ****
// ************************************

// **************************************************** //
// Instant class สำหรับโฟลเดอร์แม่ ที่เก็บไฟล์สคริป
// **************************************************** //
function GetParentFolderApp() {
  const scriptId = ScriptApp.getScriptId()
  return DriveApp.getFileById(scriptId).getParents().next()
}

// **************************************************** //
// ***** InitialSpreadsheetInfo *********************** //
// **************************************************** //
// function InitialSpreadsheetInfo() {
//   return {
//     spreadsheetID: GetInitSpreadsheetID(),
//     spreadsheet: SPREADSHEET_INITIAL
//   }
// }

// **************************************************** //
// ดึงไอดีไฟล์ initial
// **************************************************** //
function GetInitSpreadsheetID() {
  const parentFolder = GetParentFolderApp()
  const list = parentFolder.getFilesByName(SPREADSHEET_INITIAL)
  return list.next().getId()
}
