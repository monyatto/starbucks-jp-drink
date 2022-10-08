const https = require('https')

module.exports = class DrinkList {
  static category = []
  static temperature = []
  static seasonal = []

  constructor (searchOpt) {
    try {
      if (searchOpt.length < 1) { throw new Error('there is no options. plese assign one or more options to searchOpt.') }

      const categoryOpt = ['drip', 'espresso', 'frappuccino', 'tea', 'others']
      const temperatureOpt = ['hot', 'cold', 'selectable', 'frozenAndOthers']
      const seasonalOpt = ['seasonal', 'regular']

      searchOpt.forEach((opt) => {
        if (categoryOpt.some(val => val === opt)) {
          DrinkList.category.push(opt)
        } else if (temperatureOpt.some(val => val === opt)) {
          DrinkList.temperature.push(opt)
        } else if (seasonalOpt.some(val => val === opt)) {
          DrinkList.seasonal.push(opt)
        } else {
          throw new Error(`${opt} is invalid option. plese assign correct options to searchOpt.`)
        }
      })
    } catch (e) {
      console.error('error: ', e.message)
      process.exit(1)
    }
  }

  static #formatData () {
    return new Promise(resolve => {
      try {
        https.get('https://product.starbucks.co.jp/api/category-product-list/beverage/index.json', (resp) => {
          let data = ''
          let json = ''

          resp.on('data', (chunk) => {
            data += chunk
          })

          resp.on('end', () => {
            json = JSON.parse(data)

            const standardStoreData = DrinkList.#eliminateStoreLimitedDrink(json)
            const filteredData = []
            if (DrinkList.category.length > 0) { filteredData.push(DrinkList.#filterByCategory(standardStoreData)) }
            if (DrinkList.temperature.length > 0) { filteredData.push(DrinkList.#filterByTemperature(standardStoreData)) }
            if (DrinkList.seasonal.length > 0) { filteredData.push(DrinkList.#filterBySeasonal(standardStoreData)) }
            const formatData = DrinkList.#extractCommonData(filteredData)
            resolve(formatData)
          })
        })
      } catch (e) {
        console.error('error: ', e.message)
        process.exit(1)
      }
    })
  }

  async productName () {
    const formatedData = await DrinkList.#formatData()
    const productNameData = Array.from(formatedData.map((data) => data.product_name))
    const replacedNameData = DrinkList.#replaceMark(productNameData)
    return Promise.resolve(replacedNameData)
  }

  async catchcopy () {
    const formatedData = await DrinkList.#formatData()
    const productCatchcopyData = Array.from(formatedData.map((data, i) => { return data.catchcopy }))
    const replacedCatchcopyData = DrinkList.#replaceMark(productCatchcopyData)
    return Promise.resolve(replacedCatchcopyData)
  }

  async note () {
    const formatedData = await DrinkList.#formatData()
    const productNoteData = Array.from(formatedData.map((data, i) => { return data.product_note }))
    const replacedNoteData = DrinkList.#replaceMark(productNoteData)
    const excludedHtmlTagData = DrinkList.#excludeHtmlTag(replacedNoteData)
    return Promise.resolve(excludedHtmlTagData)
  }

  static #replaceMark (productDataArray) {
    return productDataArray.map((data) => {
      if (data !== null) {
        return data.replace('&reg;', '®').replace('&sup3;', '³').replace('&trade;', '™')
      } else { return '' }
    })
  }

  static #excludeHtmlTag (replacedNoteData) {
    return replacedNoteData.map((data) => {
      return data.replace(/<br>/, `\n`).replace(/<(.*?)>/g, '')
    })
  }

  static #eliminateStoreLimitedDrink (json) {
    return json.filter(function (data) {
      return data.category2_list_path !== 'roastery' && data.store_limited_flg !== 1 && data.area_limited_flg !== 1
    })
  }

  static #filterByCategory (standardStoreData) {
    return DrinkList.category.map((category) => standardStoreData.filter(function (data) {
      return data.category2_list_path === category
    }))
  }

  static #filterByTemperature (standardStoreData) {
    return DrinkList.temperature.map((temperature) => standardStoreData.filter(function (data) {
      let filteredData = []
      if (temperature === 'hot') {
        filteredData = data.hot_cold === 1
      } else if (temperature === 'cold') {
        filteredData = data.hot_cold === 2
      } else if (temperature === 'selectable') {
        filteredData = data.hot_cold === 3
      } else if (temperature === 'frozenAndOthers') {
        filteredData = data.hot_cold === null
      }
      return filteredData
    }))
  }

  static #filterBySeasonal (standardStoreData) {
    return DrinkList.seasonal.map((seasonal) => standardStoreData.filter(function (data) {
      let filteredData = []
      if (seasonal === 'seasonal') {
        filteredData = data.recommend_flg === 1
      } else if (seasonal === 'regular') {
        filteredData = data.recommend_flg === 0
      }
      return filteredData
    }))
  }

  static #concatData (filteredData) {
    let concatedData = []
    if (filteredData.length > 1) {
      for (let i = 0; i < filteredData.length - 1; i++) {
        concatedData = filteredData[i].concat(filteredData[i + 1])
      }
    } else {
      concatedData = filteredData[0]
    }
    return concatedData
  }

  static #extractCommonData (filteredData) {
    if (filteredData.length === 1) {
      return DrinkList.#concatData(filteredData[0])
    } else if (filteredData.length === 2) {
      const connectedArray = [...filteredData[0], ...filteredData[1]]
      return connectedArray[0].filter(item => filteredData[0][0].includes(item) && filteredData[1][0].includes(item))
    } else {
      const connectedArray = [...filteredData[0], ...filteredData[1], ...filteredData[2]]
      return connectedArray[0].filter(item => filteredData[0][0].includes(item) && filteredData[1][0].includes(item) && filteredData[2][0].includes(item))
    }
  }
}
