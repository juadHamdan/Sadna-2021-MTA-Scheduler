import firebase from './firebase-config'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
  
const Login = ({show, onHide, onLogin, onLoginSuccess}) => {
    const uiConfig = { 
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: (user) => {
                onLoginSuccess(true)
                onLogin(user)
                console.log(user)
            }
        }
    }

    return (
        <div>
            <Modal show={show} 
            onHide={onHide}
            style={modalStyle}
            >
                <Modal.Header>
                    <Modal.Title> התחברות </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign:'center'}} >
                    <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={firebase.auth()}
                    />
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

export default Login

const modalStyle = {
    direction: 'rtl',
    textAlign: 'right',
    padding: "80px",
    fontFamily: 'Calibri light',
    fontSize:'18px'
  };