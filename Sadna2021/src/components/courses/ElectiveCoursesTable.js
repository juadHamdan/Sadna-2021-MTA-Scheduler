import Table from 'react-bootstrap/Table'

const ElecCoursesTable = ({courses}) => {

    const renderCourses = (course, index) => {
        return(
          <tr key={index}>
            <th>{course.title}</th>
            <th>{course.semesters}</th>
            <th>{course.credits}</th>
            <th>{course.prerequisites}</th>
          </tr>
        )
      }

    return (
        <div>
            <Table className="table" striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>שם הקורס</th>
                    <th>סמסטר</th>
                    <th>נקודות זכות</th>
                    <th>דרישות קדם</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(renderCourses)}
                </tbody>
            </Table>
        </div>
    )
}

export default ElecCoursesTable