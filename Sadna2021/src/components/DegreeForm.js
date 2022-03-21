import React, { useState } from 'react'
import Select from 'react-select'
import Button from 'react-bootstrap/Button'

const DegreeForm = ({onSubmit}) => {

    const academicInstitute = [{ value: 1, label:'המכללה האקדמית תל אביב יפו'}]

    const degreeCurriculum = [
        { value: 'MTA-CS', label: 'מדעי המחשב .B.A., B.Sc'},
        { value: 'MTA-NURSING', label: 'מדעי הסיעוד .B.S.N', disabled: 'yes'},
        { value: 'MTA-DS', label: 'מערכות מידע .B.Sc', disabled: 'yes'},
        { value: 'MTA-PSYCHOLOGY', label: 'פסיכולוגיה .B.A', disabled: 'yes'},
        { value: 'MTA-EC', label: 'כלכלה וניהול .B.A', disabled: 'yes'}
    ]

    const degreeYear = [
        { value: 1, label: 'שנה ראשונה'},
        { value: 2, label: 'שנה שנייה'},
        { value: 3, label: 'שנה שלישית'}
    ]

    const degreeSemester = [
        { value: 1, label:'סמסטר א\''},
        { value: 2, label: 'סמסטר ב\''},
    ]

    const [curriculum, setCurriculum] = useState([degreeCurriculum[0].value]);
    const [year, setYear] = useState([degreeYear[0].value]);
    const [semester, setSemester] = useState([degreeSemester[0].value]);

    return (
        <div>
            <h5>מוסד לימודים</h5>
            <Select 
                options={academicInstitute}
                defaultValue={ academicInstitute[0] }/> <br/>

            <h5>תכנית לימודים</h5>
            <Select 
                options={degreeCurriculum}
                isOptionDisabled={(option) => option.disabled === 'yes'}
                defaultValue={ degreeCurriculum[0] }/> <br/>

            <h5>שנת לימודים</h5>
            <Select 
                onChange={(e) => {
                    setYear(e.value)
                }}
                options={degreeYear}
                defaultValue={ degreeYear[0] }/> <br/>

            <h5>סמסטר</h5>
            <Select 
                options={degreeSemester}
                defaultValue={ degreeSemester[0] }
                onChange={(e) => {
                    setSemester(e.value)
                }
            }/> <br/>

            <Button variant="primary" onClick={() => onSubmit(curriculum, year, semester)} >המשך/י</Button>
        </div>
    );
}

export default DegreeForm