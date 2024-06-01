// ขั้นตอนการใช้งานระบบ
// - customer buy services
// - owner generate code -> add code to server sheet -> send code to customer : status NON-ACTIVATED
// - client send request License register (use email & code) update status : ACTIVATED, add code to client
// - when code is status EXPIRED, cann't use web-app , keep data both server-client ไม่มีการแก้ไขข้อมูลใด ๆ
// - go to first step (customer buy services) new code, but can use old-email
// ...
// disabled account when ... เจอความผิดปกติ จะแก้ไขต้องติดต่อ owner

const MSG_LICENSE_REGISTER_FIRST = 'กรุณาลงทะเบียน'
const MSG_LICENSE_INPUT_FAILURE = 'ข้อมูลลงทะเบียนไม่ถูกต้อง'

const MSG_LICENSE_REGISTERED = 'ลงทะเบียนแล้ว'
const MSG_LICENSE_REGISTER_SUCCESS = 'ลงทะเบียนสำเร็จ'
const MSG_LICENSE_REGISTER_FAILURE = 'การลงทะเบียนล้มเหลว'

const MSG_LICENSE_CODE_EXPIRED = 'รหัสหมดอายุ'
const MSG_LICENSE_ALREADY_REGISTERED = 'บัญชีนี้ถูกใช้งานไปแล้ว'

const STATUS_ACTIVATED = 'ACTIVATED'
const STATUS_NONACTIVATED = 'NONACTIVATED'
const STATUS_EXPIRED = 'EXPIRED'
const STATUS_DISABLED = 'DISABLED'
const STATUS_DUPLICATE = 'DUPLICATE'
const STATUS_NONE = 'NONE'

const ACCOUNT_STATUS = [
  { status: STATUS_ACTIVATED, description: 'ลงทะเบียนแล้ว' },
  { status: STATUS_NONACTIVATED, description: 'ยังไม่ได้ลงทะเบียน' },
  { status: STATUS_EXPIRED, description: 'บัญชีนี้หมดอายุ' },
  { status: STATUS_DISABLED, description: 'บัญชีนี้ถูกปิดการใช้งาน' },
  { status: STATUS_DUPLICATE, description: 'บัญชี้นี้ถูกใช้งานไปแล้ว' },
  { status: STATUS_NONE, description: 'ไม่ได้ระบุสถานะบัญชี' }
]

function GetAccountStatus(_status) {
  return ACCOUNT_STATUS.find(result => result['status'] === _status)
}

// =======================================================
// =======================================================
// =======================================================
function GetLicense() {
  // Set result variable
  // let result = Lib_wss.ResultInit(false)
  let result = null
  // Spreadsheet & folder
  // Server spreadsheet
  const serverSheetInfo = GetSheetInfo(SHEET_MEMBER_DETAILS)
  // Client spreadsheet
  const clientSheetInfo = GetSheetInfo(SHEET_LICENSE)
  if (serverSheetInfo && clientSheetInfo) {
    // Server information
    const serverSpreadsheetID = serverSheetInfo.spreadsheetID
    const serverSheetName = serverSheetInfo.sheet
    // const serverKeyHeader = serverSheetInfo.keyHeader
    // const headerFileRefID = serverSheetInfo.headerFileRefID
    // Client information
    const clientSpreadsheetID = clientSheetInfo.spreadsheetID
    const clientSheetName = clientSheetInfo.sheet
    // const clientKeyHeader = clientSheetInfo.keyHeader
    // Read item
    const clientReadItem = Lib_wss.ReadItems(clientSpreadsheetID, clientSheetName, 1)
    if (clientReadItem) {
      // ******************** Found client member id ********************
      const clientItem = clientReadItem[0]
      const clientFileID = clientSpreadsheetID
      // Read item
      const headers = GetHeaders(clientSheetName)
      const criteriaObj = [
        { header: serverSheetInfo.keyHeader, value: clientItem.MemberID },
        { header: serverSheetInfo.headerFileRefID, value: clientFileID },
        { header: serverSheetInfo.headerEmail, value: clientItem.Email },
        { header: serverSheetInfo.headerCode, value: clientItem.Code }
      ]
      const serverReadItem = Lib_wss.ReadItem(serverSpreadsheetID, serverSheetName, criteriaObj)
      if (serverReadItem) {
        // ******************** Found server member-id ********************
        const serverItem = serverReadItem.item
        const clientUpdateItem = Lib_wss.UpdateItem(clientSpreadsheetID, clientSheetName, headers, criteriaObj, serverItem)
        if (clientUpdateItem) {
          const status = serverItem.Status
          let alertType = ''
          if (status === STATUS_ACTIVATED) {
            alertType = ALERT_TYPE_SUCCESS
          } else if (status === STATUS_NONACTIVATED) {
            alertType = ALERT_TYPE_INFO
          } else {
            alertType = ALERT_TYPE_ERROR
          }
          result = LicenseRegisterResult(true, alertType, null, GetAccountStatus(status), serverItem)
        } else {
          result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, PROCESS_MSG_SAVE_FAILURE + ' [Client]', GetAccountStatus(STATUS_NONE), null)
        }
      } else {
        // ******************** Not found server member id ********************
        result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, 'เกิดข้อผิดพลาด ข้อมูลบัญชีไม่ถูกต้อง โปรดติดต่อผู้ดูแล [License]', GetAccountStatus(STATUS_NONE), null)
      }

    } else {
      // ******************** Not found client member id ********************
      result = LicenseRegisterResult(false, ALERT_TYPE_INFO, MSG_LICENSE_REGISTER_FIRST, GetAccountStatus(STATUS_NONACTIVATED), null)
    }
  } else {
    // ******************** In-correct data ********************
    result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, PROCESS_MSG_OTHERWISE, GetAccountStatus(STATUS_NONE), null)
  }
  // Return
  return JSON.stringify(result)
}


// =======================================================
// =======================================================
// =======================================================
function LicenseRegister(_jsonData) {
  // Get json data
  const data = JSON.parse(_jsonData)
  const inputEmail = data.email
  const inputCode = data.code
  // Set result variable
  let result = null
  // Spreadsheet & folder
  // Server spreadsheet
  const serverSheetInfo = GetSheetInfo(SHEET_MEMBER_DETAILS)
  // Client spreadsheet
  const clientSheetInfo = GetSheetInfo(SHEET_LICENSE)
  if (serverSheetInfo && clientSheetInfo) {
    // Server information
    const serverSpreadsheetID = serverSheetInfo.spreadsheetID
    const serverSheetName = serverSheetInfo.sheet
    // Read item
    const criteriaObj = [
      { header: serverSheetInfo.headerEmail, value: inputEmail },
      { header: serverSheetInfo.headerCode, value: inputCode }
    ]
    const serverReadItem = Lib_wss.ReadItem(serverSpreadsheetID, serverSheetName, criteriaObj)
    if (serverReadItem) {
      const serverItem = serverReadItem.item
      const codeStatus = serverItem.Status
      if (codeStatus === STATUS_NONACTIVATED) {
        result = ActivateLicense(serverSheetInfo, serverItem, clientSheetInfo)
      } else if (codeStatus === STATUS_ACTIVATED){
        result = LicenseRegisterResult(true, ALERT_TYPE_INFO, GetAccountStatus(STATUS_DUPLICATE).description, GetAccountStatus(STATUS_DUPLICATE), serverItem)
      } else {
        result = LicenseRegisterResult(true, ALERT_TYPE_INFO, GetAccountStatus(codeStatus).description, GetAccountStatus(codeStatus), serverItem)
      }
    } else {
      // ******************** Not found item ********************
      result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, MSG_LICENSE_INPUT_FAILURE, GetAccountStatus(STATUS_NONE), null)
    }
  } else {
    // ******************** In-correct data ********************
    result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, PROCESS_MSG_OTHERWISE, GetAccountStatus(STATUS_NONE), null)
  }
  // Return
  return JSON.stringify(result)
}

// =======================================================
// =======================================================
// =======================================================
function ActivateLicense(_serverSheetInfo, _serverItem, _clientSheetInfo) {
  // Set result variable
  let result = null
  // Server information
  const serverSpreadsheetID = _serverSheetInfo.spreadsheetID
  const serverSheetName = _serverSheetInfo.sheet
  // Client information
  const clientSpreadsheetID = _clientSheetInfo.spreadsheetID
  const clientSheetName = _clientSheetInfo.sheet
  const clientKeyHeader = _clientSheetInfo.keyHeader
  _serverItem = {
    TimeStamp: new Date().toLocaleString(),
    MemberID: _serverItem.MemberID,
    Firstname: _serverItem.Firstname,
    Lastname: _serverItem.Lastname,
    Email: _serverItem.Email,
    Mobile: Lib_wss.CheckPhoneNumber(_serverItem.Mobile),
    ImageID: _serverItem.ImageID,
    ImageLH5: _serverItem.ImageLH5,
    FileRefID: clientSpreadsheetID,
    Code: _serverItem.Code,
    Status: STATUS_ACTIVATED,
    Package: _serverItem.Package,
    RegisterDate: Utilities.formatDate(new Date(), 'GMT+7', 'YYYY/MM/dd'),
    ExpireDate: Utilities.formatDate(new Date(new Date().getTime() + (_serverItem.Package * MILLI_PER_DAY)), 'GMT+7', 'YYYY/MM/dd')
  }
  // Updata server data
  const serverHeaders = GetHeaders(serverSheetName)
  const criteriaObj = [
    { header: clientKeyHeader, value: _serverItem.MemberID }
  ]
  const serverUpdateItem = Lib_wss.UpdateItem(serverSpreadsheetID, serverSheetName, serverHeaders, criteriaObj, _serverItem)
  if (serverUpdateItem) {
    const clientHeaders = GetHeaders(clientSheetName)
    result = AddClientLicense(clientSpreadsheetID, clientSheetName, clientHeaders, _serverItem)
  } else {
    result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, MSG_LICENSE_REGISTER_FAILURE + ' [Server]', GetAccountStatus(STATUS_NONACTIVATED), null)
  }
  // Return
  return result
}

function AddClientLicense(_spreadsheetID, _sheetName, _headers, _item) {
  let result = null
  // Clear content exclude header
  const clearContent = Lib_wss.ClearContent(_spreadsheetID, _sheetName)
  // Updata client data
  // const clientItem = _serverItem
  const createItem = Lib_wss.CreateItem(_spreadsheetID, _sheetName, _headers, _item)
  if (createItem) {
    result = LicenseRegisterResult(true, ALERT_TYPE_SUCCESS, MSG_LICENSE_REGISTER_SUCCESS, GetAccountStatus(STATUS_ACTIVATED), _item)
  } else {
    result = LicenseRegisterResult(false, ALERT_TYPE_ERROR, MSG_LICENSE_REGISTER_FAILURE + ' [Client]', GetAccountStatus(STATUS_NONACTIVATED), null)
  }
  // Return
  return result
}

function LicenseRegisterResult(_state, _type, _message, _account, _data) {
  // Return
  return {
    state: _state,
    alert: {
      type: _type,
      message: _message
    },
    account: {
      data: _data,
      status: _account.status,
      description: _account.description
    }
  }
}