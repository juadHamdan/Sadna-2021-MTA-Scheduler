import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'

export class SchedulerCourse extends Component {
    constructor(props) {
        super(props)
        this.state = {renderDone: true}
    }

    render() {
        const {id, title, checked, courseType} = this.props.course;

        return (
            <div className='mb-1'>
                    <Button 
                        style={checked?
                            courseType==='Elective'?
                                electiveButtonStyle
                            :courseType==='Mandatory'?
                                mandatoryButtonStyle
                                :sadnaButtonStyle
                        :style}
                        variant={checked? 'dark' : 'outline-secondary'} 
                        onClick={(e) => {
                        this.props.onChecked(e, id)
                        this.setState({renderDone: true})
                        }}>
                    {checked?<i className={"bi bi-check2-circle"}>{' '}</i> : null} {title}
                    </Button>
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

const sadnaButtonStyle = {
    background: '#4caf50',
    color: 'white'
};


export default SchedulerCourse