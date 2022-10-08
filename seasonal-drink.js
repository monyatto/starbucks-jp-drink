const DrinkList = require('./lib/drinkList.js')

async function　main(){
const searchOpt = ["seasonal"]　 // drip espresso frappuccino tea others or

// const hotOrColdOpt = 'hot cold both others' //hot cold both others or

// const seasonalOpt = 'seasonal regular' //seasonal regular

// const outputItem = "name catchcopy note" //name catchcopy note

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
`${i+1}. ${productName[i]}

〜 ${catchcopy[i]} 〜

${note[i]}

`)});


// const catchcopy = new DrinkList(searchOpt).catchcopy()
// const note = new DrinkList(searchOpt).note()
}

main()
