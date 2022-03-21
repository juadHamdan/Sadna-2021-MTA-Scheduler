import Table from 'react-bootstrap/Table'

const ManCoursesTable = ({courses}) => {
    const renderCourses = (course, index) => {
        return(
          <tr key={index}>
            <th>{course.title}</th>
            <th>{course.year}</th>
            <th>{course.semesters? course.semesters.map((item, index) => <p key={index}> {item}</p>) : 'tt'}</th>
            <th>{course.credits}</th>
            <th>{course.lecSemHours}</th>
            <th>{course.exSemHours}</th>
            <th>{course.prerequisites}</th>
            <th>{course.parallelReqs}</th>
          </tr>
        )
      }

    return (
        <div>
            <Table className="table" striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>שם הקורס</th>
                    <th>שנה</th>
                    <th>סמסטר</th>
                    <th>נקודות זכות</th>
                    <th>ש"ס שיעור</th>
                    <th>ש"ס תרגיל</th>
                    <th>דרישות קדם</th>
                    <th>דרישות מקבילות</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(renderCourses)}
                </tbody>
            </Table>
        </div>
    )
}

export default ManCoursesTable
