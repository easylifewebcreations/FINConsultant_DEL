// function GetSelectOption2() {
//   // Get json data
//   // const data = JSON.parse(_jsonData)
//   // const sheet = data.sheet
//   // { element: POLICY_DOCS, elementAttribute: 'class', options: null, modalID: 'policyModal', tableID: 'policyDocsTable', sheet: 'application_docs' }
//   const sheet = 'rider_contracts'
//   // Set result variable
//   let result = Lib_wss.ResultInit(false)
//   // Spreadsheet & folder
//   const sheetInfo = GetSheetInfo(sheet)
//   if (sheetInfo) {
//     // ******************** Correct data ********************
//     const spreadsheetID = sheetInfo.spreadsheetID
//     const sheetName = sheetInfo.sheet
//     // Read items
//     const readItems = Lib_wss.ReadItems(spreadsheetID, sheetName, 0)
//     console.log('readItems > ', readItems)
//     if (readItems) {
//       result.state = true
//       result.message = PROCESS_MSG_READ_SUCCESS
//       // Convert data for select option
//       result.values = ConvertDataObjectToArraySelectOption(sheetName, readItems)
//       console.log('values > ', result.values)
//     } else {
//       result.state = true
//       result.message = PROCESS_MSG_READ_SUCCESS
//       // Set empty array
//       result.values = []
//     }
//   } else {
//     // ******************** In-correct data ********************
//     result.state = false
//     result.message = PROCESS_MSG_OTHERWISE
//   }
//   // Return
//   return JSON.stringify(result)
// }


const OPTION_DEFAULT = { id: '', text: 'โปรดเลือก' }

function GetSelectOption(_jsonData) {
  // แปลงข้อมูล json เป็นอ็อบเจ็ค
  const data = JSON.parse(_jsonData)
  // const module = data.module // ชื่อโมดูล
  const sheetName = data.sheetName // ชื่อชีท

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const readData = dataManager.readLastRows(0) // อ่านข้อมูลทั้งหมด

  // ตรวจสอบการอ่านข้อมูล
  if (readData.length > 0) { // พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = ConvertDataObjectToArraySelectOption(sheetName, readData)
  } else { // ไม่พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = []
  }

  return JSON.stringify(result)
}

// **************************************************** //
// ***** ConvertDataObjectToArraySelectOption ********* //
// **************************************************** //
function ConvertDataObjectToArraySelectOption(_sheetName, _items) {
  let result = null
  switch (_sheetName) {
    case SHEET_HS_PLANS:
      result = ConvertDataObjectToArraySelectOptionHsPlan(_items)
      break
    case SHEET_HS_PACKAGES:
      result = ConvertDataObjectToArraySelectOptionHsPackage(_items)
      break
    case SHEET_INSURERS:
      result = ConvertDataObjectToArraySelectOptionInsurer(_items)
      break
    case SHEET_AGENTS:
      result = ConvertDataObjectToArraySelectOptionAgent(_items)
      break
    case SHEET_MAIN_CONTRACTS:
      result = ConvertDataObjectToArraySelectOptionMainContract(_items)
      break
    // case SHEET_RIDER_CONTRACTS:
    //   result = ConvertDataObjectToArraySelectOptionMainContract(_items)
    //   break
    case SHEET_APPLICATION_DOCS:
      result = ConvertDataObjectToArraySelectOptionAppDocs(_items)
      break
  }
  // Return
  return result
}



// **************************************************** //
// 
// **************************************************** //
function ConvertDataObjectToArraySelectOptionHsPlan(_items) {
  let result = []
  result.push(OPTION_DEFAULT)
  // push option to array
  _items.forEach(item => {
    let option = {
      id: item.PlanID,
      text: item.PlanID + ' >> ' + item.Code + ' : ' + item.NameTH + ' : ' + item.NameEN
    }
    result.push(option)
  })
  // Return
  return result
}



// **************************************************** //
// 
// **************************************************** //
function ConvertDataObjectToArraySelectOptionHsPackage(_items) {
  let result = []
  result.push(OPTION_DEFAULT)
  // push option to array
  _items.forEach(item => {
    let option = {
      id: item.PackageID,
      text: item.PackageID + ' >> ' + item.PackageName
    }
    result.push(option)
  })
  // Return
  return result
}



// **************************************************** //
// 
// **************************************************** //
function ConvertDataObjectToArraySelectOptionInsurer(_items) {
  let result = []
  result.push(OPTION_DEFAULT)
  // push option to array
  _items.forEach(item => {
    let option = {
      id: item.InsurerID,
      text: item.Name
    }
    result.push(option)
  })
  // Return
  return result
}



// **************************************************** //
// 
// **************************************************** //
function ConvertDataObjectToArraySelectOptionAgent(_items) {
  let result = []
  result.push(OPTION_DEFAULT)
  // push option to array
  _items.forEach(item => {
    let fullname = item.Firstname + '(' + item.Nickname + ') ' + item.Lastname
    let option = {
      id: item.AgentID,
      text: fullname
    }
    result.push(option)
  })
  // Return
  return result
}

// **************************************************** //
// 
// **************************************************** //
function ConvertDataObjectToArraySelectOptionMainContract(_items) {
  let result = []
  result.push(OPTION_DEFAULT)
  // push option to array
  _items.forEach(item => {
    let text = item.NameEN + ' > ' + item.NameTH + ' > ' + item.ContractType + ' > ' + item.ContractGroup + ' > ' + item.InsurerID
    let option = {
      id: item.ContractID,
      text: text,
      ContractGroup: item.ContractGroup
    }
    result.push(option)
  })
  // Return
  return result
}

// **************************************************** //
// 
// **************************************************** //
// function ConvertDataObjectToArraySelectOptionRiderContract(_items) {
//   let result = []
//   result.push(OPTION_DEFAULT)
//   // ContractID	Code	NameTH	NameEN		ContractType	ContractGroup			InsurerID
//   // push option to array
//   _items.forEach(item => {
//     let text = item.NameEN + ' > ' + item.NameTH + ' > ' + item.ContractType + ' > ' + item.ContractGroup
//     let option = {
//       id: item.ContractID,
//       text: text
//     }
//     result.push(option)
//   })
//   // Return
//   return result
// }

// **************************************************** //
// 
// **************************************************** //
function ConvertDataObjectToArraySelectOptionAppDocs(_items) {
  let result = []
  result.push(OPTION_DEFAULT)
  // push option to array
  _items.forEach(item => {
    let option = {
      id: item.DocsID,
      text: item.DocsName
    }
    result.push(option)
  })
  // Return
  return result
}