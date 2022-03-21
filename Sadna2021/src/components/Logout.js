import firebase from './firebase-config'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
  
const Logout = ({show, onHide, onLogoutSuccess}) => {
    const [success, setSuccess] = useState(false)

    const handleSuccess = () => {
        onLogoutSuccess(true)
        setSuccess(true)
    }
    const handleFailure = () => {
        onLogoutSuccess(false)
        setSuccess(false)
    }

    const handleLogout = () => {
        firebase.auth().signOut()
            .then(function() {
                handleSuccess()
            })
            .catch(function(error) {
                handleFailure()
            });
        }

    return (
        <div>
            <Modal show={show} 
                onHide={onHide}
                style={modalStyle}
                onEnter={handleLogout}
                >
                <Modal.Header>
                    <Modal.Title> התנתקות </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign:'center'}} >
                    {success? 
                        <>התנתקת בהצלחה</>
                    : <>אנא המתן <i class="bi bi-exclamation-circle"></i></> }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                    סגור
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Logout

const modalStyle = {
    direction: 'rtl',
    textAlign: 'right',
    padding: "80px",
    fontFamily: 'Calibri light',
    fontSize:'18px'
  };
