const React = require('react')
const {Link, IndexLink} = require('react-router')
const {getJSON} = require('io-square-browser')

const Nav = React.createClass({
  componentWillMount: function () {
      getJSON('/getuserdetails').then((response) => {
      response.name = (response.name).toUpperCase()
      response.bank = (response.bank).toUpperCase()
      this.setState({
          user : response.name,
          bank : response.bank
        })
    })
  },
  render: function () {
    if(!this.state){
      return (
        <div>
        <p></p>
        </div>
      )
    }
    return (
        <div className='top-bar' id = 'navBarIn'>
          <div className='top-bar-left'>
            <ul className='menu'>
              <li className='menu-text'>BAM</li>
              <li><Link to='/tx' activeClassName='active' activeStyle={{fontWeight: 'bold'}}>Transactions</Link></li>
              <li><Link to='/upload' activeClassName='active' activeStyle={{fontWeight: 'bold'}}>Import Bank Statements</Link></li>
              <li><Link to='/addtransaction' activeClassName='active' activeStyle={{fontWeight: 'bold'}}>Add Transaction</Link></li>
              <li><Link to='/viewgraph' activeClassName='active' activeStyle={{fontWeight: 'bold'}}>View Asset Split</Link></li>
             </ul>
          </div>
            <div className='top-bar-right'>
              <ul className='menu'>
                <li className='menu-text'>{this.state.user},</li>
                <li>{this.state.bank}</li>
              </ul>
            </div>
        </div>
      )
  }
})

module.exports = Nav
