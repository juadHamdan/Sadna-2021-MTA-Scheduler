import React from 'react'
import Button from 'react-bootstrap/Button';

function SelectUser({user, onChecked}) {
    return (
        <div className='mb-1' style={{size: '22px'}}>
            <Button
                variant='outline-secondary' 
                size='lg'
                onClick={(e) => {onChecked(e, user.localId)}}>
                {user.photoUrl?
                <>
                <img src={user.photoUrl} style={{width:"3.5rem",height:"3.5rem", borderRadius: '50%'}}/>
                {" "}
                </>
                : null}
                {user.displayName}
            </Button>{' '}
        </div>
    )
}

export default SelectUser
