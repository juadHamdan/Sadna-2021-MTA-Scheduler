import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'

export class SelectCourse extends Component {
    constructor(props) {
        super(props)
        this.state = {renderDone: true}
    }

    render() {
        const {id, title, done, courseType} = this.props.course;
        
        return (
            <div className='mb-1'>
                <Button 
                style={done?
                    courseType==='Mandatory'?
                        mandatoryButtonStyle
                        :electiveButtonStyle
                    :style}
                variant={done? 'dark' : 'outline-secondary'} 
                size='lg'
                onClick={(e) => {
                    this.props.onChecked(e, id)
                    this.setState({renderDone: true})
                }
                }>
                {done?<i className={"bi bi-check2-circle"}>{' '}</i> : null} {title}
                   
                </Button>{' '}
            </div>
        )
    }
}

const style = {
    color: 'white'
}

const mandatoryButtonStyle = {
    background: '#2196f3',
    color: 'white'
  };

const electiveButtonStyle = {
    background: '#ff9800',
    color: 'white'
};

export default SelectCourse
