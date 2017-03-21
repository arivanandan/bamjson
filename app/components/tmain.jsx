const React = require('react')
const TransactionList = require('TransactionList')
const {getJSON} = require('io-square-browser')

const TMain = React.createClass({
  getUserData: function(){
     getJSON('/gettransaction').then((response) => {
      this.setState(
        {transactions: response.transactions}
      )
    })
  },
  componentDidMount: function () {
   this.getUserData()
  },
  render: function () {
    if (!this.state) {
      return (<div className = 'loadingContainer'>
        <img className = 'loadingSpin' src = 'bam.png'/>
        <span className = 'noData'>Pro Tip: If you don't have data, nothing is gonna happen.</span>
        <br></br>
        <span className = 'noData' style = {{fontSize: '8px'}}>Or maybe something failed. Try again maybe?</span>
      </div>)
    }
    let {transactions} = this.state
    return (
      <div>
        <TransactionList transactions={transactions} getUserData={this.getUserData}/>
      </div>
    )
  }
})

module.exports = TMain
