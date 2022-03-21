import React, { Component } from 'react'
import SelectCourse from './SelectCourse'
import { Container, Row, Col } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'

class SelectCourses extends Component {
    render() {
        const {show, mandatoryCourses, electiveCourses, onMandatoryCourseChecked, onElectiveCourseChecked} = this.props

        var mCourses = mandatoryCourses?.map((course) => (
            <SelectCourse key={course.id} course={course} onChecked={onMandatoryCourseChecked} />))
        var eCourses = electiveCourses?.map((course) => (
            <SelectCourse key={course.id} course={course} onChecked={onElectiveCourseChecked} />))


        return (
            <div >
                {show?
                    <Container >
                        <Row md={2}>
                            <Col>
                                <h1><Badge bg="primary">קורסי בחירה</Badge> </h1> {eCourses}
                            </Col>
                            <Col>
                                <h1><Badge bg="primary">קורסי חובה</Badge> </h1> {mCourses}
                            </Col>
                        </Row>
                    </Container>
                : null}
            </div>
        )
    }
}

export default SelectCourses