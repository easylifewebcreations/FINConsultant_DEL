// **************************************************** //
// 
// **************************************************** //
function GetCoverageListHsPackage() {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(SHEET_HS_COVERAGE_LISTS) // ข้อมูลชีท
  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const readData = dataManager.readLastRows(0) // อ่านข้อมูล

  // ตรวจสอบการอ่านข้อมูล
  if (readData.length > 0) { // พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = readData
  } else { // ไม่พบข้อมูล
    result.state = false
    result.message = PROCESS_MSG_READ_FAILURE
    result.value = []
  }

  return JSON.stringify(result)
}



// ******************************************************************************************************** //
// Contract plan section
// ******************************************************************************************************** //

// **************************************************** //
// เพิ่มข้อมูล
// **************************************************** //
function AddDataPlan(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const dataForm = GetDataFormPlan(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค
  const criteriaObj = [
    { header: _sheetInfo.planID, value: null },
    { header: _sheetInfo.code, value: dataForm.code },
    { header: _sheetInfo.nameTH, value: dataForm.nameTH },
    { header: _sheetInfo.nameEN, value: dataForm.nameEN }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const dataExist = dataManager.getDataExistOr(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบข้อมูลซ้ำ
  if (dataExist.length === 0) { // ไม่พบข้อมูล เป็นข้อมูลใหม่
    let newDataID = parseInt(dataManager.getLastValue(_sheetInfo.planID)) + 1 // ไอดีลำดับถัดไป

    // ตรวจสอบมีการแนบไฟล์หรือไม่ ถ้าแนบไฟล์ ทำการลบไฟล์เก่าก่อน แล้วอัปโหลดไฟล์ใหม่
    let imageID = '' // ไอดีไฟล์
    let url = '' // url lh5 ไฟล์
    if (dataForm.brochure.length > 0) { // มีการแนบไฟล์
      // อัปโหลดไฟล์ และ เก็บ url
      imageID = EasyLifeLibrary.UploadFile(_folderID, dataForm.brochure, newDataID) // อัปโหลดไฟล์ และ รับข้อมูล imageID
      url = EasyLifeLibrary.GetImageUrl(imageID).url // ข้อมูล lh5
    }
    // else { // ไม่มีการแนบไฟล์
    //   // ใช้ข้อมูลโปรไฟล์โดยปริยายของระบบ
    //   imageID = GetDefaultProfileImage(sheetName, newDataID) // รับข้อมูล imageID ของไฟล์โดยปริยาย
    //   lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // รับข้อมูล lh5 ของไฟล์โดยปริยาย
    // }

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      PlanID: newDataID,
      Code: dataForm.code,
      NameTH: dataForm.nameTH,
      NameEN: dataForm.nameEN,
      PremiumPaymentPeriod: dataForm.premiumPaymentPeriod,
      PremiumPaymentPeriodType: dataForm.premiumPaymentPeriodType,
      ProtectionPeriod: dataForm.protectionPeriod,
      ProtectionPeriodType: dataForm.protectionPeriodType,
      ContractType: dataForm.contractType,
      ContractGroup: dataForm.contractGroup,
      TaxDeduction: dataForm.taxDeduction,
      TaxDeductionType: dataForm.taxDeductionType,
      BrochureID: imageID,
      BrochureUrl: url,
      InsurerID: dataForm.insurerID,
      Note: dataForm.note
    }

    result = CreateData(_sheetInfo, item) // สร้างข้อมูล
  } else { // ข้อมูลซ้ำ
    result = TemplateExistData(sheetName, dataExist) // ข้อความแจ้งเตือน ข้อมูลซ้ำ
  }

  return result
}


// **************************************************** //
// แก้ไขข้อมูล
// **************************************************** //
function EditDataPlan(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const keyHeader = _sheetInfo.keyHeader // ชื่อคีย์เฮดเดอร์
  const dataForm = GetDataFormPlan(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค 
  const criteriaObj = [
    { header: _sheetInfo.planID, value: dataForm.dataID },
    { header: _sheetInfo.code, value: dataForm.code },
    { header: _sheetInfo.nameTH, value: dataForm.nameTH },
    { header: _sheetInfo.nameEN, value: dataForm.nameEN }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล ข้อมูลซ้ำ

  // ตรวจสอบข้อมูลซ้ำ โค้ด, ชื่อภาษาไทย และ ชื่อภาษาอังกฤษ
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const dataExist = dataManager.getDataExistOr(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบข้อมูลซ้ำ
  const existLength = dataExist.length // จำนวนข้อมูลที่ซ้ำกัน
  // if ((existLength === 0) || ((existLength === 1) && (dataExist[0].PlanID === dataForm.dataID))) {
  if (existLength === 0) { // ไม่พบข้อมูลซ้ำ
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
      Code: dataForm.code,
      NameTH: dataForm.nameTH,
      NameEN: dataForm.nameEN,
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



function GetDataFormPlan(_formObj) {
  return {
    dataID: _formObj.dataID,
    code: _formObj.code.trim(),
    nameTH: _formObj.nameTH.trim(),
    nameEN: _formObj.nameEN.trim(),
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



function ConvertDataObjectToArrayPlan(_items) {
  let result = []
  _items.forEach((item) => {
    let buff = []
    buff.push(item.PlanID)
    buff.push(item.Code)
    buff.push(item.NameTH)
    buff.push(item.NameEN)
    buff.push(item.BrochureUrl)
    buff.push('Action-Button')

    result.push(buff)
  })
  // Return
  return result
}



function TemplateExistData(_sheetName, _dataForm, _Criteria) {
  let message = ''
  let count = 1
  const totalCriteria = _Criteria.length
  _Criteria.forEach(crit => {
    message += crit.header + ': ' + crit.value
    if (count < totalCriteria) {
      message += ', '
    }
    count++
  })

  let result = EasyLifeLibrary.ResultInit(true) // ผลลัพธ์
  result.state = true
  result.message = 'ข้อมูลซ้ำ: ' + message + ' มีอยู่ในระบบแล้ว'
  result.values = {
    sheetName: _sheetName,
    duplicate: true
  }

  return result
}



// ******************************************************************************************************** //
// HS package section
// ******************************************************************************************************** //

// **************************************************** //
// เพิ่มข้อมูล
// **************************************************** //
function AddDataHsPackage(_formObj) {
  // function AddDataHsPackage() {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const planID = _formObj.planID
  const packageName = _formObj.packageName
  // const planID = '1'
  // const packageName = 'HS1000'

  const sheetPackages = SHEET_HS_PACKAGES // 
  const sheetPackagesInfo = GetSheetInfo(sheetPackages) // 
  const criteriaObj = [
    { header: sheetPackagesInfo.packageID, value: null },
    { header: sheetPackagesInfo.packageName, value: packageName }
  ] // เงื่อนไขสำหรับค้นหา
  console.log('crit1;', criteriaObj)

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetPackagesInfo)
  const dataExist = dataManager.getDataExistOr(criteriaObj) // อ่านข้อมูลจากชีท
  console.log('exist;', dataExist)

  // ตรวจสอบข้อมูลซ้ำ
  if (dataExist.length === 0) { // ไม่พบข้อมูล เป็นข้อมูลใหม่
    // ----------------------------------------------------
    // แพ็คเกจ

    // ข้อมูลไอดีลำดับถัดไป
    const packageID = parseInt(dataManager.getLastValue(sheetPackagesInfo.packageID)) + 1 // ไอดีลำดับถัดไป

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      PackageID: packageID,
      PackageName: packageName,
      PlanID: planID
    }
    console.log('CreateData package item;', item)

    const createPackage = CreateData(sheetPackagesInfo, item) // สร้างข้อมูลแพ็คเกจ
    result = createPackage // ผลการสร้างข้อมูล
    console.log('result package;', result)

    // ----------------------------------------------------
    // รายการและวงเงินความคุ้มครอง

    // ตรวจสอบการสร้างข้อมูล
    if (createPackage.state) { // สร้างแพ็คเกจสำเร็จ
      // ----------------------------------------------------
      // อ่านข้อมูล Coverage lists รายการความคุ้มครอง
      const sheetCoverage = SHEET_HS_COVERAGE_LISTS // ชื่อชีท
      const sheetCoverageInfo = GetSheetInfo(sheetCoverage) // ข้อมูลชีท

      // อ่านข้อมูลจากชีท
      const dataManagerCoverage = EasyLifeLibrary.NewDataManagerClass(sheetCoverageInfo)
      const readCoverage = dataManagerCoverage.readLastRows(0) // อ่านข้อมูล
      console.log('coverage;', readCoverage)

      // เตรียมข้อมูลเพื่อบันทึก
      const limits = GetDataFormHsPackageLimit(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค
      // const limits = GetDataFormHsPackageLimit() // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค
      console.log('limits;', limits)
      let itemDetails = []
      limits.forEach(function (data) {
        console.log('data;', data)
        let coverage = readCoverage.find(res => res.NeedValueID === data.needValueID)
        console.log('coverage;', coverage)
        let temp = {
          TimeStamp: new Date().toLocaleString(),
          PackageID: packageID,
          NeedValueID: coverage.NeedValueID,
          Item: coverage.Item,
          Limit: data.limit
        }
        itemDetails.push(temp)
      })
      console.log('itemDetails;', itemDetails)

      result = CreateDataMultiRows(GetSheetInfo(SHEET_HS_PACKAGE_DETAILS), itemDetails) // สร้างข้อมูลรายการและวงเงินความคุ้มครอง
    }
  } else { // ข้อมูลซ้ำ
    result = TemplateExistData(sheetPackages, dataExist) // ข้อความแจ้งเตือน ข้อมูลซ้ำ
  }
  console.log('result;', result)

  return result
}



// **************************************************** //
// แก้ไขข้อมูล
// **************************************************** //
function EditDataHsPackage(_formObj) {
  const result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์

  const planID = _formObj.planID // ไอดีแผนประกัน
  const packageID = _formObj.packageID // ไอดีแพ็คเกจประกัน
  const packageName = _formObj.packageName // ชื่อแพ็คเกจ
  // const planID = '1'
  // const packageName = 'HS1000'

  const sheetPackages = SHEET_HS_PACKAGES // ชีทแพ็คเกจ
  const sheetPackagesInfo = GetSheetInfo(sheetPackages) // ข้อมูลชีทแพ็คเกจ
  const criteriaObj = [
    { header: sheetPackagesInfo.packageID, value: packageID },
    { header: sheetPackagesInfo.packageName, value: packageName }
  ] // เงื่อนไขสำหรับค้นหาชื่อซ้ำ(ชื่อแพ็คเกจ)
  console.log('crit1;', criteriaObj)

  // const sheetName = _sheetInfo.sheetName // ชื่อชีท
  // const keyHeader = _sheetInfo.keyHeader // ชื่อคีย์เฮดเดอร์
  const dataForm = GetDataFormHsPackageLimit(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค

  // ตรวจสอบข้อมูลซ้ำ โค้ด, ชื่อภาษาไทย และ ชื่อภาษาอังกฤษ
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetPackagesInfo)
  const dataExist = dataManager.getDataExistOr(criteriaObj) // อ่านข้อมูลจากชีท
  console.log('dataExist;', dataExist)

  // ตรวจสอบข้อมูลซ้ำ
  const existLength = dataExist.length // จำนวนข้อมูลที่ซ้ำกัน
  // if ((existLength === 0) || ((existLength === 1) && (dataExist[0].PlanID === dataForm.dataID))) {
  if (existLength === 0) { // ไม่พบข้อมูลซ้ำ
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
      Code: dataForm.code,
      NameTH: dataForm.nameTH,
      NameEN: dataForm.nameEN,
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



// **************************************************** //
// ค้นหาข้อมูล
// **************************************************** //
function SearchDataHsPackage(_criteria) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  // อินพุตเงื่อนไข
  const planID = _criteria[0].value
  const packageID = _criteria[1].value
  const insurerID = _criteria[2].value

  const insurerCriteriaObj = (insurerID !== '') ? [{ header: 'InsurerID', value: insurerID }] : []
  // console.log('insurerCriteriaObj:', insurerCriteriaObj)

  const packageCriteria = [
    { header: 'PlanID', value: planID },
    { header: 'PackageID', value: packageID }
  ] // เงื่อนไขสำหรับค้นหาแพ็คเกจ

  // เก็บเฉพาะเงื่อนไขที่มีการกรอกข้อมูล
  let packageCriteriaObj = []
  packageCriteria.forEach(crit => {
    if (crit.value !== '') {
      packageCriteriaObj.push(crit)
    }
  })
  // console.log('packageCriteriaObj:', packageCriteriaObj)

  // ข้อมูลบริษัทประกัน
  const insurerDataManager = EasyLifeLibrary.NewDataManagerClass(GetSheetInfo(SHEET_INSURERS))
  const insurerAllData = insurerDataManager.readLastRows(0)
  const insurerData = insurerAllData.find(res => res.InsurerID === insurerID) || null
  // console.log('insurerData:', insurerData)

  // ค้นหาข้อมูลแพ็คเกจประกัน
  let packages = [] // ข้อมูลแพ็คเกจที่ตรงเงื่อนไข
  if ((insurerCriteriaObj.length > 0) && (packageCriteriaObj.length === 0)) { // ค้นหาแพ็คเกจทั้งหมดของบริษัท

    // ข้อมูลแผนประกันของบริษัทในเงื่อนไข
    const planDataManager = EasyLifeLibrary.NewDataManagerClass(GetSheetInfo(SHEET_HS_PLANS))
    const planSearchData = planDataManager.readData(insurerCriteriaObj) // อ่านข้อมูลจากชีท
    // console.log('planSearchData:', planSearchData)

    // ข้อมูลแพ็คเกจประกันทั้งหมด
    const packageDataManager = EasyLifeLibrary.NewDataManagerClass(GetSheetInfo(SHEET_HS_PACKAGES))
    const packageAllData = packageDataManager.readLastRows(0)
    // console.log('packageAllData:', packageAllData)

    // เก็บข้อมูลเฉพาะแพ็คเกจที่เป็นของบริษัทเงื่อนไข และ เพิ่มไอดีบริษัท ชื่อบริษัทเข้าไป
    planSearchData.forEach(plan => {
      packageAllData.forEach(package => {
        if (plan.PlanID === package.PlanID) {
          let temp = package
          temp.InsurerID = insurerData.InsurerID
          temp.InsurerName = insurerData.Name
          packages.push(temp)
        }
      })
    })
  } else { // ค้นหาจากแผนและหรือแพ็คเกจ ทั้งระบุ/ไม่ระบุบริษัท

    // ข้อมูลแพ็คเกจประกัน
    const packageDataManager = EasyLifeLibrary.NewDataManagerClass(GetSheetInfo(SHEET_HS_PACKAGES))
    const packageSearchData = packageDataManager.readData(packageCriteriaObj) // อ่านข้อมูลจากชีท
    // console.log('packageSearchData:', packageSearchData)

    // ค้นหาและเพิ่มข้อมูลบริษัทเข้าไปในข้อมูลแพ็คเกจประกัน
    if (packageSearchData.length > 0) { // พบข้อมูลแพ็คเกจ
      const planIDSearch = packageSearchData[0].PlanID
      const planCriteria = [
        { header: 'PlanID', value: planIDSearch },
        { header: 'InsurerID', value: insurerID }
      ] // เงื่อนไขสำหรับค้นหา

      // เก็บเฉพาะเงื่อนไขที่มีการกรอกข้อมูล
      let planCriteriaObj = []
      planCriteria.forEach(crit => {
        if (crit.value !== '') {
          planCriteriaObj.push(crit)
        }
      })
      // console.log('planCriteriaObj:', planCriteriaObj)

      // ข้อมูลแผนประกัน
      const planDataManager = EasyLifeLibrary.NewDataManagerClass(GetSheetInfo(SHEET_HS_PLANS))
      const planSearchData = planDataManager.readData(planCriteriaObj)
      // console.log('planSearchData:', planSearchData)

      // หาไอดีบริษัท ชื่อบริษัท เพิ่มเข้าไปในข้อมูลแพ็คเกจ
      if (planSearchData.length > 0) {
        const insurerIDSearch = planSearchData[0].InsurerID
        const insurerInfo = insurerAllData.find(res => res.InsurerID === insurerIDSearch) || null
        packageSearchData.forEach(package => {
          let temp = package
          temp.InsurerID = insurerInfo.InsurerID
          temp.InsurerName = insurerInfo.Name
          packages.push(temp)
        })
      }
    }
  }

  // ตรวจสอบการอ่านข้อมูล
  if (packages.length > 0) { // พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = ConvertDataObjectToArrayHsPackage(packages) // แปลงข้อมูลเพื่อส่งไปแสดงใน Datatalbes
  } else { // ไม่พบข้อมูล
    result.state = true
    result.message = PROCESS_MSG_READ_SUCCESS
    result.values = []
  }

  return result
}



// function GetDataFormHsPackageLimit(_formObj) {
function GetDataFormHsPackageLimit() {
  const inputNumber = 35
  let result = []
  for (let i = 0; i < inputNumber; i++) {
    let needValueID = 'VID' + Utilities.formatString('%02d', i + 1)
    let limit = _formObj.limit[i].trim()
    // let limit = '1000'
    let temp = {
      needValueID: needValueID,
      limit: limit
    }
    result.push(temp)
  }

  return result

  return {
    'VID01': _formObj.limit[0].trim(),
    'VID02': _formObj.limit[1].trim(),
    'VID03': _formObj.limit[2].trim(),
    'VID04': _formObj.limit[3].trim(),
    'VID05': _formObj.limit[4].trim(),
    'VID06': _formObj.limit[5].trim(),
    'VID07': _formObj.limit[6].trim(),
    'VID08': _formObj.limit[7].trim(),
    'VID09': _formObj.limit[8].trim(),
    'VID10': _formObj.limit[9].trim(),
    'VID11': _formObj.limit[10].trim(),
    'VID12': _formObj.limit[11].trim(),
    'VID13': _formObj.limit[12].trim(),
    'VID14': _formObj.limit[13].trim(),
    'VID15': _formObj.limit[14].trim(),
    'VID16': _formObj.limit[15].trim(),
    'VID17': _formObj.limit[16].trim(),
    'VID18': _formObj.limit[17].trim(),
    'VID19': _formObj.limit[18].trim(),
    'VID20': _formObj.limit[19].trim(),
    'VID21': _formObj.limit[20].trim(),
    'VID22': _formObj.limit[21].trim(),
    'VID23': _formObj.limit[22].trim(),
    'VID24': _formObj.limit[23].trim(),
    'VID25': _formObj.limit[24].trim(),
    'VID26': _formObj.limit[25].trim(),
    'VID27': _formObj.limit[26].trim(),
    'VID28': _formObj.limit[27].trim(),
    'VID29': _formObj.limit[28].trim(),
    'VID30': _formObj.limit[29].trim(),
    'VID31': _formObj.limit[30].trim(),
    'VID32': _formObj.limit[31].trim(),
    'VID33': _formObj.limit[32].trim(),
    'VID34': _formObj.limit[33].trim(),
    'VID35': _formObj.limit[34].trim()
  }
}

// function GetDataFormHsPackage(_formObj) {
//   return {
//     planID: _formObj.planID,
//     packageID: _formObj.dataID,
//     packageName: _formObj.packageName
//   }
// }



function ConvertDataObjectToArrayHsPackage(_items) {
  let result = []
  _items.forEach((item) => {
    let buff = []
    buff.push(item.PackageID)
    buff.push(item.PackageName)
    buff.push(item.InsurerName)
    buff.push('Action-Button')

    result.push(buff)
  })

  return result
}


