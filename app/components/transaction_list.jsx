const React = require('react')
const Transaction = require('Transaction')

const TransactionList = React.createClass({
  render: function () {
    let {transactions} = this.props
    let renderTransactions = () => {
      return transactions.map((transaction) => {
        return (
          <Transaction key={transaction.tid} {...transaction} getUserData={this.props.getUserData}/>
        )
      })
    }
    return (
      <div>
        {renderTransactions()}
      </div>
    )
  }
})

module.exports = TransactionList
