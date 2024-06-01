// **************************************************** //
// เพิ่มข้อมูล
// **************************************************** //
function AddDataUser(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const dataForm = GetDataUserForm(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค
  const criteriaObj = [
    { header: _sheetInfo.username, value: dataForm.username }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านค่าข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  // const dataExist = dataManager.getDataExistOr(criteriaObj)
  const dataExist = dataManager.readData(criteriaObj)

  // ตรวจสอบมีข้อมูลซ้ำหรือไม่
  if (dataExist.length === 0) { // ไม่พบข้อมูล เป็นข้อมูลใหม่
    const newDataID = dataManager.getLastValue('UserID') + 1 // ไอดีลำดับถัดไป
    // ตรวจสอบมีการแนบไฟล์หรือไม่ ถ้าแนบไฟล์ ทำการลบไฟล์เก่าก่อน แล้วอัปโหลดไฟล์ใหม่
    // เตรียมตัวแปร
    let imageID = null
    let lh5 = null
    if (dataForm.profilePicture.length > 0) { // มีการแนบไฟล์
      // อัปโหลดไฟล์ และ เก็บ url
      imageID = EasyLifeLibrary.UploadFile(_folderID, dataForm.profilePicture, newDataID) // imageID
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // lh5
    } else { // ไม่มีการแนบไฟล์
      // ใช้ข้อมูลโปรไฟล์โดยปริยายของระบบ
      imageID = GetDefaultProfileImage(sheetName, newDataID) // ข้อมูล imageID โดยปริยาย
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // ข้อมูล lh5 โดยปริยาย
    }

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      UserID: newDataID,
      Username: dataForm.username,
      Password: EasyLifeLibrary.EncodeSignin(dataForm.username, DEFAULT_PASSWORD),
      Firstname: dataForm.firstname,
      Lastname: dataForm.lastname,
      Email: dataForm.email,
      ImageID: imageID,
      ImageLH5: lh5,
      Level: dataForm.level,
      Status: dataForm.status,
      ForceReset: YES
    }

    // กำหนดค่าโดยปริยาย เมื่อมีการลงทะเบียนโดยผู้ใช้งานเอง
    if (dataForm.formProcess === MODULE_USER_SIGNUP) {
      item.Level = 'ตัวแทนบริการ'
      item.Status = 'ENABLE'
      item.ForceReset = NO
    }

    result = CreateData(_sheetInfo, item) // สร้างข้อมูล
  } else { // ข้อมูลซ้ำ
    result.state = true
    result.message = 'ข้อมูลซ้ำ: ชื่อบัญชี [' + dataExist[0] + '] มีอยู่ในระบบแล้ว'
    result.values = {
      sheetName: sheetName,
      duplicate: true
    }
  }

  return result
}

// **************************************************** //
// แก้ไขข้อมูล
// **************************************************** //
// function EditDataUser() {
function EditDataUser(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const dataForm = GetDataUserForm(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค
  const criteriaObj = [
    { header: _sheetInfo.keyHeader, value: dataForm.dataID }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const readData = dataManager.readData(criteriaObj) // อ่านข้อมูลจากชีท
  if (readData.length > 0) { // มีข้อมูล
    const oldItem = readData[0] // เก็บข้อมูลเก่า เฉพาะอ็อบเจ็ค ไม่เอาอาร์เรย์
    let imageID = oldItem.ImageID // ข้อมูลเก่า imageID
    let lh5 = oldItem.ImageLH5 // ข้อมูลเก่า lh5

    // ตรวจสอบมีการแนบไฟล์หรือไม่ ถ้าแนบไฟล์ ทำการลบไฟล์เก่าก่อน แล้วอัปโหลดไฟล์ใหม่
    if (dataForm.profilePicture.length > 0) { // มีการแนบไฟล์ใหม่
      // ตรวจสอบข้อมูลก่อนลบไฟล์
      if (imageID !== '-') {
        const deleteFile = EasyLifeLibrary.DeleteFile(imageID) // ลบโปรไฟล์เก่า
      }

      // อัปโหลดไฟล์ และ เก็บ url
      imageID = EasyLifeLibrary.UploadFile(_folderID, dataForm.profilePicture, dataForm.dataID) // ข้อมูลใหม่ imageID
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // ข้อมูลใหม่ lh5
    }

    // เตรียมข้อมูลเพื่อบันทึกลงชีท
    const item = {
      TimeStamp: new Date().toLocaleString(),
      UserID: dataForm.dataID,
      // Username: oldItem.Username,
      // Password: oldItem.Password,
      Firstname: dataForm.firstname,
      Lastname: dataForm.lastname,
      Email: dataForm.email,
      ImageID: imageID,
      ImageLH5: lh5,
      Level: dataForm.level,
      Status: dataForm.status,
      // ForceReset: oldItem.ForceReset
    }

    result = UpdateData(_sheetInfo, item) // บันทึกข้อมูล
  } else { // ไม่พบข้อมูล
    result.state = false
    result.message = PROCESS_MSG_READ_FAILURE
  }

  return result
}

// **************************************************** //
// รีเซ็ทรหัสผ่าน
// **************************************************** //
function ResetPassword(_jsonData) {
  // อินพุต
  const data = JSON.parse(_jsonData)
  const sheetName = data.sheetName
  const dataID = data.dataID

  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheetName) // ข้อมูลชีท
  const criteriaObj = [
    { header: sheetInfo.keyHeader, value: dataID }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(sheetInfo)
  const readData = dataManager.readData(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบการอ่านข้อมูล
  if (readData.length > 0) { // มีข้อมูล
    // เตรียมข้อมูลเพื่อบันทึก
    const item = readData[0] // เก็บข้อมูลเก่า เฉพาะอ็อบเจ็ค ไม่เอาอาร์เรย์

     // ปรับปรุงข้อมูล
    item.TimeStamp = new Date().toLocaleString()
    item.Password = EasyLifeLibrary.EncodeSignin(item.Username, DEFAULT_PASSWORD)
    item.ForceReset = YES

    // บันทึกข้อมูล
    const updateData = dataManager.updateData(criteriaObj, item) // บันทึกข้อมูล
    dataManager.sortSheet('TimeStamp', 'asc') // จัดเรียงข้อมูลในชีท

    // ตรวจสอบการบันทึกข้อมูล
    if (updateData) { // บันทึกสำเร็จ
      result.state = true
      result.message = PROCESS_MSG_SAVE_SUCCESS
    } else { // บันทึกล้มเหลว
      result.state = false
      result.message = PROCESS_MSG_SAVE_FAILURE
    }
  } else { // ไม่พบข้อมูล
    result.state = false
    result.message = PROCESS_MSG_READ_FAILURE
  }

  return JSON.stringify(result)
}

// **************************************************** //
// แปลงข้อมูลอินพุตฟอร์มเป็นอ็อบเจ็ค
// **************************************************** //
function GetDataUserForm(_formObj) {
  return {
    formProcess: _formObj.formProcess,
    dataID: _formObj.dataID,
    username: _formObj.username.trim(),
    firstname: _formObj.firstname.trim(),
    lastname: _formObj.lastname.trim(),
    email: _formObj.email.trim(),
    profilePicture: _formObj.profilePicture,
    level: _formObj.level,
    status: _formObj.status,
  }
}

// **************************************************** //
// แปลงข้อมูลเป็นอาร์เรย์เพื่อแสดงด้วย datatables ส่งให้ client 
// **************************************************** //
function ConvertDataObjectToArrayUser(_items) {
  let result = [] // ผลลัพธ์
  // จัดเก็บข้อมูล
  _items.forEach((item) => {
    let buff = [] // ข้อมูลแถว
    buff.push(item.UserID)
    buff.push(item.ImageLH5)
    buff.push(item.Username)
    buff.push(item.Firstname)
    buff.push(item.Lastname)
    buff.push(item.Level)
    buff.push(item.Status)
    buff.push('Action-Button')
    result.push(buff)
  })

  return result
}