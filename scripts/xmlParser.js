module.exports = () => {
  const xlsx = require('node-xlsx')
  const fs = require('fs')
  const files = fs.readdirSync('uploads')
  const obj = xlsx.parse('uploads/' + files[0])[0].data
  fs.unlinkSync('uploads/' + files[0])
  let counter = 1

  return obj.map(dat => dat
    .map(inDat => inDat.toString(10).trim())
    .map(strDat => strDat.replace(/ /g, '_'))
    .join(' ').trim().split(' ')
  )
  .filter(dat => {
    if (dat[0] == counter) {
      counter ++
      return true
    }
    return false
  })
}
