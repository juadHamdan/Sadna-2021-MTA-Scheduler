import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'

const PostInputModal = ({show, onHide, setYear, setSemester}) => {
    const degreeYear = [
        { value: 1, label: 'שנה ראשונה'},
        { value: 2, label: 'שנה שנייה'},
        { value: 3, label: 'שנה שלישית'}
      ]
    
      const degreeSemester = [
          { value: 1, label:'סמסטר א\''},
          { value: 2, label: 'סמסטר ב\''},
      ]

    const onClose = () => {
        onHide()
        setYear(degreeYear[0].label)
        setSemester(degreeSemester[0].label)
    }

    return (
        <div>
            <Modal show={show} 
                onHide={onClose}
                style={modalStyle}
                >
                    <Modal.Header>
                        <Modal.Title> הכנס/י שנה וסמסטר נוכחיים </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign:'center'}} >
                        <hr/>
                        <Select 
                            onChange={(e) => {
                                setYear(e.label)
                            }}
                            placeHolder="שנת לימודים"
                            options={degreeYear}
                            defaultValue={ degreeYear[0] }
                        /> <br/>
                        <Select 
                            placeHolder="סמסטר"
                            options={degreeSemester}
                            defaultValue={ degreeSemester[0] }
                            onChange={(e) => {
                                setSemester(e.label)
                            }}
                        /> <hr/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={onClose}>
                        אישור
                        </Button>
                    </Modal.Footer>
            </Modal>
        </div>
    )
}

const modalStyle = {
    direction: 'rtl',
    textAlign: 'right',
    padding: "80px",
    fontFamily: 'Calibri light',
    fontSize:'18px'
  };

export default PostInputModal
