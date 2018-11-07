const fs = require("fs")
const path = require("path")
const { version } = require("../package.json")

const xmlFile = path.resolve(__dirname, "../config.xml")
const xml = fs.readFileSync(xmlFile).toString()

/**
 * 匹配使用语义化版本控制的版本号
 * [0]
 * [1] 完整版本号
 * [2] 不含先行版本号及版本编译元数据的完整版本号
 * [3] 主版本号
 * [4] 次版本号
 * [5] 修订号
 * [6] 先行版本号
 * [7] 版本编译元数据(编译号)
 */
const r = /version="(((\d+)\.(\d+)\.(\d+))(?:-(\w+?))?(?:\+(\w+?))?)"/

const newxml = xml.replace(r, `version="${version}"`)
fs.writeFileSync(xmlFile, newxml)
