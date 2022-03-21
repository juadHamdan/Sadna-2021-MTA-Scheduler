import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'
import ScheduleCourses from './components/ScheduleCourses'
import UploadForm from './components/UploadForm'
import SelectDoneCourses from './components/SelectDoneCourses'
import axios from 'axios';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Home from './components/Home'
import SharedSchedulers from'./components/SharedSchedulers'

const adminMail = 'sadna2021mta@gmail.com'
//default values to degree year and semester
let year = 1
let semester = 1

function App(){
  const [mandatoryCourses, setMandatoryCourses] = useState(null)
  const [electiveCourses, setElectiveCourses] = useState(null)
  const [userHaveSchedulerData, setUserHaveSchedulerData] = useState(false)
  const [publishedSchedulersData, setPublishedSchedulersData] = useState([])
  const [sharedSchedulersData, setSharedSchedulersData] = useState([])

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [showKey, setShowKey] = useState('home')

  useEffect(async () => {
    const schedulersDataRes = await fetch('/schedulersData')
    const schedulersData = await schedulersDataRes.json()
    console.log("Home Page schedulers: ", Object.values(schedulersData))
    setPublishedSchedulersData(Object.values(schedulersData))

    const usersRes = await fetch('/getUsersInfo')
    const usersData = await usersRes.json()
    console.log(Object.values(usersData))
    setUsers(Object.values(usersData))
  }, []);

  const checkUserCoursesExists = async (uid) => {
    var url = '/checkUserCourses/' + uid
    const res = await fetch(url)
    if(res.status === 200) //user database courses exists
    {
      console.log('User have courses.')
      return true
    }
    if(res.status === 400)
    {
      return false
    }
  }

  const checkUserSchedulerDataExists = async (uid) => {
    var url = '/checkUserScheduleData/' + uid
    const res = await fetch(url)
    if(res.status === 200) //user database exists
    {
      console.log('User have scheduler data.')
      return true
    }
    else
    {
      return false
    }
  }

  const checkSharedSchedulersDataExists = async (uid) => {
    var url = '/checkSharedScheduleData/' + uid
    const res = await fetch(url)
    if(res.status === 200) //user database exists
    {
      console.log('Shared scheduler data to user.')
      return true
    }
    else
    {
      return false
    }
  }

  //fetch from user database courses
  const fetchUserMandadtoryCourses = async (uid) => {
    var url = '/mandatoryCourses/' + uid 
    const res = await fetch(url)
    const data = await res.json()
    console.log("user mandatory courses: ", data.mandatoryCourses)
    setMandatoryCourses(data.mandatoryCourses)
  }
  const fetchUserElectiveCourses = async (uid) => {
    var url = '/electiveCourses/' + uid 
    const res = await fetch(url)
    const data = await res.json()
    console.log("user elective courses: ", data.electiveCourses)
    setElectiveCourses(data.electiveCourses)
  }
  const fetchSharedSchedulers = async (uid) => {
    var url = '/sharedSchedulersData/' + uid 
    const schedulersDataRes = await fetch(url)
    const schedulersData = await schedulersDataRes.json()
    console.log("shared schedulers2: ", Object.values(schedulersData))
    setSharedSchedulersData(Object.values(schedulersData))
  }

  //fetch from newsletter database courses
  const fetchMCourses = async () => {
    const url = '/mandatoryCourses'
    const res = await fetch(url)
    const data = await res.json()
    // init: adding needed fields to each object
    const result = data.mandatoryCourses.map((v, index) => ({...v,
        done: false,
        id: index,
		    courseType: 'Mandatory'
    }));
    console.log("Mandatory Courses: ", result)
    setMandatoryCourses(result)
    return result
  }

  const fetchECourses = async () => {
    var url = '/electiveCourses'
    const res = await fetch(url)
    const data = await res.json()
    //adding needed fields to each object
    const result = data.electiveCourses.map((v, index) => ({...v,
        done: false,
        id: index,
		    courseType: 'Elective'
    }));
    console.log("Elective Courses: ", result)
    setElectiveCourses(result)
  }

  const defaultCheckDoneCourses = (courses) => {
    courses?.map(course => {
      if(course.year < year || (course.year == year && (course.semesters[0] < semester || course.semesters.length === 2))) {
        courses[course.id].done = true
        console.log(course.title + " done.")
      }
    })
  }

  const checkMandatoryCourse = (e, id) => {
    mandatoryCourses[id].done = !mandatoryCourses[id].done
    console.log(mandatoryCourses[id].title + ": " + mandatoryCourses[id].done)
  }
  const checkElectiveCourse = (e, id) => {
    electiveCourses[id].done = !electiveCourses[id].done
    console.log(electiveCourses[id].title + ": " + electiveCourses[id].done)
  }

  const updateUserDatabase = async () => {
    const url = '/updateUserDatabase/' + user.uid
    axios({
      method: 'post',
      url: url,
      data: {
        mandatoryCourses: {mandatoryCourses},
        electiveCourses: {electiveCourses}
      }
    });
  }

  const handleFileSubmit = async (formYear, formSemester) => {
    //e.preventDefault()
    year = formYear
    semester = formSemester
    var mandatoryCourses_ = await fetchMCourses()
    await fetchECourses()
    defaultCheckDoneCourses(mandatoryCourses_)
    setShowKey('select')
  }

  const handleSelectCoursesSubmit = () => {
    if(user != null)
      updateUserDatabase()
    window.scrollTo(0, 0)
    setShowKey('schedule')
  }

  const onLogin = async (userFromLogin) => {
    const uid = userFromLogin.uid
    if(userFromLogin.email === adminMail)
      setIsAdmin(true)
    setUser(userFromLogin)
    const userHaveCourses = await checkUserCoursesExists(uid)
    const userHaveSchedulerData_ = await checkUserSchedulerDataExists(uid)
    const userHaveSharedSchedulersData_ = await checkSharedSchedulersDataExists(uid)
    var KeyIsSet = false;

    if(userHaveSharedSchedulersData_)
    {
      setShowKey('share')
      KeyIsSet = true
      await fetchSharedSchedulers(uid)
    }

    if(userHaveSchedulerData_ && userHaveCourses)
    {
      if(!KeyIsSet)
        setShowKey('schedule')
      setUserHaveSchedulerData(true)
      await fetchUserMandadtoryCourses(uid)
      await fetchUserElectiveCourses(uid)
    }
    else if(userHaveCourses)
    {
      if(!KeyIsSet)
      setShowKey('select')
      await fetchUserMandadtoryCourses(uid)
      await fetchUserElectiveCourses(uid)
    }
    else if(!KeyIsSet) //user doesn't have any data
      setShowKey('upload')
  }

  const onLogout = () => {
    console.log("LOGOUT")
	  setIsAdmin(false)
    setUser(null)

    setMandatoryCourses(null)// delete later
    setElectiveCourses(null)// delete later
    setShowKey('home') // delete later
  }

  return ( 
    <div style={appStyle} className="dashboard d-flex">
		<Sidebar 
      activeKey={showKey}
			handleHomeClick={() => setShowKey('home')}
			handleUploadClick={() => setShowKey('upload')}
			handleSelectClick={() => setShowKey('select')}
  		handleScheduleClick={() => setShowKey('schedule')}
      handleShareClick={() => setShowKey('share')}
			mandatoryCourses={mandatoryCourses}
			electiveCourses={electiveCourses}
			user={user}
			isAdmin={isAdmin}
			handleLogin={onLogin}
			handleLogout={onLogout}
		/>
		<div style={navbarStyle}>
			<Navbar user={user}/>
      <SharedSchedulers
				show={showKey === 'share'}
        sharedSchedulersData={sharedSchedulersData}
        />
			<Home 
				show={showKey ===  'home'}
        publishedSchedulersData={publishedSchedulersData}
			/>	
			<UploadForm 
				show={showKey === 'upload'} 
				onSubmit={handleFileSubmit}
			/>
			<SelectDoneCourses
				show={showKey === 'select'}
				mandatoryCourses={mandatoryCourses} 
				electiveCourses={electiveCourses} 
				onMandatoryCourseChecked={checkMandatoryCourse} 
				onElectiveCourseChecked={checkElectiveCourse} 
				onSubmit={handleSelectCoursesSubmit}
			/>
			<ScheduleCourses 
				show={showKey === 'schedule'}
        user={user}
        users={users}
        userHaveSchedulerData={userHaveSchedulerData}
				mandatoryCourses={mandatoryCourses}
				electiveCourses={electiveCourses} 
				year={year} 
				semester={semester}
        />

		</div>
    </div>
  );
}

const appStyle = {
  backgroundColor: '#444',
  color: 'white',
	direction: 'rtl',
	textAlign: 'right',
  }

const navbarStyle = {
	flex:"1 1 auto", display:"flex", flexFlow:"column", height:"100vh", overflowY:"hidden"
}
export default App;
