function AddDataCustomer(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const dataForm = GetDataFormCustomer(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค 
  const criteriaObj = [
    { header: _sheetInfo.firstname, value: dataForm.firstname },
    { header: _sheetInfo.lastname, value: dataForm.lastname }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล

  // อ่านข้อมูลจากชีท
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const dataExist = dataManager.readData(criteriaObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบข้อมูลซ้ำ
  if (dataExist.length === 0) { // ไม่พบข้อมูล เป็นข้อมูลใหม่
    const newDataID = dataManager.getLastValue('CustomerID') + 1 // ไอดีลำดับถัดไป
    // ตรวจสอบมีการแนบไฟล์หรือไม่ ถ้าแนบไฟล์ ทำการลบไฟล์เก่าก่อน แล้วอัปโหลดไฟล์ใหม่
    let imageID = null // ไอดีไฟล์
    let lh5 = null // url lh5 ไฟล์
    if (dataForm.profilePicture.length > 0) { // มีการแนบไฟล์
      // อัปโหลดไฟล์ และ เก็บ url
      imageID = EasyLifeLibrary.UploadFile(_folderID, dataForm.profilePicture, newDataID) // อัปโหลดไฟล์ และ รับข้อมูล imageID
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // ข้อมูล lh5
    } else { // ไม่มีการแนบไฟล์
      // ใช้ข้อมูลโปรไฟล์โดยปริยายของระบบ
      imageID = GetDefaultProfileImage(sheetName, newDataID) // รับข้อมูล imageID ของไฟล์โดยปริยาย
      lh5 = EasyLifeLibrary.GetImageUrl(imageID).lh5 // รับข้อมูล lh5 ของไฟล์โดยปริยาย
    }

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      CustomerID: newDataID,
      Firstname: dataForm.firstname,
      Lastname: dataForm.lastname,
      Nickname: dataForm.nickname,
      Titles: dataForm.titles,
      Sex: dataForm.sex,
      ImageID: imageID,
      ImageLH5: lh5,
      Birthday: dataForm.birthday,
      Address: dataForm.address,
      Mobile: dataForm.mobile,
      Email: dataForm.email,
      Facebook: dataForm.facebook,
      Instagram: dataForm.instagram,
      Line: dataForm.line,
      Tiktok: dataForm.tiktok
    }

    result = CreateData(_sheetInfo, item) // สร้างข้อมูล
  } else { // ข้อมูลซ้ำ
    result.state = true
    result.message = 'ข้อมูลซ้ำ: ชื่อ [' + dataForm.firstname + ' ' + dataForm.lastname + '] มีอยู่ในระบบแล้ว'
    result.values = {
      sheetName: sheetName,
      duplicate: true
    }
  }

  return result
}

function EditDataCustomer(_formObj, _sheetInfo, _folderID) {
  let result = EasyLifeLibrary.ResultInit(false) // ผลลัพธ์
  const sheetName = _sheetInfo.sheetName // ชื่อชีท
  const keyHeader = _sheetInfo.keyHeader // ชื่อคีย์เฮดเดอร์
  const dataForm = GetDataFormCustomer(_formObj) // แปลงอินพุตฟอร์มเป็นอ็อบเจ็ค 
  const criteriaExistObj = [
    { header: _sheetInfo.firstname, value: dataForm.firstname },
    { header: _sheetInfo.lastname, value: dataForm.lastname }
  ] // เงื่อนไขสำหรับค้นหาข้อมูล ข้อมูลซ้ำ

  // ตรวจสอบข้อมูลซ้ำ ชื่อและนามสกุล
  const dataManager = EasyLifeLibrary.NewDataManagerClass(_sheetInfo)
  const dataExist = dataManager.readData(criteriaExistObj) // อ่านข้อมูลจากชีท

  // ตรวจสอบข้อมูลซ้ำ
  const existLength = dataExist.length // จำนวนข้อมูลที่ซ้ำกัน
  if ((existLength === 0) || ((existLength === 1) && (dataExist[0].CustomerID === dataForm.dataID))) {
    const criteriaOldObj = [
      { header: keyHeader, value: dataForm.dataID }
    ] // เงื่อนไขสำหรับค้นหาข้อมูล ข้อมูลเดิม

    // อ่านข้อมูลจากชีท
    const readData = dataManager.readData(criteriaOldObj)
    const oldItem = readData[0] // เก็บข้อมูลเก่า เฉพาะอ็อบเจ็ค ไม่เอาอาร์เรย์
    let imageID = oldItem.ImageID // ข้อมูลเดิม imageID
    let lh5 = oldItem.ImageLH5 // ข้อมูลเดิม lh5

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

    // เตรียมข้อมูลเพื่อบันทึก
    const item = {
      TimeStamp: new Date().toLocaleString(),
      CustomerID: dataForm.dataID,
      Firstname: dataForm.firstname,
      Lastname: dataForm.lastname,
      Nickname: dataForm.nickname,
      Titles: dataForm.titles,
      Sex: dataForm.sex,
      ImageID: imageID,
      ImageLH5: lh5,
      Birthday: dataForm.birthday,
      Address: dataForm.address,
      Mobile: dataForm.mobile,
      Email: dataForm.email,
      Facebook: dataForm.facebook,
      Instagram: dataForm.instagram,
      Line: dataForm.line,
      Tiktok: dataForm.tiktok
    }

    result = UpdateData(_sheetInfo, item) // บันทึกข้อมูล
  } else { // ข้อมูลซ้ำ
    result.state = EXIST
    result.message = 'ข้อมูลซ้ำ: ชื่อ [' + dataForm.firstname + ' ' + dataForm.lastname + '] มีอยู่ในระบบแล้ว'
    result.values = {
      sheetName: sheetName,
      duplicate: true
    }
  }

  return result
}

function GetDataFormCustomer(_formObj) {
  return {
    // sheet: _formObj.sheet,
    // modal: _formObj.modal,
    dataID: _formObj.dataID,
    firstname: _formObj.firstname.trim(),
    lastname: _formObj.lastname.trim(),
    nickname: _formObj.nickname.trim(),
    titles: _formObj.titles,
    sex: _formObj.sex,
    profilePicture: _formObj.profilePicture,
    birthday: _formObj.birthday.trim(),
    address: _formObj.address.trim(),
    mobile: EasyLifeLibrary.CheckPhoneNumber(_formObj.mobile.trim()),
    email: _formObj.email.trim(),
    facebook: _formObj.facebook.trim(),
    instagram: _formObj.instagram.trim(),
    line: _formObj.line.trim(),
    tiktok: _formObj.tiktok.trim()
  }
}

function ConvertDataObjectToArrayCustomer(_items) {
  let result = new Array
  _items.forEach((item) => {
    let buff = new Array
    buff.push(item.CustomerID)
    buff.push(item.ImageLH5)
    buff.push(item.Firstname)
    buff.push(item.Lastname)
    buff.push(item.Nickname)
    // buff.push(Utilities.formatDate(new Date(item.BirthDay), "GMT+7", "yyyy-MM-dd"))
    buff.push(item.Birthday)
    buff.push(item.Mobile)
    buff.push('Action-Button')
    result.push(buff)
  })

  return result
}
