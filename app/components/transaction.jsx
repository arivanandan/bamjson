const {postJSON} = require('io-square-browser')
const React = require('react')
const {hashHistory} = require('react-router')

const Transaction = React.createClass({
  handleSelect: function (e) {
    let toacc = this.refs.toacc.value
    let {tid, fromacc} = this.props
    let obj = {
      tid : tid,
      toacc: toacc,
      fromacc: fromacc
    }
    postJSON('/updatedata', obj).then((...a) => {
      this.props.getUserData()
    })
  },
  render: function () {
    let {tdate, tdetails, tamount, bal, toacc, fromacc, ttype} = this.props
    tdate = `${tdate.substr(6, 2)}-${tdate.substr(4, 2)}-${tdate.substr(0, 4)}`
    let type, optionBg
    if (ttype == 'credit' || ttype == 'CREDIT') {
      type = 'Cr'
      optionBg = 'optionCr'
    } else {
      type = 'Db'
      optionBg = 'optionDb'
    }
    let renderToAcc = () => {
      if (!toacc) {
        return (
          <div className='small-4 columns' style={{fontSize: '12px'}}>
             <select ref='toacc' name='toacc' onChange={this.handleSelect} className = 'txSelect'>
              <option value='Bank' className = {optionBg}>Bank</option>
              <option value='Cash' className = {optionBg}>Cash</option>
              <option value='Expense' className = {optionBg}>Expense</option>
              <option value='Fixed Asset' className = {optionBg}>Fixed Asset</option>
              <option value='Income' className = {optionBg}>Income</option>
              <option value='Shareholders Capital' className = {optionBg}>Shareholders Capital</option>
             </select>
           </div>
        )
      }
      return (
        <div className='small-4 columns' style={{fontSize: '16px'}}>
          {toacc}
        </div>
     )
    }
    return (
      <div className={type}>
        <div className='card-section'>
            <div className='row' style={{fontSize: '16px'}}>
              <div className='small-2 columns' style={{textAlign: 'left'}}>
                {tdate}
              </div>
              <div className='small-6 columns' style={{textAlign: 'left', wordWrap:'break-word'}}>
                {tdetails}
              </div>
              <div className='small-2 columns' style={{textAlign: 'right'}}>
              {tamount}₹<span style = {{fontSize: '12px'}} >  {type}</span>
              </div>
            </div>
            <br></br>
            <div className='row'>
                  <div className='small-2 columns' style={{textAlign: 'left'}}>
                    To account
                 </div>
                 {renderToAcc()}
                  <div className='small-6 columns' style={{textAlign: 'right'}}>
                     Balance: {bal}
                  </div>
              </div>
          </div>
        </div>
    )
  }
})

module.exports = Transaction
