import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import SelectUser from './SelectUser'

class SelectUsers extends Component {
    render() {
        const {show, onHide, user, users, onChecked} = this.props

        var myUsers = users?.map((myUser) => (
            <SelectUser key={myUser._data.localId} user={myUser._data} onChecked={onChecked} />
        ))

        return (
            <div>
                <Modal show={show} 
                    onHide={onHide}
                    style={modalStyle}
                    >
                        <Modal.Header>
                            <Modal.Title> בחירת משתמש לשיתוף </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{paddingRight:'50px'}} >
                            {myUsers}
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
}


const modalStyle = {
    direction: 'rtl',
    textAlign: 'right',
    padding: "80px",
    fontFamily: 'Calibri light',
    fontSize:'18px'
  };

export default SelectUsers