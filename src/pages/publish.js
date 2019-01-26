import React from 'react'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import PublishData from '../components/publishData'

class PublishCom extends React.Component{
  render(){
    const completed = this.props.completed
    return (
      <div>
        {completed ? ''
          : <Redirect to="/index/personalCenter" />
        }
        发布页
        <PublishData/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    completed: state.user.userInformation.informationCompleted
  }
}
const Publish = connect(mapStateToProps)(PublishCom)

export default Publish
