#!/usr/bin/env node

const DrinkList = require('./lib/drinkList.js')

async function main () {
  const searchOpt = ['seasonal']

  const drinkList = new DrinkList(searchOpt)

  const productName = await drinkList.productName()
  const catchcopy = await drinkList.catchcopy()
  const note = await drinkList.note()

  console.log(
`----------------------
現在の季節限定ドリンク
----------------------
`)

  productName.forEach((item, i) => {
    console.log(
`${i + 1}. ${productName[i]}

〜 ${catchcopy[i]} 〜

${note[i]}

`)
  })
}

main()
