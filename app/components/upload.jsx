const React = require('react')
const {hashHistory} = require('react-router')
const {getJSON} = require('io-square-browser')

const Upload = React.createClass({
  componentWillMount: function () {
      getJSON('/getuserdetails').then((response) => {
        if (response.bank) {
          this.setState({
              bank : response.bank,
              fileType: 'csv'
            })
        } else {
          this.setState({
            bank : 'select',
            fileType: 'csv'
          })
        }
    })
  },
  change: function () {
    if (!this.refs.uploadFile.value) {
      alert('Please upload a file.')
    }
    if (!this.state.submit) {
      if (!(((this.refs.uploadFile.value).substr(-3) === 'xls') ||
            ((this.refs.uploadFile.value).substr(-3) === 'csv'))) {
              alert('Please upload a csv or xls file')
      } else {
        this.setState({
          fileType: (this.refs.uploadFile.value).substr(-3),
        })
        this.refs.form1.submit()
      }
    }
  },
  checkFileType: function () {
    if (!(((this.refs.uploadFile.value).substr(-3) === 'xls') ||
          ((this.refs.uploadFile.value).substr(-3) === 'csv'))) {
      this.setState({
          submit: true
        })
        alert('Please upload a xls or csv file.')
    } else {
      this.setState({
        fileType: (this.refs.uploadFile.value).substr(-3),
        submit: false
      })
    }
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
      <div>
           <form ref='form1' name='form1' method='post' encType='multipart/form-data' action='/upload'>
               <div className='row'>
                <div className='small-3 columns'>
                  <label htmlFor='bank' className='text-right middle'><strong>Bank</strong></label>
                </div>
                <div className='small-9 columns'>
               <select name='bank' ref = 'bank' defaultValue = {this.state.bank} onChange={e => this.setState({bank: e.target.value})}>
                 <option value='select' disabled>Choose bank</option>
                 <option value='icici'>ICICI Bank</option>
                 <option value='federal'>Federal Bank</option>
                 <option value='axis'>Axis Bank</option>
               </select>
               <input type = 'text' name='filetype' value = {this.state.fileType} style = {{display: 'none'}}/>
             </div>
           </div>
             <div className='row'>
              <div className='small-12 columns' style={{paddingLeft: '30%'}}>
                 <input type='file' name= 'upl' id='file' className='inputfile' ref="uploadFile" onChange = {this.checkFileType}/>
               </div>
             </div>
                </form>
             <div className='row'>
              <div className='small-12 columns' style={{paddingLeft: '50%'}}>
                <button className='button btn' onClick={this.change}>Submit</button>
             </div>
           </div>
         </div>
    )
  }
})

module.exports = Upload
