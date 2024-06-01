function AddDataMainContract(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const dataForm = GetDataFormMainContract(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค
  const criteriaObj = [
    // { header: _sheetInfo.planID, value: '0' },
    { header: _sheetInfo.code, value: dataForm.Code },
    { header: _sheetInfo.nameTH, value: dataForm.NameTH },
    { header: _sheetInfo.nameEN, value: dataForm.NameEN }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const dataExist = dataManager.getDataExistOr(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบข้อมูลซ้ำ
  if (dataExist.length === 0) { // ไม่พบข้อมูล เป็นข้อมูลใหม่
    const newDataID = dataManager.getLastValue('PlanID') + 1 // ไอดีลำดับถัดไป
    // ตรวจสอบมีการแนบไฟล์หรือไม่ ถ้าแนบไฟล์ ทำการลบไฟล์เก่าก่อน แล้วอัปโหลดไฟล์ใหม่
    let imageID = null // ไอดีไฟล์
    let lh5 = null // url lh5 ไฟล์
    if (dataForm.brochure.length > 0) { // มีการแนบไฟล์
      // อัปโหลดไฟล์ และ เก็บ url
      imageID = EasyLifeLibrary.UploadFile(_folderID, dataForm.brochure, newDataID) // อัปโหลดไฟล์ และ รับข้อมูล imageID
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // ข้อมูล lh5
    } else { // ไม่มีการแนบไฟล์
      // ใช้ข้อมูลโปรไฟล์โดยปริยายของระบบ
      imageID = GetDefaultProfileImage(sheetName, newDataID) // รับข้อมูล imageID ของไฟล์โดยปริยาย
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // รับข้อมูล lh5 ของไฟล์โดยปริยาย
    }

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      PlanID: newDataID,
      Code: dataForm.Code,
      NameTH: dataForm.NameTH,
      NameEN: dataForm.NameEN,
      PremiumPaymentPeriod: dataForm.premiumPaymentPeriod,
      PremiumPaymentPeriodType: dataForm.premiumPaymentPeriodType,
      ProtectionPeriod: dataForm.protectionPeriod,
      ProtectionPeriodType: dataForm.protectionPeriodType,
      ContractType: dataForm.contractType,
      ContractGroup: dataForm.contractGroup,
      TaxDeduction: dataForm.taxDeduction,
      TaxDeductionType: dataForm.taxDeductionType,
      BrochureID: imageID,
      BrochureUrl: lh5,
      InsurerID: dataForm.insurerID,
      Note: dataForm.note
    }

    result = CreateData(_sheetInfo, item) // สร้างข้อมูล
  } else { // ข้อมูลซ้ำ
    result = TemplateExistData(sheetName, dataExist) // ข้อความแจ้งเตือน ข้อมูลซ้ำ
  }

  return result
}

function EditDataMainContract(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const keyHeader = _sheetInfo.keyHeader // ชื่อคีย์เฮดเดอร์
  const dataForm = GetDataFormMainContract(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค 
  const criteriaObj = [
    { header: _sheetInfo.planID, value: dataForm.dataID },
    { header: _sheetInfo.code, value: dataForm.Code },
    { header: _sheetInfo.nameTH, value: dataForm.NameTH },
    { header: _sheetInfo.nameEN, value: dataForm.NameEN }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล ข้อมูลซ้ำ

  // ตรวจสอบข้อมูลซ้ำ โค้ด, ชื่อภาษาไทย และ ชื่อภาษาอังกฤษ
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const dataExist = dataManager.getDataExistOr(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบข้อมูลซ้ำ
  const existLength = dataExist.length // จำนวนข้อมูลที่ซ้ำกัน
  if ((existLength === 0) || ((existLength === 1) && (dataExist[0].PlanID === dataForm.dataID))) {
    const criteriaOldObj = [
      { header: keyHeader, value: dataForm.dataID }
    ] // เงื่อนไขสำหรับค้นหาข้อมูล ข้อมูลเดิม

    // อ่านข้อมูลจากชีท
    const readData = dataManager.readData(criteriaOldObj)
    const oldItem = readData[0] // เก็บข้อมูลเก่า เฉพาะอ็อบเจ็ค ไม่เอาอาร์เรย์

    // ตรวจสอบมีการแนบไฟล์หรือไม่ ถ้าแนบไฟล์ ทำการลบไฟล์เก่าก่อน แล้วอัปโหลดไฟล์ใหม่
    let imageID = oldItem.BrochureID // ข้อมูลเดิม BrochureID
    let lh5 = oldItem.BrochureUrl // ข้อมูลเดิม BrochureUrl
    if (dataForm.brochure.length > 0) { // มีการแนบไฟล์ใหม่
      // ตรวจสอบข้อมูลก่อนลบไฟล์
      if (imageID !== '-') {
        const deleteFile = EasyLifeLibrary.DeleteFile(imageID) // ลบไฟล์เก่า
      }
      imageID = EasyLifeLibrary.UploadFile(_folderID, dataForm.brochure, dataForm.dataID) // ข้อมูลใหม่ BruchureID
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // ข้อมูลใหม่ BrochureUrl
    }

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      PlanID: dataForm.dataID,
      Code: dataForm.Code,
      NameTH: dataForm.NameTH,
      NameEN: dataForm.NameEN,
      PremiumPaymentPeriod: dataForm.premiumPaymentPeriod,
      PremiumPaymentPeriodType: dataForm.premiumPaymentPeriodType,
      ProtectionPeriod: dataForm.protectionPeriod,
      ProtectionPeriodType: dataForm.protectionPeriodType,
      ContractType: dataForm.contractType,
      ContractGroup: dataForm.contractGroup,
      TaxDeduction: dataForm.taxDeduction,
      TaxDeductionType: dataForm.taxDeductionType,
      BrochureID: imageID,
      BrochureUrl: lh5,
      InsurerID: dataForm.insurerID,
      Note: dataForm.note
    }

    result = UpdateData(_sheetInfo, item) // บันทึกข้อมูล
  } else { // ข้อมูลซ้ำ
    result = TemplateExistData(sheetName, dataExist) // ข้อความแจ้งเตือน ข้อมูลซ้ำ
  }

  return result
}

// function GetForeignKeyMainRiderContract(_item) {
//   let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
//   const sheetName = SHEET_INSURERS // ชื่อชีท
//   const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท
//   const criteriaObj = [
//     { header: sheetInfo.keyHeader, value: _item.InsurerID }
//   ] // เงื่อนไขสำหรับค้นหาข้อมูล

//   // อ่านข้อมูลจากชีท
//   const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
//   const readData = dataManager.readData(criteriaObj) // อ่านข้อมูลจากชีท
//   if (readData.length > 0) { // พบข้อมูล
//     const item = readData[0]
//     const newItem = _item
//     newItem.InsurerName = item[sheetInfo.name]

//     result.state = true
//     result.message = PROCESS_MSG_READ_SUCCESS
//     result.values = newItem
//   }
//   else { // ไม่พบข้อมูล
//     result.state = false
//     result.message = PROCESS_MSG_READ_FAILURE
//     result.values = _item
//   }

//   return result
// }

function GetDataFormMainContract(_formObj) {
  return {
    dataID: _formObj.dataID,
    Code: _formObj.code.trim(),
    NameTH: _formObj.nameTH.trim(),
    NameEN: _formObj.nameEN.trim(),
    premiumPaymentPeriod: _formObj.premiumPaymentPeriod,
    premiumPaymentPeriodType: _formObj.premiumPaymentPeriodType,
    protectionPeriod: _formObj.protectionPeriod,
    protectionPeriodType: _formObj.protectionPeriodType,
    contractType: _formObj.contractType,
    contractGroup: _formObj.contractGroup,
    taxDeduction: _formObj.taxDeduction,
    taxDeductionType: _formObj.taxDeductionType,
    brochure: _formObj.brochure,
    insurerID: _formObj.insurerID,
    note: _formObj.note.trim()
  }
}



// function TemplateExistDataMainContract(_sheetName, _data) {
//   let message = ''
//   let count = 1
//   const totalHeader = _data.length
//   _data.forEach(data => {
//     // message += item.header + ': ' + item.value
//     message += data
//     if (count < totalHeader) {
//       message += ', '
//     }
//     count++
//   })

//   let result = EasyLifeLibrary.ResultInit(true)
//   result.state = true
//   result.message = 'ข้อมูลซ้ำ: ' + message + ' มีอยู่ในระบบแล้ว'
//   result.values = {
//     sheetName: _sheetName,
//     duplicate: true
//   }

//   return result
// }

function ConvertDataObjectToArrayMainContract(_items) {
  let result = new Array
  _items.forEach((item) => {
    let buff = new Array
    buff.push(item.PlanID)
    buff.push(item.Code)
    buff.push(item.NameTH)
    buff.push(item.NameEN)
    // buff.push(item.PremiumPaymentPeriodType + ' ' + item.PremiumPaymentPeriod)
    // buff.push(item.ProtectionPeriodType + ' ' + item.ProtectionPeriod)
    // buff.push(item.ContractType)
    buff.push(item.BrochureUrl)
    buff.push('Action-Button')
    result.push(buff)
  })

  return result
}
