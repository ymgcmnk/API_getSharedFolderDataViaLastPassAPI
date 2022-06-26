/**
 * スプレッドシートのレンジをクリアした後に値をセットする関数。
 */
function setValuesOnSheet() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('シート1');

  const values = forEach();
  // console.log(values);

  sheet.getRange(2, 1, values.length, values[0].length).clear();
  SpreadsheetApp.flush();
  sheet.getRange(2, 1, values.length, values[0].length).setValues(values);
}

// /**
//  * 複数階層オブジェクトを配列変換する関数　　forin版
//  * @return {array} values - getSharedFolderを叩いたレスポンスを配列化
//  */　
// function forin() {
//     // const response = getSharedFolderDataObjectViaLastPassAPI();
//   const values = []; // 空の配列を用意

//   for (const folderId in response) {　// Key=folderId　　responseの中にあるfolderId分、反復処理する
//     // console.log(folderId); // ex: 12345678

//     const users = response[folderId]['users'];          // 各オブジェクトの users プロパティ取り出しておく
//     // console.log(users);

//     for (const user of users) {
//       // console.log(user);

//       const record = Object.values(response[folderId]); // [ 'hoge', false, 50, [[Object],[Object],[Object],[Object]] ]
//       // console.log(record);

//       const userInfo = Object.values(user);   // [ 'hoge@hoge.com', '0', '1', '1', false, '0' ]
//       // console.log(userInfo);

//       record[3] = userInfo;                   //record[3]を userInfoに置き換える[ 'hoge', false, 50, [ 'hoge@hoge.com', '0', '1', '1', false, '0' ]],
//       record.unshift(folderId);　//配列の先頭にfolderIdを入れる
//       values.push(record.flat());//配列にrecordを入れて、flatで一次元配列にする
//     }
//   }
//   console.log(values);
//   return  values;
// }

/**
 * 複数階層オブジェクトを配列変換する関数　forEach版
 * @return {array} values - getSharedFolderを叩いたレスポンスを配列化
 */

function forEach() {

  // const response = getSharedFolderDataObjectViaLastPassAPI();

  const sharedFolderIds = Object.keys(response);// オブジェクトの第1階層のKeyを全て取得。例　12345678
  // console.log(sharedFolderIds);

  const values = [];// 空の配列を用意
  sharedFolderIds.forEach(shareFolderId => {　// forEachで各shareFolderIdに対して処理
    const object = response[shareFolderId]; // オブジェクトの第2階層=各shareFolderIdの中身
    // console.log(object);

    const { sharedfoldername, deleted, score, } = object;　// 分割代入
    // console.log(sharedfoldername);

    const record = [shareFolderId, sharedfoldername, deleted, score];// 配列として値を格納
    // console.log(record);

    object.users.forEach(user => {　// forEachで各user対して処理
      const { username, readonly, give, can_administer, superadmin } = user;　// 分割代入
      const tmpRecord = [...record];// スプレッド構文。recordの要素をtmpRecordとして配列の中に展開。
      // console.log(tmpRecord);

      tmpRecord.push(username, readonly, give, can_administer, superadmin);
      values.push(tmpRecord);
    });
  });

  console.log(values);
  return  values;
}


/**
 * LastPassAPIを叩く関数
 * @return {object} obj - getSharedFolderを叩いたレスポンスのオブジェクト
 * NOTE:プロジェクトの設定＞スクリプト プロパティ　で設定しておく。
 * NOTE:要管理権限@LastPass
 * 
 * 参考
 * Use the LastPass Provisioning API
 * https://support.lastpass.com/help/use-the-lastpass-provisioning-api-lp010068
 * 
 * Get Shared Folder Data via LastPass API
 * https://support.lastpass.com/help/get-shared-folder-data-via-lastpass-api
 * 
 * Get Detailed Shared Folder Data via LastPass API
 * https://support.lastpass.com/help/get-detailed-shared-folder-data-via-lastpass-api
 * 
 * Where can I find the CID (account number) and API secret?
 * https://support.lastpass.com/help/where-can-i-find-the-cid-and-api-secret
 * 
 * Use the LastPass Enterprise API Postman Collection
 * https://support.lastpass.com/help/use-the-lastpass-enterprise-api-postman-collection
 * 
 * Enterprise API
 * https://admin.lastpass.com/advanced/enterpriseApi
 */
function getSharedFolderDataViaLastPassAPI() {
  const url = 'https://lastpass.com/enterpriseapi.php';
  const scriptProperties = PropertiesService.getScriptProperties();
  const cid = scriptProperties.getProperty('AccountNumber');
  const provhash = scriptProperties.getProperty('ProvisioningHash');

  const options = {
    "method": "POST",
    "header": { "Content-Type": "application/json", },
    "payload": {
      "cid": cid,
      "provhash": provhash,
      "cmd": "getsfdata",//getdetailedsfdata　だと　429エラー。　"getuserdata",　"getsfdata"は通る
      "data": "all"
    }
  }

  const response = UrlFetchApp.fetch(url, options);
  // console.log(`response: ${response}`);
  const obj = JSON.parse(response);
  // console.log(obj);
  return obj;
}

