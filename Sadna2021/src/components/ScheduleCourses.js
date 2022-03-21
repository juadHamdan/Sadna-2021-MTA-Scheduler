import React, { useState, useEffect} from 'react'
import SelectGroup from './SelectGroup'
import PostInputModal from './PostInputModal'
import SchedulerTable from './Scheduler'
import SelectUsers from './SelectUsers'
import { Container, Row, Col, FormGroup, Button } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Alert from 'react-bootstrap/Alert'

const schedulerYear=2020;
const schedulerMonth=10;

function ScheduleCourses({show, user, users, userHaveSchedulerData, mandatoryCourses, electiveCourses}) {

  const [courses, setCourses] = useState();
  const [currentCourse, setCurrentCourse] = useState();
  //const [coursesData, setCoursesData] = useState();
  //const [groupsData, setGroupsData] = useState(null);
  const [groups, setGroups] = useState();
  const [section, setSection] = useState();
  const [semester, setSemester] = useState();
  const [schedulerData, setSchedulerData] = useState([]);
  //const [selectedGroups, setSelectedGroups] = useState([]);
  const [exercise, setExercise] = useState();
  const [allExercises, setAllExercises] = useState();
  //const [exerciseTimes, setExerciseTimes] = useState([]);

  const [message, setMessage] = useState('');

  const [showApprovalAlarm, setShowApprovalAlarm] = useState(false)
  const [approvalAlarmMessage, setApprovalAlarmMessage] = useState('')

  const [showUsers, setShowUsers] = useState(false)

  const [alarmVariant, setAlarmVariant] = useState('');
  const [showPostInput, setShowPostInput] = useState(false);
  const [currYear, setCurrYear] = useState(null);
  const [currSemester, setCurrSemester] = useState(null);

  
  const hedvaOne = 'חדו"א 1'
  const hedvaTwo = 'חדו"א 2'


  useEffect(async () => {
    if(userHaveSchedulerData)
      await fetchUserSchedulerData(user.uid)
  }, [userHaveSchedulerData]);

  const fetchUserSchedulerData = async (uid) => {
    var url = '/userSchedulerData/' + uid 
    const res = await fetch(url)
    const data = await res.json()
    setSchedulerData(data.schedulerData)
  }

  const coursePrerequisitesDone = (courses, e, id) => {
    let coursesPrerequisitesDone = true
    let newCourse = courses[id]
    //check if NewCourse's prerequisites are done courses 
    if(newCourse.prerequisites != null){
        newCourse.prerequisites.map(courseName => {
            courses.map(course => {
                if(newCourse.id !== course.id)
                {
                    //if course is in this state => course NOT done.
                    if(course.title === courseName){
                        handleAlarm('warning', 'הקורס "' + course.title + '" בדרישות הקדם של "' + newCourse.title + '" .ולכן צריך להוסיף אותו למע\' השעות ')
                        coursesPrerequisitesDone = false
                        return //exit from mapping
                    }
                }
    })

        if(coursesPrerequisitesDone == false){
            e.preventDefault() //cancel the check in checkbox
            return //exit from mapping
        }
      })
    }

    return coursesPrerequisitesDone
  }

  const checkCourseParallelReqs = (courses, e, id) => {
    let newCourse = courses[id]
    //check NewCourse's parrallel requests 
    if(newCourse.parrallelReqs != null){
      newCourse.parrallelReqs.map(courseName => {
        courses.map(course => {
          //if course is in this state => course NOT done.
          if(course.title === courseName){
            alert('לקורס ": "' + newCourse.title + '"יש דרישת לימוד במקביל עם הקורס: ' + course.title + '" נוסיף אותו למע\' השעות.')
            this.onChecked(e, course.id)
            return //exit from mapping
          }
        })
      })
    }
  }

  const checkPrerequisites = (courseFromNewsletter, coursesFromNewsletter) => {
    let prerequisites = courseFromNewsletter['prerequisites']
    if (prerequisites == undefined || prerequisites == '') return

    prerequisites = prerequisites.split(' ').join('')

    const coursesNames = mandatoryCourses.map(course => course.title) //courses title 
    const doneCoursesNames = mandatoryCourses.filter(course => course['done'] == true).map(course => course['title']) //courses title done


    coursesNames.forEach(courseName => {
      if (prerequisites.includes(courseName.split(' ').join('')) &&  !doneCoursesNames.includes(courseName)){
        handleAlarm('warning', `הקורס ${courseName} הוא תנאי קדם לקורס ${courseFromNewsletter['title']}, עליך לקבל בו ציון עובר`)
      }
    })
  }

  const checkParallelReqs = (courseFromNewsletter, coursesFromNewsletter) => {
    let parallelReqs = courseFromNewsletter['parallelReqs']
    if (parallelReqs == undefined || parallelReqs == '') return

    parallelReqs = parallelReqs.split(' ').join('')

    //const dependenciesStrTemp = prerequisetes.replace(' ', '')


    const coursesNames = coursesFromNewsletter.map(course => course.title) //courses title 
    const doneCoursesNames = coursesFromNewsletter.filter(course => course['done'] == true).map(course => course['title']) //courses title done
    const checkedSchedulerCourses = schedulerData.map(course => course.title)
    const schedulerCoursesNaming = checkedSchedulerCourses.map(courseName => courseName == "חשבון דיפרנציאלי ואינטגרלי 2" ? hedvaTwo  : courseName)
    const schedulerCoursesNamingSec = schedulerCoursesNaming.map(courseName => courseName == "חשבון דיפרנציאלי ואינטגרלי 1" ? hedvaOne  : courseName);
    const schedulerCoursesName = schedulerCoursesNamingSec.map(courseName => courseName.replace('++ ', '++').replace('  ', ' '));

    //if course from newsletter is done, don't show it 

    //let parrallelCoursesNames = []

    coursesNames.forEach(courseName => {
      if (parallelReqs.includes(courseName.split(' ').join('')) &&  !doneCoursesNames.includes(courseName) && !schedulerCoursesName.includes(courseName.replace('++ ', '++').replace('  ', ' '))){
        //parrallelCoursesNames = parrallelCoursesNames.push(courseName)
        handleAlarm('warning', `הקורס ${courseName} הוא דרישה מקבילה לקורס ${courseFromNewsletter['title']}`)
      }
    })
  }

  //add schedulerData check
  // schedulerData.replace(" ", "")
  // schedulerData.name.includes(courseName)

  // add courseName to list and than alarm of all courses names.


  //group can be on 2 days or more
  const getStringOfGroupTime = (group) => {
    return (group.endDate.getHours() + ":" + group.endDate.getMinutes() + " - " + group.startDate.getHours() + ":" + group.startDate.getMinutes())
  }

  const isOverlappingGroups = (group1, group2) => {
    if((group1.startDate <= group2.endDate) && (group2.startDate <= group1.endDate)){
        return true;
    }
    return false
  }

  const groupOverlap = (group) => { 
    let groupOverlap = false
    //check if newCourse time overlap with other checked courses
    group.map(groupDay => {
      schedulerData.map(schedulerGroupDay => {
        if(!(schedulerGroupDay instanceof Date))
        {
          schedulerGroupDay.startDate = new Date(schedulerGroupDay.startDate)
          schedulerGroupDay.endDate = new Date(schedulerGroupDay.endDate)
        }
        groupOverlap = isOverlappingGroups(groupDay, schedulerGroupDay)
        if(groupOverlap)
        {
          handleAlarm("warning", 'הקורס "' + groupDay.title + '" חופף עם הקורס "' + schedulerGroupDay.title + '" (שעת הקורס: ' + getStringOfGroupTime(groupDay) + ')')
          return groupOverlap//exit from mapping
        }
      })
      if(groupOverlap)
        return groupOverlap
    })
    return groupOverlap
  }

  const validateDependancies = (crawlerCourse) => {
    if(!crawlerCourse.checked)
      return

    //check if elective or mandatory
    const courseType = crawlerCourse.courseType
    let courseFromNewsletter
    const hedvaOneCheck = 'חדו\"א 1'
    const hedvaTwoCheck = 'חדו\"א 2'
    let crawlerCourseTitle = crawlerCourse.title
    crawlerCourseTitle = crawlerCourseTitle == "חשבון דיפרנציאלי ואינטגרלי 2" ? hedvaTwoCheck  : crawlerCourseTitle
    crawlerCourseTitle = crawlerCourseTitle == "חשבון דיפרנציאלי ואינטגרלי 1" ? hedvaOneCheck  : crawlerCourseTitle

    if(courseType === 'Mandatory')
    {
      courseFromNewsletter = mandatoryCourses.find(course => course['title'].replace('++ ', '++').replace('  ', ' ') == crawlerCourseTitle)
      if(courseFromNewsletter == undefined){
        return
      }

      // add additional check
      checkPrerequisites(courseFromNewsletter, mandatoryCourses)
      checkParallelReqs(courseFromNewsletter, mandatoryCourses)
    }
    if(courseType === 'Elective')
    {
      courseFromNewsletter = electiveCourses.find(course => course['title'].replace('"', '').replace('++ ', '++').replace('  ', ' ')  == crawlerCourseTitle)
      if(courseFromNewsletter == undefined){
        return
      }
      // add additional check
      checkPrerequisites(courseFromNewsletter, electiveCourses)
    }
  }

    const getExercise = (groupId) => {
      axios.get('http://localhost:3000/relevantExercise', {
      params: {
        groupId: groupId,
      }
    }).then(res => {
        const exerciseDataRes = res.data;

        for(const [group_id, group_] of Object.entries(exerciseDataRes))
          group_.forEach(function(groupDay, index) {
            groupDay.checked = false
        });

        schedulerData.forEach(function(group_, index) {
          if(exerciseDataRes[group_.groupId])
          {
            exerciseDataRes[group_.groupId].forEach(function(groupDay, index) {
              groupDay.checked = true
           });

            console.log("found exercise check")

          }
       });

        console.log("exercises: ", exerciseDataRes)
        setExercise(exerciseDataRes);

        const newAllExercises = {...allExercises, ...exerciseDataRes}
        console.log("all exersices: ", newAllExercises)
        setAllExercises(newAllExercises);
      });
  }

  const courseClicked = (e, courseId) => {
  let unCheckedCurrentCourse = false;
    courses.forEach((course) => {
        if(course.id !== courseId) {
            course.checked = false;
        }
        else {
            course.checked = !course.checked
            if(course.checked == false) unCheckedCurrentCourse = true
        }
    })
    if(unCheckedCurrentCourse == true){
        setGroups(null);
        setExercise(null);
        setSchedulerData(schedulerData.filter(data => data.id !== courseId));
        setExercise(null);
        setAllExercises(null);
        return;
    }

    setCurrentCourse(courseId)
    setExercise(null);


    const course = courses.find(course => course.id == courseId)

    axios.get('/relevantGroups', {
      params: {
        courseId: courseId,
        semester: semester
      }
    }).then(res => {
        const groupsData = res.data;

        for(const [group_id, group_] of Object.entries(groupsData))
          group_.forEach(function(groupDay, index) {
            groupDay.checked = false
        });

        schedulerData.forEach(function(group_, index) {
          if(groupsData[group_.groupId])
          {

            groupsData[group_.groupId].forEach(function(groupDay, index) {
              groupDay.checked = true
           });

            console.log("found group check")

          }
       });
        
        console.log("Groups: ", groupsData)
        setGroups(groupsData);
        validateDependancies(course);
      });
  }

  const groupClicked =(e, groupId) => {
    let group = groups[groupId]

    for (const [group_id, group_] of Object.entries(groups))
      group_.forEach(function(groupDay, index) {
        if(Number(group_id) != groupId)
        {
          if(groupDay.checked)
          {
            setSchedulerData(schedulerData.filter(data => data.id !== groupDay.course_number))
          }
          groupDay.checked = false
        }
        else
          groupDay.checked = !groupDay.checked
     });

     group = groups[groupId]

     if(group[0].checked === false)
     {
       setSchedulerData(schedulerData.filter(data => data.id !== group[0].course_number))

       if(allExercises){
        for (const [group_id, group_] of Object.entries(allExercises))
          group_.forEach(function(groupDay, index) {
            if(groupDay.course_number == group[0].course_number)
              groupDay.checked = false
            });
       }
       
       return
      }


    const courseType = getCourseType()
    let fullGroupData = group.map((v, index) => ({
        title: v['name'],
        checked: true,
        id: v['course_number'],
        groupId: groupId,
        startDate: new Date(schedulerYear, schedulerMonth, v['day'], v['start_hour'], v['start_min']),
        endDate: new Date(schedulerYear, schedulerMonth, v['day'], v['end_hour'],  v['end_min']),
        exercise: false,
        courseType: courseType
    }))

    groupOverlap(fullGroupData)



    const existingCourse = schedulerData.some(groupTime =>  groupTime.id == group[0]['course_number'] )
    if (existingCourse == true) {
        const removeCourse = schedulerData.filter(groupTime =>  groupTime.id != group[0]['course_number'] && groupTime.exercise == false )
        fullGroupData = fullGroupData.concat(removeCourse)
    }
    else {
      fullGroupData = fullGroupData.concat(schedulerData)
    }

    getExercise(groupId)
    setSchedulerData(fullGroupData)
  }

  const exerciseClicked =(e, groupId) => {
    let group = allExercises[groupId]
    const courseNumber = group[0].course_number
    console.log("exercises clicked: ", group)

    for (const [group_id, group_] of Object.entries(allExercises))
      group_.forEach(function(groupDay, index) {
        if (groupDay.course_number == courseNumber){
            if(Number(group_id) != groupId)
              groupDay.checked = false
            else
              groupDay.checked = !groupDay.checked
        }
     });

     group = allExercises[groupId]

     if(group[0].checked === false)
     {
       setSchedulerData(schedulerData.filter(data => data.groupId != groupId))
       return
     }

    let details = group.map((v, index) => ({
        title: v['name'],
        checked: true,
        id: v['course_number'],
        groupId: groupId,
        startDate: new Date(schedulerYear, schedulerMonth, v['day'], v['start_hour'], v['start_min']),
        endDate: new Date(schedulerYear, schedulerMonth, v['day'], v['end_hour'],  v['end_min']),
        exercise: true
    }))
    groupOverlap(details)


    const existingCourse = schedulerData.some(exerciseTime =>  exerciseTime.id == group[0]['course_number'] && exerciseTime.exercise == true )
    if (existingCourse == true) {
        const removeCourse = schedulerData.filter(exerciseTime =>  exerciseTime.id != group[0]['course_number'] || exerciseTime.exercise != true )
        details = details.concat(removeCourse)
    }
    else {
      details = details.concat(schedulerData)
    }

    setSchedulerData(details)

    //add to scheduler data the new group/exercise

    //details = details.concat(exerciseTimes)
    //setExerciseTimes(details)


    //const schedulerDataNew = schedulerData.filter(exerciseTime =>  exerciseTime.id != group[0]['course_number'] || exerciseTime.exercise == false )
    //console.log("entering schudeler Data: ", details.concat(schedulerDataNew))
    //setSchedulerData(details.concat(schedulerDataNew))
  }


  const sectionChange = (event) => {
    setSection(event.value)
  }

  const semesterChange = (event) => {
    setSemester(event.value)
  }

  const getCourseType = () => {
    let courseType
    if(section >= 1 && section <= 3)
      courseType = "Mandatory"
    else if(section >= 4 && section <= 6)
      courseType = "Elective"
    else if(section === 7)
      courseType = "Sadna"

    return courseType
  }

   let cleanData = (e) => {
    e.preventDefault();
    setSchedulerData([]);
    setExercise(null);
    setAllExercises(null);
    setGroups(null)
    }

  let submit = (e) => {
    e.preventDefault();
    setExercise(null);
    setAllExercises(null);
    setGroups(null)

    const courseType = getCourseType()

    if (section == null || semester == null){
        handleAlarm('warning', 'חסרים פרטים.')
    }
    axios.get('http://localhost:3000/relevantCourses', {
      params: {
        section: section,
        semester: semester
      }
    }).then(res => {
        const coursesData = res.data;
        //setCoursesData(coursesData);
        let coursesNames = []
        coursesData.forEach(course => coursesNames.push(
          { id: course.course_number, 
            title: course.course_name, 
            checked: false, 
            courseType: courseType
          }))
        setCourses(coursesNames);
      });
  }
    const degreeYear = [
        { value: 1, label: 'חובה - שנה ראשונה'},
        { value: 2, label: 'חובה - שנה שנייה'},
        { value: 3, label: 'חובה - שנה שלישית'},
        { value: 4, label: 'בחירה - מדעי המחשב'},
        { value: 5, label: 'בחירה - מדעים'},
        { value: 6, label: 'בחירה מתמטיקה'},
        { value: 7, label: 'סדנאות'},
        { value: 8, label: 'אנגלית'},
        ]

    const degreeSemester = [
      { value: 1, label:'סמסטר א\''},
      { value: 2, label: 'סמסטר ב\''},
      { value: 3, label: 'קיץ'},
    ]

const isSchedulerActionValid = () => {
  var isValid = true
  if(!user)
  {
    handleAlarm('warning', 'התחבר/י על מנת להמשיך')
    isValid = false
  }
  if(schedulerData.length === 0)
  {
    handleAlarm('warning', 'לא שובצו קורסים למערכת השעות')
    isValid = false
  }
  return isValid
}

const postSchedulerData = async (url) => {
  const photoURL = user.photoURL
  const displayName = user.displayName
  axios({
    method: 'post',
    url: url,
    data: {
      schedulerData: {schedulerData},
      photoURL: {photoURL},
      displayName: {displayName},
      year: {currYear},
      semester: {currSemester}
    }
  });
}

const handleSchedulerPublish = () => {
  if(isSchedulerActionValid()) 
  {
    var url = '/publishSchedulerData'
    postSchedulerData(url)
    handleAlarm('success', 'מערכת שעות פורסמה בהצלחה, ניתן לראותה בדף הבית')
  }
}

const handleSchedulerSave = () => {
  if(isSchedulerActionValid()) {
    var url = '/saveUserScheduleData/' + user.uid 
    postSchedulerData(url)
    handleAlarm('success', 'מערכת שעות נשמרה בהצלחה')
  }
}

const onUserClick = (e, uid) => {
  console.log("Clicked: ", uid)
  var url = '/sharedSchedulersData/' + uid
  postSchedulerData(url)
  setShowUsers(false)
  handleAlarm('success', 'מערכת שעות שותפה בהצלחה')
}

const handleSchedulerShare = () => {
  if(isSchedulerActionValid()) {
    setShowUsers(true)
  }
}

const handleApprovalAlarm = (variant, text) => {
  setShowApprovalAlarm(true)
  setApprovalAlarmMessage(text)
  setAlarmVariant(variant)
}

const handleAlarm = (variant, text) => {
  setTimeout(() => setMessage(''), 10000);
  setMessage(text)
  setAlarmVariant(variant)
}

return (
  <div style={{height:'100%'}}>
    <div style={{height:"calc(100% - 64px)", overflowY:"scroll"}}>
      {show?
        <>
        <div style={{fontFamily: 'Calibri', fontSize: '24px'}}>
          {message ? <Alert variant={alarmVariant} >{message}</Alert> : null}

          <Alert 
          show={showApprovalAlarm} 
          variant={alarmVariant}
          onClose={() => setShowApprovalAlarm(false)} 
          dismissible>
            <Alert.Heading>{approvalAlarmMessage}</Alert.Heading>
            <hr/>
            <div className="d-flex justify-content-start">
              <Button 
                variant="outline-success"
                onClick={() => {
                  setShowApprovalAlarm(false)
                  handleSchedulerPublish()}} >
                אישור
              </Button>{' '}
              <Button 
                variant="outline-danger"
                onClick={() => setShowApprovalAlarm(false)}>
                סגירה
              </Button>
            </div>
          </Alert>
        </div>

        <SelectUsers
          show={showUsers}
          onHide={() => setShowUsers(false)}
          user={user}
          users={users}
          onChecked={onUserClick}
        />

        <PostInputModal
          show={showPostInput}
          onHide={() => setShowPostInput(false)}
          setYear={setCurrYear}
          setSemester={setCurrSemester}
        />

        <Container fluid>
            <Row md={2}>
                <Col>
                  <Container style={{padding: '20px'}}>
                    <Row>
                      <Col sm={2}>
                        <ButtonGroup vertical size="lg">
                          <Button
                            variant="info"
                            onClick={() => 
                            {
                              if(!currYear && !currSemester)
                                setShowPostInput(true)
                              handleApprovalAlarm('info', 'פרסום מערכת השעות יגרום לפרטים אישיים להפוך לציבוריים. האם להמשיך?')
                            }}>
                                פרסום
                          </Button>
                          <Button 
                            variant="info"
                            onClick={() => {
                              handleSchedulerShare()
                              if(!currYear && !currSemester)
                                setShowPostInput(true)
                            }}>
                                שיתוף
                          </Button>
                          <Button 
                            variant="info"
                            onClick={handleSchedulerSave}>
                                שמירה
                          </Button>
                        </ButtonGroup>
                      </Col>
                      <Col sm={10}>
                        <form onSubmit={submit} className='mx-auto' style={formStyle}>
                          <FormGroup role="form">

                            <Select class="form-control" id="section"
                              menuPlacement="auto"
                              placeholder="שנת לימודים"
                              options={degreeYear}
                              onChange={sectionChange}
                            />
                            <Select class="form-control" id="semester"
                              menuPlacement="auto"
                              placeholder="סמסטר"
                              options={degreeSemester}
                              onChange={semesterChange}
                            />
                            <div className="d-grid gap-2"></div>
                            <Button 
                              variant="info"
                              size="lg"
                              type="submit">
                                בחר/י
                            </Button>
                             <Button
                              style={{marginRight:"60px"}}
                              variant="info"
                              size="lg"
                              onClick={cleanData}
                              type="clean">
                                ניקוי מערכת שעות
                            </Button>
                          </FormGroup>

                        </form>
                      </Col>
                    </Row>
                  </Container>
                  <hr/>
                  <SelectGroup
                    courses={courses}
                    groups={groups}
                    exercise={exercise}
                    exerciseData={allExercises}
                    schedulerData={schedulerData}
                    onCourseClicked={courseClicked}
                    onGroupClicked={groupClicked}
                    onExerciseClicked={exerciseClicked}
                    currentCourse={currentCourse}
                  />
                </Col>
                <Col>
                  <SchedulerTable data={schedulerData} height='1150' />
                </Col>
            </Row>
        </Container>

    
      </>
      : null}
    </div>
  </div>
)
}

const formStyle = {
  color: 'black',
  width: '600px',
  textAlign: 'center',
  fontFamily: 'Calibri',
  fontSize:'20px'
};

export default ScheduleCourses