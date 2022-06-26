function test02() {
  const obj = { id: 'A001', name: 'Bob', age: 30 };
  const { age, name } = obj;
  console.log(name, age);
}


function test01() {
  // const sharedfolderIDs = Object.keys(response);
  // console.log(sharedfolderIDs);
  console.log(response["12345678"]);//12345678　のプロパティを取得
  console.log(response["12345678"]["sharedfoldername"]);//sharedfoldername　のプロパティを取得 ex.hoge
  console.log(response["12345678"]["users"][0]);//usersの配列の最初に入っているものを取得

  const users01 = response["12345678"]["users"][0];
  console.log(users01.username);//	ex.hoge@hoge.com
}
