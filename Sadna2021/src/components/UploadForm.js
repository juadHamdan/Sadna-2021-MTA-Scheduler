import React, { useState } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'

const UploadForm = ({show, onSubmit}) => {
  //for input
  const degreeYear = [
    { value: 1, label: 'שנה ראשונה'},
    { value: 2, label: 'שנה שנייה'},
    { value: 3, label: 'שנה שלישית'}
  ]

  const degreeSemester = [
      { value: 1, label:'סמסטר א\''},
      { value: 2, label: 'סמסטר ב\''},
  ]
  const [year, setYear] = useState([degreeYear[0].value]);
  const [semester, setSemester] = useState([degreeSemester[0].value]);

  //for file
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('בחר/י ידיעון לימודים');
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false)

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    setShowSpinner(true)

    var fileUploadSuccess = true
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
        }
      });
      setTimeout(() => setUploadPercentage(0),3000);
      setTimeout(() => setMessage(''), 3000);

      setMessage('קורסים נטענו בהצלחה')
      setMessageVariant('success')
    } 
    catch (err) 
    {
      fileUploadSuccess = false
      if (err.response.status === 500)
      {
        setMessage('יש בעיה בשרת')
        setMessageVariant('danger')
      }
      else if (err.response.status === 400)
      {
        setMessage('יש להעלות קובץ PDF')
        setMessageVariant('warning')
      }
      else 
      {
        setMessage('שגיאה');
        setMessageVariant('info')
      }
      setUploadPercentage(0)
    }
    finally{
      setShowSpinner(false)
      if(fileUploadSuccess){
        onSubmit(year, semester) //fetch courses from database
      }
    }
  };

  return (
    <>
      {show?
        <div className='mx-auto' style={uploadStyle}>
          {message ? <Alert variant={messageVariant} >{message}</Alert> : null}
          {uploadPercentage === 100 ? <Alert variant='info' >הקובץ הועלה, קורסים נטענים...</Alert> : null}

          <form onSubmit={onSubmit} style={{textAlign:'center'}} >
            <div className='custom-file mb-'>
              <input
                type='file'
                className='custom-file-input'
                size="lg"
                id='customFile'
                onChange={onChange}
              />
              <label className='custom-file-label' htmlFor='customFile'>
                {filename} <i className='bi bi-file-earmark-pdf-fill'></i>
              </label>
            </div> <hr/>

            <Select 
              onChange={(e) => {
                  setYear(e.value)
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
                  setSemester(e.value)
              }}
            /> <hr/>

            <ProgressBar animated variant="success" now={uploadPercentage} label={`${uploadPercentage}%`}/><br/>
            <div className="d-grid gap-5">
              <Button type='submit' onClick={handleSubmit} >
                {showSpinner? <Spinner as="span" animation="border" variant="dark"/> : 'העלאה'}
              </Button>
            </div>
            
          </form>
        </div>
      : null}
    </>
  );
};


const uploadStyle = {
  color: 'black',
  width: '1000px',
  padding: "80px",
  fontFamily: 'Calibri light',
  fontSize:'22px'
};

export default UploadForm;