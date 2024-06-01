// **************************************************** //
// ค้นหาข้อมูล
// **************************************************** //
// function Search() {
//   // แปลงข้อมูล json เป็นอ็อบเจ็ค
//   // const data = JSON.parse(_jsonData)
//   // const sheet = data.sheet
//   // const searchHeader = data.searchHeader
//   // const searchText = data.searchText
//   const sheet = SHEET_USER_DETAILS
//   const searchHeader = 'Fullname'
//   const searchText = ''
//   // Spreadsheet & folder

//   let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
//   const sheetInfo = GetSheetInfo(sheet) // ข้อมูลชีท

//   // อ่านข้อมูลจากชีท
//   let criteriaObj = [] // เงื่อนไขสำหรับอ่านข้อมูล
//   switch (searchHeader) {
//     case TEXT_ALL:
//   }

//   if (searchHeader === 'Fullname') {
//     criteriaObj = [
//       { header: searchHeader, value: searchText }
//     ]
//   }
//   const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
//   const searchData = dataManager.searchData(criteriaObj)

//   // ตรวจสอบการอ่านข้อมูล
//   if (searchData.length > 0) {
//     result.state = true
//     result.message = PROCESS_MSG_READ_SUCCESS
//     // Convert data for datatables
//     result.values = ConvertDataObjectToArray(sheetInfo.sheetName, searchData)
//   } else {
//     result.state = true
//     result.message = PROCESS_MSG_READ_SUCCESS
//     result.values = []
//   }

//   return JSON.stringify(result)
// }

// **************************************************** //
// ค้นหาข้อมูลแบบหลายเงื่อนไข
// **************************************************** //
// function SearchData() {
function SearchData(_jsonData) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  // อินพุต
  const data = JSON.parse(_jsonData)
  const module = data.module
  const sheetName = data.sheetName
  const criteria = data.criteria
  const multiSheet = data.multiSheet
  // const sheetName = 'user_details'
  // const criteria = [
  //   { header: 'Username', value: '' },
  //   { header: 'Fistname', value: '' },
  //   { header: 'Lastname', value: '' },
  //   { header: 'Level', value: 'ตัวแทนบริการ' },
  //   { header: 'Status', value: 'DISABLED' }
  // ]
  console.log('criteria:', criteria)

  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท

  // อ่านข้อมูลจากชีท
  if (multiSheet) {
    switch (module) {
      case MODULE_HS_PACKAGE:
        result = SearchDataHsPackage(criteria)
        break
    }
  } else {
    // เงื่อนไขสำหรับค้นหา เก็บเฉพาะเงื่อนไขที่มีการกรอกข้อมูล
    let criteriaObj = []
    criteria.forEach(crit => {
      if (crit.value !== '') {
        criteriaObj.push(crit)
      }
    })
    console.log('criteriaObj:', criteriaObj)

    const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
    const searchData = dataManager.searchData(criteriaObj) // อ่านข้อมูล
    console.log('searchData:', searchData)

    // ตรวจสอบการอ่านข้อมูล
    if (searchData.length > 0) { // พบข้อมูล
      result.state = true
      result.message = PROCESS_MSG_READ_SUCCESS
      result.values = ConvertDataObjectToArray(module, searchData)
    } else { // ไม่พบข้อมูล
      result.state = true
      result.message = PROCESS_MSG_READ_SUCCESS
      result.values = []
    }
  }

  return JSON.stringify(result)
}



// // function SearchData() {
// function SearchData(_jsonData) {
//   let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
//   // อินพุต
//   const data = JSON.parse(_jsonData)
//   const module = data.module
//   const sheetName = data.sheetName
//   const criteria = data.criteria
//   const multiSheet = data.multiSheet
//   // const sheetName = 'user_details'
//   // const criteria = [
//   //   { header: 'Username', value: '' },
//   //   { header: 'Fistname', value: '' },
//   //   { header: 'Lastname', value: '' },
//   //   { header: 'Level', value: 'ตัวแทนบริการ' },
//   //   { header: 'Status', value: 'DISABLED' }
//   // ]
//   console.log('criteria:', criteria)

//   const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท

//   // เงื่อนไขสำหรับค้นหา เก็บเฉพาะเงื่อนไขที่มีการกรอกข้อมูล
//   let criteriaObj = []
//   criteria.forEach(element => {
//     if (element.value !== '') {
//       criteriaObj.push(element)
//     }
//   })
//   console.log('criteriaObj:', criteriaObj)

//   // อ่านข้อมูลจากชีท
//   const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
//   const searchData = dataManager.searchData(criteriaObj) // อ่านข้อมูล
//   console.log('searchData:', searchData)

//   // ตรวจสอบการอ่านข้อมูล
//   if (searchData.length > 0) { // พบข้อมูล
//     result.state = true
//     result.message = PROCESS_MSG_READ_SUCCESS
//     result.values = ConvertDataObjectToArray(module, searchData)
//     // result.values = ConvertDataObjectToArray(sheetName, searchData)
//   } else { // ไม่พบข้อมูล
//     result.state = true
//     result.message = PROCESS_MSG_READ_SUCCESS
//     result.values = []
//   }

//   return JSON.stringify(result)
// }



// **************************************************** //
// เพิ่มข้อมูล
// **************************************************** //
function AddData(_formObj) {
  // ตรวจสอบโมดูล
  const module = _formObj.formProcess
  const running = RunningModule(module)
  const sheetName = running.sheetName

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท
  const folderInfo = GetFolderInfo(sheetName) // ข้อมูลโฟลเดอร์
  const folderID = (folderInfo) ? folderInfo.folderID : null // ไอดีโฟลเดอร์

  // เลือกคำสั่ง
  switch (module) {
    case MODULE_USER:
      result = AddDataUser(_formObj, sheetInfo, folderID)
      break
    case MODULE_USER_SIGNUP:
      result = AddDataUser(_formObj, sheetInfo, folderID)
      break
    case MODULE_CUSTOMER:
      result = AddDataCustomer(_formObj, sheetInfo, folderID)
      break
    case MODULE_MAIN_CONTRACT:
      result = AddDataMainContract(_formObj, sheetInfo, folderID)
      break
    case MODULE_HS_PLAN:
      result = AddDataPlan(_formObj, sheetInfo, folderID)
      break
    case MODULE_HS_PACKAGE:
      result = AddDataHsPackage(_formObj)
      break
    // case MODULE_CI_PLAN:
    //   result = AddDataCiPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_CI_PACKAGE:
    //   result = AddDataCiPackage(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_AI_PLAN:
    //   result = AddDataAiPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_AI_PACKAGE:
    //   result = AddDataAiPackage(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_HB_PLAN:
    //   result = AddDataHbPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_HB_PACKAGE:
    //   result = AddDataHbPackage(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_WP_PLAN:
    //   result = AddDataWpPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_WP_PACKAGE:
    //   result = AddDataWpPackage(_formObj, sheetInfo, folderID)
    //   break
    case MODULE_POLICY:
      result = AddDataPolicy(_formObj, sheetInfo, folderID)
      break
  }

  result.module = module
  result.modal = running.modal

  return JSON.stringify(result)
}



// **************************************************** //
// เพิ่มข้อมูล
// **************************************************** //
function CreateData(_sheetInfo, _item) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const headers = GetHeaders(sheetName) // เฮดเดอร์ชีท
  const item = EasyLifeLibrary.ReplaceEmptyToSymbol(headers, _item, '-') // แทนที่ '' ด้วย '-'

  // เพิ่มข้อมูล
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const createDate = dataManager.createData(headers, item)

  // ตรวจสอบการเพิ่มข้อมูล
  if (createDate) { // สำเร็จ
    result.state = true
    result.message = PROCESS_MSG_SAVE_SUCCESS
  } else { // ล้มเหลว
    result.state = false
    result.message = PROCESS_MSG_SAVE_FAILURE
  }

  result.values = {
    sheetName: sheetName,
    duplicate: false
  }

  return result
}



// **************************************************** //
// เพิ่มข้อมูลหลายแถว
// **************************************************** //
function CreateDataMultiRows(_sheetInfo, _item) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const headers = GetHeaders(sheetName) // เฮดเดอร์ชีท

  let items = []
  _item.forEach(data => {
    let temp = EasyLifeLibrary.ReplaceEmptyToSymbol(headers, data, '-') // แทนที่ '' ด้วย '-'
    items.push(temp)
  })

  // เพิ่มข้อมูล
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const createDataMultiRows = dataManager.createDataMultiRows(headers, items)

  // ตรวจสอบการเพิ่มข้อมูล
  if (createDataMultiRows) { // สำเร็จ
    result.state = true
    result.message = PROCESS_MSG_SAVE_SUCCESS
  } else { // ล้มเหลว
    result.state = false
    result.message = PROCESS_MSG_SAVE_FAILURE
  }

  result.values = {
    sheetName: sheetName,
    duplicate: false
  }

  return result
}



// **************************************************** //
// แก้ไขข้อมูล
// **************************************************** //
function EditData(_formObj) {
  // ตรวจสอบโมดูล
  const module = _formObj.formProcess
  const running = RunningModule(module)
  const sheetName = running.sheetName

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท
  const folderInfo = GetFolderInfo(sheetName) // ข้อมูลโฟลเดอร์
  const folderID = (folderInfo) ? folderInfo.folderID : null // ไอดีโฟลเดอร์

  // เลือกคำสั่ง
  switch (module) {
    case MODULE_USER:
      result = EditDataUser(_formObj, sheetInfo, folderID)
      break
    case MODULE_CUSTOMER:
      result = EditDataCustomer(_formObj, sheetInfo, folderID)
      break
    case MODULE_MAIN_CONTRACT:
      result = EditDataMainContract(_formObj, sheetInfo, folderID)
      break
    case MODULE_HS_PLAN:
      result = EditDataPlan(_formObj, sheetInfo, folderID)
      break
    case MODULE_HS_PACKAGE:
      result = EditDataHsPackage(_formObj)
      break
    // case MODULE_CI_PLAN:
    //   result = EditDataCiPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_CI_PACKAGE:
    //   result = EditDataCiPackage(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_AI_PLAN:
    //   result = EditDataAiPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_AI_PACKAGE:
    //   result = EditDataAiPackage(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_HB_PLAN:
    //   result = EditDataHbPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_HB_PACKAGE:
    //   result = EditDataHbPackage(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_WP_PLAN:
    //   result = EditDataWpPlan(_formObj, sheetInfo, folderID)
    //   break
    // case MODULE_WP_PACKAGE:
    //   result = EditDataWpPackage(_formObj, sheetInfo, folderID)
    //   break
    case MODULE_POLICY:
      result = EditDataPolicy(_formObj, sheetInfo, folderID)
      break
    // case MODULE_RIDER_PLAN:
    //   result = EditDataRiderContract(_formObj, sheetInfo, folderID)
    //   break
  }

  result.module = module
  result.modal = running.modal

  // จัดเรียงข้อมูล
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  dataManager.sortSheet('TimeStamp', 'asc')

  return JSON.stringify(result)
}

// **************************************************** //
// แก้ไขข้อมูล
// **************************************************** //
function UpdateData(_sheetInfo, _item) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName
  const keyHeader = _sheetInfo.keyHeader
  const headers = GetHeaders(sheetName) // เฮดเดอร์ชีท
  const item = EasyLifeLibrary.ReplaceEmptyToSymbol(headers, _item, '-') // แทนที่ '' ด้วย '-'
  const criteriaObj = [
    { header: keyHeader, value: _item[keyHeader] }
  ] // เงื่อนไขสำหรับแก้ไขข้อมูล

  // แก้ไขข้อมูล
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  dataManager.updateData(criteriaObj, item) // บันทึกข้อมูล

  // ผลลัพธ์
  result.state = true
  result.message = PROCESS_MSG_SAVE_SUCCESS
  result.values = {
    sheetName: sheetName,
    duplicate: false
  }

  return result
}

// **************************************************** //
// ลบข้อมูล
// **************************************************** //
function DeleteData(_jsonData) {
  // แปลงข้อมูล json เป็นอ็อบเจ็ค
  const data = JSON.parse(_jsonData)
  const module = data.module
  const sheetName = data.sheetName
  const dataID = data.dataID

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท
  const criteriaObj = [
    { header: sheetInfo.keyHeader, value: dataID }
  ] // เงื่อนไขสำหรับลบข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManeger = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const readData = dataManeger.readData(criteriaObj) //อ่านข้อมูล

  // ตรวจสอบการอ่านข้อมูล
  if (readData.length > 0) { // พบข้อมูล
    const item = readData[0] // ข้อมูลจากชีทที่อ่านได้

    // เก็บค่าไอดีไฟล์เพื่อนำไปลบ
    let fileID = null
    switch (module) {
      case MODULE_USER:
        fileID = item.ImageID
        break
      case MODULE_CUSTOMER:
        fileID = item.ImageID
        break
      case MODULE_MAIN_CONTRACT:
        fileID = item.BrochureID
        break
      case MODULE_HS_PLAN:
        fileID = item.BrochureID
        break
      case MODULE_CI_PLAN:
        fileID = item.BrochureID
        break
      case MODULE_AI_PLAN:
        fileID = item.BrochureID
        break
      case MODULE_HB_PLAN:
        fileID = item.BrochureID
        break
      case MODULE_WP_PLAN:
        fileID = item.BrochureID
        break
    }

    // ลบไฟล์ ตรวจสอบว่ามีไอดีไฟล์
    if ((fileID !== null) && (fileID !== '-')) {
      EasyLifeLibrary.DeleteFile(fileID) // ลบไฟล์
    }

    // ลบข้อมูล
    dataManeger.deleteData(criteriaObj)

    result.state = true
    result.message = PROCESS_MSG_DELETE_SUCCESS
  } else { // ไม่พบข้อมูล
    result.state = false
    result.message = PROCESS_MSG_READ_FAILURE
  }

  return JSON.stringify(result)
}

// **************************************************** //
// อ่านข้อมูลตามจำนวนแถวที่ต้องการ
// **************************************************** //
function GetItemLastRows(_jsonData) {
  // แปลงข้อมูล json เป็นอ็อบเจ็ค
  const data = JSON.parse(_jsonData)
  const module = data.module
  const sheetName = data.sheetName
  const getAllData = data.getAllData

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const numberRow = (getAllData) ? 0 : QUANTITY_OF_RECORD
  const readData = dataManager.readLastRows(numberRow)

  // ตรวจสอบการอ่านข้อมูล
  if (readData.length > 0) { // พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = ConvertDataObjectToArray(module, readData) // แปลงข้อมูลอ็อบเจ็คเป็นอาร์เรย์ เพื่อแสดงใน datatables
  } else { // ไม่พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = []
  }

  return JSON.stringify(result)
}

// **************************************************** //
// อ่านข้อมูลจากไอดี
// **************************************************** //
function GetItem(_jsonData) {
  // แปลงข้อมูล json เป็นอ็อบเจ็ค
  const data = JSON.parse(_jsonData)
  const sheetName = data.sheetName
  const itemID = data.dataID

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท

  // อ่านข้อมูลจากชีท
  const criteriaObj = [
    { header: sheetInfo.keyHeader, value: itemID }
  ] // เงื่อนไขสำหรับอ่านข้อมูล
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const readData = dataManager.readData(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบการอ่านข้อมูล
  if (readData.length > 0) { // พบข้อมูล
    const item = readData[0]
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = item
    const foreignKey = GetForeignKey(sheetName, item)
    if (foreignKey) {
      result = foreignKey
    }
  } else { // ไม่พบข้อมูล
    result.state = false
    result.message = PROCESS_MSG_READ_FAILURE
    result.value = []
  }

  return JSON.stringify(result)
}



// **************************************************** //
// แปลงข้อมูล Foreignkey เป็นชื่อรายการ
// **************************************************** //
function GetForeignKey(_sheetName, _item) {
  let result = null // ผลลัพธ์

  // เลือกคำสั่ง
  switch (_sheetName) {
    case SHEET_MAIN_CONTRACTS:
      result = GetForeignKeyRiderPlan(_item)
      break
    case SHEET_HS_PLANS:
      result = GetForeignKeyRiderPlan(_item)
      break
    case SHEET_POLICY_DETAILS:
      result = GetForeignKeyPolicy(_item)
      break
    // default:
    //   result = {
    //     state: true,
    //     message: PROCESS_MSG_READ_SUCCESS,
    //     values: _item
    //   }
    //   break
  }

  return result
}



function GetForeignKeyRiderPlan(_item) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = SHEET_INSURERS // ชื่อชีท
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท
  const criteriaObj = [
    { header: sheetInfo.insurerID, value: _item.InsurerID }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const readData = dataManager.readData(criteriaObj) // อ่านข้อมูลจากชีท
  let newItem = _item
  let message = null
  if (readData.length > 0) { // พบข้อมูล
    message = PROCESS_MSG_READ_SUCCESS
    // const item = readData[0]
    newItem.InsurerName = readData[0][sheetInfo.name]
  }
  else { // ไม่พบข้อมูล
    message = PROCESS_MSG_READ_FAILURE
    newItem.InsurerName = PROCESS_MSG_READ_FAILURE
  }
  result.state = true
  result.message = message
  result.values = newItem

  return result
}
