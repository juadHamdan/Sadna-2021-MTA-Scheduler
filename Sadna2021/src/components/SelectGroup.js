import React, { Component } from 'react'
import SchedulerCourse from './SchedulerCourse'
import Group from './Group'
import { Container, Row, Col } from 'react-bootstrap'
import CloseButton from 'react-bootstrap/CloseButton'

class SelectGroup extends Component {
    render() {
        const groupBy = (items, key) => items.reduce(
          (result, item) => ({
            ...result,
            [item[key]]: [
              ...(result[item[key]] || []),
              item,
            ],
          }),
          {},
        );

        var courses = this.props.courses != null ? this.props.courses?.map((course, index) => (
            <SchedulerCourse key={index} course={course} onChecked={this.props.onCourseClicked} />)) : null

        let groups = null;
        if (this.props.groups != null ){
           groups = [];
            for (const [group_id, group] of Object.entries(this.props.groups)) {
                    groups.push(
                    <Group 
                        key={group_id} 
                        group={group} 
                        //checked={group.checked}
                        //{this.props.schedulerData.some(groupTime => groupTime.groupId == Number(group_id))} 
                        onChecked={this.props.onGroupClicked} 
                    />)
                }
        }

        let exercise = null;
        let relevantExercise = null;
        const relevantExerciseData = {}
        if(this.props.exerciseData != null && this.props.exercise == null){
            for (let exerciseTime in this.props.exerciseData) {
                if (this.props.exerciseData[exerciseTime][0].course_number == this.props.currentCourse){
                    relevantExerciseData[exerciseTime]= this.props.exerciseData[exerciseTime]
                }
            }
            if (Object.keys(relevantExerciseData).length > 0 ){
                relevantExercise = relevantExerciseData
            }
        }
        let exerciseInfo = null
        if(this.props.exercise != null){
            exerciseInfo = this.props.exercise
        }
        else if(relevantExercise != null){
            exerciseInfo = relevantExercise
        }

        if (exerciseInfo != null){
           exercise = [];
            for (const [group_id, group] of Object.entries(exerciseInfo)) {
                    exercise.push(
                    <Group 
                        key={group_id} 
                        group={group} 
                        onChecked={this.props.onExerciseClicked}
                    />)
                }
        }



        let summary= [];
        if (this.props.schedulerData != null && this.props.schedulerData.length > 0){
           const grouped = groupBy(this.props.schedulerData, 'id')
           for (const [id, groupData] of Object.entries(grouped)) {
                const group = groupData.find(data=> data.id == Number(id) && data.exercise == false) ?? groupData[0]
                const exercise = groupData.find(data=> data.id == Number(id) && data.exercise == true)
                const exerciseStr = exercise != null ? 'וקבוצת תרגול ' + exercise.groupId  : ''
                summary.push(
                <div style={{fontFamily: 'Calibri light'}}>
                    <h4 key={id}> 
                    <hr/>
                        {group.title}{' '}({id}) מספר קבוצה {group.groupId} {exerciseStr}
                    </h4>
                </div>)
            }
        }


        return (
            <div>
                <Container>
                    <Row md={3}>
                        <Col>
                            {courses?
                            <>
                                <h4 style={{textDecoration: 'underline'}}>קורסים</h4> {courses}
                            </>
                            : null }
                        </Col>

                        <Col>
                            {groups?
                            <>
                                <h4 style={{textDecoration: 'underline'}}>קבוצות אפשריות</h4> {groups}
                            </>
                            : null }
                        </Col>

                        <Col>
                            {exercise?
                            <>
                                <h4 style={{textDecoration: 'underline'}}>תרגולים מתאימים</h4> {exercise}
                            </>
                            : null }
                        </Col>
                    </Row>
                </Container>


                            {summary.length>0?
                            <>
                                <h4 style={{textDecoration: 'underline', textAlign: 'center', fontFamily: 'Calibri'}}>סיכום</h4> {summary}
                            </>
                            : null }
            </div>
        )
    }
}

export default SelectGroup