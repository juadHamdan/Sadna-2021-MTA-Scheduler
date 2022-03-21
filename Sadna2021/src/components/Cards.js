import React from 'react'
import Card from 'react-bootstrap/Card'
import { Container, Row, Col } from 'react-bootstrap'

function Cards() {
    return (
        <div className="text-center" style={{padding: '50px'}}>

            <Row>
                <Col>
                    <Card border="success" style={cardStyle}>
                        <Card.Header as="h5">שלב ראשון</Card.Header>
                        <Card.Img variant="top" src="img/cards/upload.png" />
                        <Card.Body>
                        <Card.Title>ידיעון לימודים</Card.Title>
                        <Card.Text>
                            העלאת קובץ pdf של ידיעון הלימודים
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={1}>
                    <br/><br/><br/><br/><br/><br/>
                    <h1 className='bi bi-chevron-double-left'></h1>
                </Col>

                <Col>
                    <Card border="warning" style={cardStyle}>
                        <Card.Header as="h5">שלב שני</Card.Header>
                        <Card.Img variant="top" src="img/cards/selectCourses.png" />
                        <Card.Body>
                        <Card.Title>קורסים</Card.Title>
                        <Card.Text>
                            בחירת קורסים שהושלמו (ציון עובר)
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={1}>
                    <br/><br/><br/><br/><br/><br/>
                    <h1 className='bi bi-chevron-double-left'></h1>
                </Col>

                <Col>
                    <Card border="danger" style={cardStyle}>
                        <Card.Header as="h5">שלב שלישי</Card.Header>
                        <Card.Img variant="top" src="img/cards/scheduler.png" />
                        <Card.Body>
                        <Card.Title>מערכת שעות</Card.Title>
                        <Card.Text>
                            בניית מערכת השעות תוך התחשבות בדרישות הקורסים 
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        
            
        </div>
    )
}

const cardStyle = {
    backgroundColor: '#333', 
    color: 'white'
}

export default Cards
