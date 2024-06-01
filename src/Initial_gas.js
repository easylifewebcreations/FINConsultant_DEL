// function SetContantResource() {
//   // Set result variable
//   let result = Lib_wss.ResultInit(false)
//   // Get parent folder application
//   const parentFolder = GetParentFolderApp()
//   // Setting folders & files
//   const folderResource = FolderResourceSetting(parentFolder, SHEET_FORDERS)
//   const fileResource = FileResourceSetting(parentFolder, SHEET_FILES)
//   if (folderResource.state && fileResource.state) {
//     result.state = true
//     result.message = PROCESS_MSG_SAVE_SUCCESS
//   } else if (folderResource.state) {
//     result.state = false
//     result.message = folderResource.message
//   } else if (fileResource.state) {
//     result.state = false
//     result.message = fileResource.message
//   }
//   // Return result
//   return result
// }

// function FolderResourceSetting(_parentFolder, _sheet) {
//   // Get all folder
//   let folderArr = new Array
//   const folders = _parentFolder.getFolders()
//   while (folders.hasNext()) {
//     let folder = folders.next()
//     let temp = {
//       Code: '-',
//       Name: folder.getName().toLowerCase(),
//       ID: folder.getId()
//     }
//     folderArr.push(temp)

//     let subFolders = folder.getFolders()
//     while (subFolders.hasNext()) {
//       let subFolder = subFolders.next()
//       let tempSub = {
//         Code: '-',
//         Name: subFolder.getName().toLowerCase(),
//         ID: subFolder.getId()
//       }
//       folderArr.push(tempSub)
//     }
//   }
//   // Update initial file
//   // Set result variable
//   let result = Lib_wss.ResultInit(false)
//   // Read item
//   // const initInfo = InitialSpreadsheetInfo()
//   // const spreadsheetID = initInfo.spreadsheetID
//   const spreadsheetID = GetInitSpreadsheetID()
//   const sheetInfo = GetSheetInfo(_sheet)
//   // const spreadsheetID = sheetInfo.spreadsheetID
//   const sheetName = sheetInfo.sheet
//   const keyHeader = sheetInfo.keyHeader
//   const headers = GetHeaders(sheetName)
//   const items = Lib_wss.ReadItems(spreadsheetID, sheetName, 0)
//   let counter = 0
//   items.forEach(item => {
//     for (let i = 0; i < folderArr.length; i++) {
//       if (folderArr[i].Name.toLowerCase() === item.Name.toLowerCase()) {
//         let value = {
//           Code: item.Code,
//           Name: item.Name,
//           ID: folderArr[i].ID
//         }
//         // let updateItem = Lib_wss.UpdateItem(spreadsheetID, sheetName, keyHeader, value)
//         let criteriaObj = [{ header: keyHeader, value: item.Name }]
//         let updateItem = Lib_wss.UpdateItem(spreadsheetID, sheetName, headers, criteriaObj, value)
//         counter++
//         continue
//       }
//     }
//   })
//   // Re-check item-list and folder-list
//   if (counter === items.length) {
//     result.state = true
//   } else {
//     result.message = 'Folder: ' + PROCESS_MSG_UNCOMPLETE
//   }
//   // Return result
//   return result
// }

// function FileResourceSetting(_parentFolder, _sheet) {
//   // Get all spreadsheet
//   const targetType = 'spreadsheet'
//   let fileArr = new Array
//   const files = _parentFolder.getFiles()
//   while (files.hasNext()) {
//     let file = files.next()
//     let splits = file.getMimeType().split('.')
//     let fileType = splits[splits.length - 1]
//     if (fileType === targetType) {
//       let temp = {
//         Code: '-',
//         Name: file.getName().toLowerCase(),
//         ID: file.getId()
//       }
//       fileArr.push(temp)
//     }
//   }
//   // Update initial file
//   // Set result variable
//   let result = Lib_wss.ResultInit(false)
//   // Read item
//   // const initInfo = InitialSpreadsheetInfo()
//   // const spreadsheetID = initInfo.spreadsheetID
//   const spreadsheetID = GetInitSpreadsheetID()
//   const sheetInfo = GetSheetInfo(_sheet)
//   // const spreadsheetID = sheetInfo.spreadsheetID
//   const sheetName = sheetInfo.sheet
//   const keyHeader = sheetInfo.keyHeader
//   const headers = GetHeaders(sheetName)
//   const items = Lib_wss.ReadItems(spreadsheetID, sheetName, 0)
//   let counter = 0
//   items.forEach(item => {
//     for (let i = 0; i < fileArr.length; i++) {
//       if (fileArr[i].Name.toLowerCase() === item.Name.toLowerCase()) {
//         let value = {
//           Code: item.Code,
//           Name: item.Name,
//           ID: fileArr[i].ID
//         }
//         let criteriaObj = [{ header: keyHeader, value: item.Name }]
//         let updateItem = Lib_wss.UpdateItem(spreadsheetID, sheetName, headers, criteriaObj, value)
//         counter++
//         continue
//       }
//     }
//   })
//   // Re-check item-list and file-list
//   if (counter === (items.length - 1)) {
//     result.state = true
//   } else {
//     result.message = 'File: ' + PROCESS_MSG_UNCOMPLETE
//   }
  
//   return result
// }