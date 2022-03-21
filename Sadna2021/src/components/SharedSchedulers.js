import SchedulerTable from './Scheduler'
import { Container, Row, Col } from 'react-bootstrap'

const SharedSchedulers = ({show, sharedSchedulersData}) => { 
    return (
        <>
            {show?
                <div >
                    <div >
                        <hr/>
                        <h2 style={{paddingRight: '15px', fontFamily: 'Calibri light'}}>
                            מערכות שעות ששותפו איתך:
                        </h2>
                        <hr/>
                        {sharedSchedulersData?.map((schedulerData, idx) => (
                            <Container key={idx} fluid style={{paddingLeft: '250px', paddingRight: '250px'}}>
                                <div style={{padding: '8px', fontSize: '21px'}}>
                                    <img src={schedulerData['photoURL']} style={{width:"3.5rem",height:"3.5rem", borderRadius: '50%'}}/>
                                    {" "} שותף ע"י {schedulerData['displayName']}  ({schedulerData['year']},  {schedulerData['semester']})
                                </div>

                                <SchedulerTable data={schedulerData['schedulerData']} height='800'/>
                                <br/>
                                <hr/>
                            </Container>
                         ))}
                        
                    </div>
                </div>
            : null}
        </>
    )
}

export default SharedSchedulers