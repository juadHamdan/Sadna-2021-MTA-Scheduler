import SchedulerTable from './Scheduler'
import { Container, Row, Col } from 'react-bootstrap'
import Cards from './Cards'

const Home = ({show, publishedSchedulersData}) => { 
    return (
        <>
            {show?
                <div style={{height:'100%'}}>
                    <div style={{height:"calc(100% - 64px)", overflowY:"scroll"}} >
                        <Cards/>
                        <hr/>
                        <h2 style={{fontFamily: 'Calibri light', paddingRight: '15px'}}>
                            מערכות שעות שפורסמו ע''י סטודנטים: 
                        </h2>
                        <hr/>

                        
                        {publishedSchedulersData?.map((schedulerData, idx) => (
                            <Container key={idx} fluid style={{paddingLeft: '250px', paddingRight: '250px'}}>
                                <div style={{padding: '8px', fontSize: '21px'}}>
                                    <img src={schedulerData['photoURL']} style={{width:"3.5rem",height:"3.5rem", borderRadius: '50%'}}/>
                                    {" "} הועלה ע"י {schedulerData['displayName']}  ({schedulerData['year']},  {schedulerData['semester']})
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

export default Home