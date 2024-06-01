function AddDataRiderContract(_formObj, _sheetInfo, _folderID) {
  // Set result variable
  let result = Lib_wss.ResultInit(false)
  // Spreadsheet
  const spreadsheetID = _sheetInfo.spreadsheetID
  const sheetName = _sheetInfo.sheet
  const keyHeader = _sheetInfo.keyHeader
  // Get data form
  const dataForm = GetDataRiderContractForm(_formObj)
  // Check exist item
  const criteriaObj = [
    { header: _sheetInfo.headerCode, value: dataForm.Code },
    { header: _sheetInfo.headerNameTH, value: dataForm.NameTH },
    { header: _sheetInfo.headerNameEN, value: dataForm.NameEN }
  ]
  const existCriteria = Lib_wss.ExistCriteriaOR(spreadsheetID, sheetName, criteriaObj, keyHeader)
  if (!existCriteria) {
    // ******************** New item ********************
    // Get next data-id
    const headers = GetHeaders(sheetName)
    const newDataID = Lib_wss.GetNextIDWithFormat(spreadsheetID, sheetName, headers, keyHeader, RIDERCONTRACT_ID_SETTING)
    // Get & upload file
    // Get default profile picture
    let imageID = null
    let urls = null
    let lh5 = null
    // Check upload
    if (dataForm.brochure.length > 0) {
      // ******************** File uploaded ********************
      // Upload & get file information
      imageID = Lib_wss.UploadFile(_folderID, dataForm.brochure, newDataID)
      urls = Lib_wss.GetImageUrl(imageID)
      lh5 = urls.lh5
    } else {
      // ******************** Default profile picture ********************
      imageID = GetDefaultProfileImage(sheetName, newDataID)
      urls = Lib_wss.GetImageUrl(imageID)
      lh5 = urls.lh5
    }
    // Set data for create item
    const item = {
      TimeStamp: new Date().toLocaleString(),
      ContractID: newDataID,
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
    // Create item
    result = CreateData(_sheetInfo, item)
  } else {
    // ******************** Exist item ********************
    result = TemplateExistDataRiderContract(sheetName, dataForm, existCriteria)
  }
  // Return
  return result
}

function EditDataRiderContract(_formObj, _sheetInfo, _folderID) {
  // Set result variable
  let result = Lib_wss.ResultInit(false)
  // Spreadsheet
  const spreadsheetID = _sheetInfo.spreadsheetID
  const sheetName = _sheetInfo.sheet
  const keyHeader = _sheetInfo.keyHeader
  // const headerFirstname = _sheetInfo.headerFirstname
  // const headerLastname = _sheetInfo.headerLastname
  // Get data form
  const dataForm = GetDataRiderContractForm(_formObj)

  // Check exist item
  const criteriaObj = [
    { header: _sheetInfo.headerCode, value: dataForm.Code },
    { header: _sheetInfo.headerNameTH, value: dataForm.NameTH },
    { header: _sheetInfo.headerNameEN, value: dataForm.NameEN }
  ]
  const existCriteriaOR = Lib_wss.ExistCriteriaOR(spreadsheetID, sheetName, criteriaObj, keyHeader)
  // let existItem = {
  //   dataID: item[_keyHeader],
  //   header: criteria.header,
  //   value: criteria.value
  // }
  // result.push(existItem)
  let existCriteria = null
  if (existCriteriaOR) {
    existCriteria = []
    existCriteriaOR.forEach(item => {
      if (item.dataID !== dataForm.dataID) {
        let buff = {
          dataID: item.dataID,
          header: item.header,
          value: item.value
        }
        existCriteria.push(buff)
      }
    })
    if (existCriteria.length === 0) {
      existCriteria = null
    }
  }

  if (!existCriteria) {
    // Check exist item
    // const criteriaObj = [
    //   { header: _sheetInfo.headerFirstname, value: dataForm.firstname },
    //   { header: _sheetInfo.headerLastname, value: dataForm.lastname }
    // ]
    // const existItem = Lib_wss.ReadItem(spreadsheetID, sheetName, criteriaObj)
    // if ((!existItem) || ((existItem) && (existItem.item.CustomerID === dataForm.dataID))) {
    // Get & upload file
    // Get default profile picture
    const criteriaOldItemObj = [
      { header: keyHeader, value: dataForm.dataID }
    ]
    const readItem = Lib_wss.ReadItem(spreadsheetID, sheetName, criteriaOldItemObj)
    const oldItem = readItem.item
    let imageID = oldItem.BrochureID
    let lh5 = oldItem.BrochureUrl
    // Check file upload
    if (dataForm.brochure.length > 0) {
      // ******************** File uploaded ********************
      // Delete file
      const deleteFile = Lib_wss.DeleteFile(imageID)
      // Upload & get file info
      imageID = Lib_wss.UploadFile(_folderID, dataForm.brochure, dataForm.dataID)
      const urls = Lib_wss.GetImageUrl(imageID)
      lh5 = urls.lh5
    }
    // Set data for update item
    const item = {
      TimeStamp: new Date().toLocaleString(),
      ContractID: dataForm.dataID,
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
    // Update item
    result = UpdateData(_sheetInfo, item)
  } else {
    // ******************** Exist item ********************
    result = TemplateExistDataRiderContract(sheetName, dataForm, existCriteria)
  }
  // Return
  return result
}

function GetDataRiderContractForm(_formObj) {
  // Return
  return {
    dataID: _formObj.dataID,
    Code: _formObj.code,
    NameTH: _formObj.nameTH.trim(),
    NameEN: _formObj.nameEN,
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

function TemplateExistDataRiderContract(_sheetName, _dataForm, _Criteria) {
  let message = ''
  let count = 1
  const totalHeader = _Criteria.length
  _Criteria.forEach(item => {
    message += item.header + ': ' + item.value
    if (count < totalHeader) {
      message += ', '
    }
    count++
  })

  let result = Lib_wss.ResultInit(true)
  result.state = true
  result.message = 'ข้อมูลซ้ำ: ' + message + ' มีอยู่ในระบบแล้ว'
  result.values = {
    sheetName: _sheetName,
    duplicate: true
  }
  return result
}

function ConvertDataObjectToArrayRiderContract(_items) {
  let result = new Array
  _items.forEach((item) => {
    let buff = new Array
    buff.push(item.ContractID)
    buff.push(item.Code)
    buff.push(item.NameTH)
    buff.push(item.NameEN)
    buff.push(item.PremiumPaymentPeriodType + ' ' + item.PremiumPaymentPeriod)
    buff.push(item.ProtectionPeriodType + ' ' + item.ProtectionPeriod)
    buff.push(item.ContractType)
    buff.push(item.BrochureUrl)
    buff.push('Action-Button')

    result.push(buff)
  })
  // Return
  return result
}


// function getCountryList() {
// const DROPDOWNRANGE = "Helpers!A1:A195"; //COUNTRY LIST
//   countryList = readRecord(DROPDOWNRANGE);
//   return countryList;
// }

// // SEARCH RECORDS
// function searchRecords(formObject) {
//   let result = [];
//   try {
//     if (formObject.searchText) {//Execute if form passes search text
//       const data = readRecord(DATARANGE);
//       const searchText = formObject.searchText;

//       // Loop through each row and column to search for matches
//       for (let i = 0; i < data.length; i++) {
//         for (let j = 0; j < data[i].length; j++) {
//           const cellValue = data[i][j];
//           if (cellValue.toLowerCase().includes(searchText.toLowerCase())) {
//             result.push(data[i]);
//             break; // Stop searching for other matches in this row
//           }
//         }
//       }
//     }
//   } catch (err) {
//     console.log('Failed with error %s', err.message);
//   }
//   return result;
// }
