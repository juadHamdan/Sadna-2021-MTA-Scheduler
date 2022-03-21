import MandatoryCoursesTable from './MandatoryCoursesTable'
import ElectiveCoursesTable from './ElectiveCoursesTable'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const DisplayCourses = ({show, handleClose, courses, coursesType, modalTitle}) => {
    return (
      <>
        <Modal show={show} 
          style={myModalStyle}
          size='xl'
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title> {modalTitle} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {courses?
          <>
            {coursesType === 'mandatoryCourses'? <MandatoryCoursesTable courses={courses}/>:''}
            {coursesType === 'electiveCourses'? <ElectiveCoursesTable courses={courses}/>:''}
          </>
           : 'אין קורסים'}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              סגור
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

const myModalStyle = {
  textAlign: 'right',
  direction: 'rtl',
  fontFamily: 'Calibri light',
  fontSize:'14px'
};

export default DisplayCourses