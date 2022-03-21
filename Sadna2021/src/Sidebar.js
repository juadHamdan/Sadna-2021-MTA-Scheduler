import React from "react";
import {useState} from 'react'
import { 
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBBadge } from "cdbreact";
import { gotoDatabase, gotoUserManagement } from './components/HandleDatabase'
import DisplayCourses from './components/courses/DisplayCourses'
import Login from './components/Login'
import Logout from './components/Logout'

const Sidebar = ({activeKey, mandatoryCourses, electiveCourses, handleUploadClick, handleSelectClick, handleHomeClick, handleScheduleClick, handleShareClick,
user, isAdmin, handleLogin, handleLogout}) => {
  const [showMCourses, setShowMCourses] = useState(false);
  const [showECourses, setShowECourses] = useState(false);

  const handleShowECourses = () => setShowECourses(true);
  const handleShowMCourses = () => setShowMCourses(true);
  const handleCloseECourses = () => setShowECourses(false);
  const handleCloseMCourses = () => setShowMCourses(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  

  const onLoginSuccess = () => {
      setShowLoginModal(false)
  }

  return (
    <div
      className={`app`}
      style={{overflow:"scroll initial"}}
    >

      <DisplayCourses show={showECourses} courses={electiveCourses} coursesType={'electiveCourses'} handleClose={handleCloseECourses} modalTitle='קורסי בחירה'/>
      <DisplayCourses show={showMCourses} courses={mandatoryCourses} coursesType={'mandatoryCourses'} handleClose={handleCloseMCourses} modalTitle='קורסי חובה'/>
      <Login 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onLoginSuccess={onLoginSuccess}
      />
      <Logout 
        show={showLogoutModal} 
        onHide={() => setShowLogoutModal(false)}
        onLogoutSuccess={handleLogout}
      />
      
      
      <CDBSidebar
        style={{textAlign:"right"}}
        textColor="#fff"
        backgroundColor="#222"
      >
        <CDBSidebarHeader
          prefix={
            <i className="fa fa-bars fa-large"></i>
          }
        >
          <a href="/" className="text-decoration-none" style={{color:"inherit"}}>
            Schedule Builder
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>

            {user?
                <CDBSidebarMenuItem
                icon="sign-out-alt"
                onClick={() => setShowLogoutModal(true)}
              >
                <i>{' '}</i>התנתקות
              </CDBSidebarMenuItem>
              : 
              <CDBSidebarMenuItem
                icon="sign-in-alt"
                onClick={() => setShowLoginModal(true)}
              >
                <i>{' '}</i> התחברות
              </CDBSidebarMenuItem>
            }
            <hr/>
              <CDBSidebarMenuItem
                  style={activeKey==='home'?
                  menuItemClickedStyle
                  :null }
                  icon="home"
                  onClick={handleHomeClick}>
                  <i>{' '}</i>בית
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem
                style={activeKey==='upload'?
                menuItemClickedStyle
                :null }
                icon="file-upload"
                onClick={handleUploadClick}
              >
                  <i>{' '}</i>העלאת ידיעון
              </CDBSidebarMenuItem>

              <CDBSidebarMenuItem
                style={activeKey==='select'?
                menuItemClickedStyle
                :null }
                icon="archive" 
                onClick={handleSelectClick}
              >
                  <i>{' '}</i>בחירת קורסים
              </CDBSidebarMenuItem>
              <CDBSidebarMenuItem
                style={activeKey==='schedule'?
                menuItemClickedStyle
                :null }
                icon="calendar-alt"
                onClick={handleScheduleClick}
              >
                 <i>{' '}</i>בניית מערכת שעות
              </CDBSidebarMenuItem>
              <CDBSidebarMenuItem
                style={activeKey==='share'?
                menuItemClickedStyle
                :null }
                icon="calendar"
                onClick={handleShareClick}
              >
                 <i>{' '}</i> מע' שעות ששותפו איתי
              </CDBSidebarMenuItem>
              <hr/>
              <CDBSidebarMenuItem
                icon="bookmark"
                onClick={handleShowMCourses}
              >
                <i>{' '}</i>הצגת קורסי חובה
              </CDBSidebarMenuItem>
            <CDBSidebarMenuItem
                icon="bookmark"
                onClick={handleShowECourses}
              >
                 <i>{' '}</i>הצגת קורסי בחירה
              </CDBSidebarMenuItem>

              {isAdmin?
                <>
                  <div style={{alignItems: 'center'}}>
                  <CDBBadge color="primary" size="medium" borderType="pill">
                    אדמין
                  </CDBBadge>
                  </div>
                  <CDBSidebarMenuItem
                    icon="database"
                    onClick={gotoDatabase}
                  >
                    <i>{' '}</i>למסד הנתונים
                  </CDBSidebarMenuItem>
                  <CDBSidebarMenuItem
                    icon="users-cog"
                    onClick={gotoUserManagement}
                  >
                    <i>{' '}</i>לניהול משתמשים
                  </CDBSidebarMenuItem>
                  <hr/>
                </>
              : 
              <>
              <hr/>
              </>}


          </CDBSidebarMenu>
          <CDBSidebarMenu>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: "20px 5px"
            }}
          >
            Schedule
            Builder
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
}

const menuItemClickedStyle = {
  backgroundColor: "#fff",
  color: 'black'
}

export default Sidebar;
