# starbucks-jp-drink
検索オプションを指定することで日本のStarbucksのドリンクの検索ができるmoduleです。
利用した場合のサンプルとして現在の季節のおすすめドリンクを表示するアプリが同梱されています。

※「STARBUCKS RESERVE® ROASTERY TOKYO」や「STARBUCKS Tea & Café」などの一部店舗限定メニューは検索対象外です。

## インストール
```shell
npm i -g starbucks-jp-drink
```

## サンプルプログラム
以下のコマンドでサンプルプログラム(季節のおすすめドリンクを表示するアプリ)が実行されます。

```shell
starbucks-jp-drink
```

![画面収録-2022-10-10-9 32 43](https://user-images.githubusercontent.com/83024928/194786919-1fa736c2-3487-4ccb-a1fd-b7094dd88bc7.gif)

## 検索方法
```js
const DrinkList = require('./lib/drinkList.js')

async function main () {
  const searchOpt = ['seasonal', 'espresso'] // 検索オプションを指定する（順不同）
  const drinkList = new DrinkList(searchOpt)

  const productName = await drinkList.productName() // ドリンク名を呼び出すメソッド
  const catchcopy = await drinkList.catchcopy() // ドリンクのキャッチコピーを呼び出すメソッド
  const note = await drinkList.note() // ドリンクの詳細説明を呼び出すメソッド

  // ドリンク名、キャッチコピー、詳細説明の各項目を呼び出す
  productName.forEach((item, i) => {
    console.log(
`${productName[i]}
${catchcopy[i]}
${note[i]}`
    )
  })
}

main()

```

### 検索オプションの分類
検索オプションは計11種類あり、以下の三つの分類に分けられます。

1. 飲み物の種類に関するもの
drip, espresso, frappuccino, tea, others

2. 温度（ホットやコールドなど）に関するもの
hot, cold, selectable, frozenAndOthers

3. 季節のおすすめかレギュラーメニューかに関するもの
seasonal, regular

### 検索の仕様について
- オプションの分類が同じものを複数指定するとor検索になります。
例: 同分類であるseasonalとregularを両方選択した場合、季節のおすすめドリンクまたは季節のおすすめではないドリンクのいずれかに当てはまるもの（つまりは全ドリンク）が出力されます。

- オプションの分類が異なるものを複数指定するとand検索になります。
例: 分類が異なるdripとhotを選択した場合、ドリップコーヒーかつホットのドリンクのみが出力されます。

### それぞれのオプションの詳細
1. 飲み物の種類に関するもの

|  オプション名  |  説明  |
| ---- | ---- |
|  drip  |  カテゴリーがドリップコーヒーのドリンク  |
|  espresso  |  カテゴリーがエスプレッソのドリンク  |
|  frappuccino  |  カテゴリーがフラペチーノのドリンク  |
|  tea  |  カテゴリーがお茶のドリンク  |
|  others  |  カテゴリーがその他のドリンク  |

2. 温度（ホットやコールドなど）に関するもの

|  オプション名  |  説明  |
| ---- | ---- |
|  hot  |  ホットのみ選択可能なドリンク  |
|  cold  |  コールドのみ選択可能なドリンク  |
|  selectable  |  ホットあるいはコールドを選択可能なドリンク  |
|  frozenAndOthers  |  フローズンドリンク（フラペチーノなど）やその他のドリンク  |

3. 季節のおすすめかレギュラーメニューかに関するもの

|  オプション名  |  説明  |
| ---- | ---- |
|  seasonal  |  現在の季節のおすすめに指定されているドリンク  |
|  regular  |  季節のおすすめに指定されていないドリンク  |
