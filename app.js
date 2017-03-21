const http = require('http').createServer()
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const app = express()
const multer = require('multer')
const fs = require('fs')
const Mustache = require('mustache')

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/gettransaction', displayTx)
app.post('/upload', multer({ dest: './uploads/'}).single('upl'), uploadFiles)
app.post('/addTransaction', addTx)
app.post('/updatedata', updateTo)
app.post('/registername', registerName)
app.get('/getuserdetails', userDetails)
app.get('/viewGraph', graphData)
app.get('*', initialize)

app.listen(process.env.PORT || 3000, () => console.log(`Listening at port 3k`))

const loadRegister = res => res.send(Mustache.to_html(fs.readFileSync('public/register.html').toString()))
const loadHomePage = res => res.send(Mustache.to_html(fs.readFileSync('public/home.html').toString()))

function initialize (req, res) {
  const data = require('./data/data.json')
  if (data.name === '' || data.primaryBank === '') loadRegister(res)
  else loadHomePage(res)
 }

function registerName (req, res) {
  const {name, bank} = req.body
  const data = require('./data/data.json')

  data.name = name
  data.primaryBank = bank

  writeToJson(data, res)
}

function displayTx (req, res) {
  const data = require('./data/data.json')
  const out = data.data.axis.concat(data.data.icici.concat(data.data.federal))
  out.sort((a, b) => parseInt(a.tdate) > parseInt(b.tdate) ? -1 : 1)
  res.send({
    transactions: out
  })
}

function uploadFiles (req, res) {
  const bank = req.body.bank
  const fileType = req.body.filetype
  let  tdate, ttype, tamount, tdetails, bal, tcr, tdb, parser, dateCheck, counter = 0

  if (fileType == 'csv') parser = require(__dirname + '/scripts/csvParser')
  else parser = require(__dirname + '/scripts/xmlParser')
  const data = parser()

  const db = require('./data/data.json')
  if (db.data[bank].length !== 0) {
    dateCheck = db.data[bank][0].tdate
    counter = db.data[bank][db.data[bank].length].tid
  }
  if (db.data[bank].length === 0 || parseInt(dateCheck) < parseInt(dateFixer(dateReturn(data, bank)))) {
    for (let i = 0; i < data.length; i++) {
      if (bank === 'icici') [ , , tdate, , tdetails, tdb, tcr, bal] = data[i];
      if (bank === 'federal') [ , tdate, tdetails, , , , , tdb, tcr, bal] = data[i];
      if (bank === 'axis') [ , tdate, , tdetails, tdb, tcr, bal, ] = data[i];
      if (tdb == 0) {
      ttype = 'CREDIT'
      tamount = stripCommas(tcr)
      } else {
      ttype = 'DEBIT'
      tamount = stripCommas(tdb)
      }
      bal = stripCommas(bal)
      tdate = dateFixer(tdate)
      db.data[bank][db.data[bank].length] = {
        "tid": bank[0] + ++counter,
        "tdate": dateFixer(tdate),
        "fromacc": bank,
        "toacc" : "",
        "tamount": tamount,
        "tdetails": tdetails,
        "ttype": ttype,
        "bal": bal
      }
    }
    writeToJson(db, res)
  }
}

function addTx (req, res) {
  const data = req.body
  const db = require('./data/data.json')
  let [tDate1, tDate2, tDate3, toAcc, fromAcc, tType, tAmount, tDetails]
  = [data.tDate1, data.tDate2, data.tDate3, data.toAcc, data.fromAcc, data.tType, data.tAmount, data.tDetails]
  let bal = 0, counter = 0
  if (!addTxValidator(tDate1, tDate2, tDate3, tAmount)) {
    let html = Mustache.to_html(loadAddError())
    res.send(html)
    return null
  }
  if (tDate1.length != 2) tDate1 = datePad(tDate1, 2)
  if (tDate2.length != 2) tDate2 = datePad(tDate2, 2)
  if (tDate3.length != 4) tDate3 = datePad(tDate3, 4)
  let tDate = dateFixer(`${tDate1}-${tDate2}-${tDate3}`)
  let bank = fromAcc.toLowerCase()
  if (db.data[bank].length !== 0) {
    bal = db.data[bank][db.data[bank].length - 1].bal
    counter = parseInt((db.data[bank][db.data[bank].length - 1].tid).substr(1))
  }
  if (tType == 'Credit') bal += parseInt(stripCommas(tAmount))
  else bal -= parseInt(stripCommas(tAmount))
  const out = {
    "tid": bank[0] + ++counter,
    "tdate": tDate,
    "fromacc": bank,
    "toacc" : toAcc,
    "tamount": tAmount,
    "tdetails": tDetails,
    "ttype": tType,
    "bal": bal
  }
  db.data[bank].push(out)
  writeToJson(db, res)

}

function updateTo (req, res) {
  const {tid, fromacc, toacc} = req.body
  const db = require('./data/data.json')

  for(let i = 0; i < db.data[fromacc].length; i++)
    if (tid === db.data[fromacc][i].tid) {
      db.data[fromacc][i].toacc = toacc
      break
  }

  writeToJson(db, res)
}

function userDetails (req, res) {
  const data = require('./data/data.json')
  res.send({
    name: data.name,
    bank: data.primaryBank
  })
}

function graphData (req, res) {
  const data = require('./data/data.json')
  const out = []
  if (data.data.axis.length !== 0) out.push({
    "bal": data.data.axis[data.data.axis.length - 1].bal,
    "fromacc": "AXIS"
  })
  if (data.data.icici.length !== 0) out.push({
    "bal": data.data.icici[data.data.icici.length - 1].bal,
    "fromacc": "ICICI"
  })
  if (data.data.federal.length !== 0) out.push({
    "bal": data.data.federal[data.data.federal.length - 1].bal,
    "fromacc": "FEDERAL"
  })
  res.send(out)
}

function stripCommas(amount) {
  return parseInt(amount.replace(/,/g, ''))
}

function dateFixer (date) {
  return date.replace(/\//g, '-')
  .split('-')
  .reverse()
  .reduce((acc, cur) => acc + cur, '')
}

function dateReturn (data, bank) {
  let tDate
  if (bank === 'icici') [ , , tDate, , , , , ] = data[0];
  if (bank === 'federal') [ , tDate, , , , , , , , ] = data[0];
  if (bank === 'axis') [ , tDate, , , , , , ] = data[0];
  return tDate
}

function addTxValidator (tDate1, tDate2, tDate3, tAmount) {
  if (tDate1.length > 2) return false
  if (tDate2.length > 2) return false
  if (tDate3.length > 4) return false

  if ((parseInt(stripCommas(tAmount))).toString() === 'NaN') return false

  return true
}

function datePad (date, number) {
  return number === 2 ? new Array (number - date.length + 1).join('0') + date
  : 2017
}

function writeToJson (inData, res) {
  const fs = require('fs')
  const data = JSON.stringify(inData, null, 2)
  fs.writeFile('./data/data.json', data, (err) => {
    if (err) console.log('Error: \n', err)
    else res.redirect('/')
  })
}
