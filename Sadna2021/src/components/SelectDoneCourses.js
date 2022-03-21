import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import SelectCourses from './SelectCourses'

class SelectDoneCourses extends Component {
    render() {
        const {show, mandatoryCourses, electiveCourses, onMandatoryCourseChecked, onElectiveCourseChecked, onSubmit} = this.props
        
        return (
          <div style={{height:'100%'}}>
            <div style={{height:"calc(100% - 50px)", overflowY:"scroll"}}>
              {show && mandatoryCourses && electiveCourses?
                <div style={selectCoursesStyle}>
                  <h3 style={{textAlign: 'center', fontFamily: 'Calibri'}}>בחר/י קורסים שהושלמו</h3>
                  <SelectCourses 
                    show={show}
                    mandatoryCourses={mandatoryCourses} 
                    electiveCourses={electiveCourses} 
                    onMandatoryCourseChecked={onMandatoryCourseChecked} 
                    onElectiveCourseChecked={onElectiveCourseChecked} 
                  /><hr/>
                  <div style={{textAlign: 'center'}}>
                    <Button variant="info"
                    size="lg"
                      onClick={onSubmit}>
                        עדכון קורסים
                    </Button>
                  </div> <hr/>
                </div>
              : null}
            </div>
          </div>
        )
    }
}

const selectCoursesStyle = {
    padding: "50px",
    fontFamily: 'Calibri light',
    fontSize:'18px'
  };

export default SelectDoneCourses