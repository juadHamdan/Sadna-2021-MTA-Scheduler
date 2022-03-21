import json
import os
import sqlite3

import firebase_admin
from firebase import firebase
from firebase_admin import credentials, db, auth
from flask import (Flask, flash, jsonify, redirect, render_template, request,
                   session)
from sklearn.datasets import fetch_20newsgroups
from werkzeug.exceptions import BadRequest, InternalServerError
from werkzeug.utils import secure_filename

from pdfExtraction import getCourses, listToDict

MandatoryCoursesRoute = "mandatoryCourses"
ElectiveCoursesRoute = "electiveCourses"
ALLOWED_EXTENSIONS = {'pdf'}

# Fetch the service account key JSON file contents
cred = credentials.Certificate('Sadna2021/serviceAccountKey.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://test-e3b45-default-rtdb.firebaseio.com'
})

firebase = firebase.FirebaseApplication('https://test-e3b45-default-rtdb.firebaseio.com/', None)

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/upload', methods=['POST'])
def upload():
    file_ = request.files.get("file")
    if not file_:
        raise BadRequest('קובץ ריק')
    if not allowed_file(file_.filename):
        raise BadRequest("יש להעלות קובץ PDF")
    try: 
        addCoursesToDatabase(file_) 
    except:
        raise InternalServerError('יש בעיה בהוצאת הקורסים מהידיעון')
    return 'OK'


# functions that get newsletter courses from database
@app.route('/mandatoryCourses', methods=['GET'])
def get_mandatory_courses():
    return getFromDatabase(MandatoryCoursesRoute)
@app.route('/electiveCourses', methods=['GET'])
def get_elective_courses():
    return getFromDatabase(ElectiveCoursesRoute)

# functions that get user courses from database
@app.route('/mandatoryCourses/<uid>', methods=['GET'])
def get_user_mandatory_courses(uid):
    return getFromDatabase(f'users/{uid}/{MandatoryCoursesRoute}')
@app.route('/electiveCourses/<uid>', methods=['GET'])
def get_user_elective_courses(uid):
    return getFromDatabase(f'users/{uid}/{ElectiveCoursesRoute}')

# function that get user's scheduler data from database 
@app.route('/userSchedulerData/<uid>', methods=['GET'])
def get_user_scheduler_data(uid):
    return getFromDatabase(f'usersSchedulerData/{uid}')

# function that get published schedulers data from database
@app.route('/schedulersData', methods=['GET'])
def get_schedulers_data():
    return getFromDatabase(f'schedulersData')

# function that get user's shared scheduler data from database 
@app.route('/sharedSchedulersData/<uid>', methods=['GET'])
def get_shared_scheduler_data(uid):
    return getFromDatabase(f'sharedSchedulersData/{uid}')


# functions that check if user's courses/scheduler-data exists
@app.route('/checkUserCourses/<uid>', methods=['GET'])
def check_user_courses(uid):
    if firebase.get(f'/users/{uid}', None) is None:
        raise BadRequest('קובץ ריק')
    return 'OK'
@app.route('/checkUserScheduleData/<uid>', methods=['GET'])
def check_user_schedule_data(uid):
    if firebase.get(f'/usersSchedulerData/{uid}', None) is None:
        raise BadRequest('קובץ ריק')
    return 'OK'
@app.route('/checkSharedScheduleData/<uid>', methods=['GET'])
def check_shared_schedule_data(uid):
    if firebase.get(f'/sharedSchedulersData/{uid}', None) is None:
        raise BadRequest('קובץ ריק')
    return 'OK'


# save/publish/share scheduler data
@app.route('/saveUserScheduleData/<uid>', methods=['POST'])
def save_user_schedule_data(uid):
    schedulerData = request.get_json()
    firebase.put('usersSchedulerData', uid, schedulerData['schedulerData']) #user can publish scheduler only once
    return 'OK'
@app.route('/publishSchedulerData', methods=['POST'])
def publish_schedule_data():
    data = request.get_json()
    newData = {}
    newData['schedulerData'] = data['schedulerData']['schedulerData']
    newData['photoURL'] = data['photoURL']['photoURL']
    newData['displayName'] = data['displayName']['displayName']
    newData['year'] = data['year']['currYear']
    newData['semester'] = data['semester']['currSemester']

    firebase.post('/schedulersData', newData) #store schedulerData under unique key
    return 'OK'
@app.route('/sharedSchedulersData/<uid>', methods=['POST'])
def share_user_schedule_data(uid):
    data = request.get_json()
    newData = {}
    newData['schedulerData'] = data['schedulerData']['schedulerData']
    newData['photoURL'] = data['photoURL']['photoURL']
    newData['displayName'] = data['displayName']['displayName']
    newData['year'] = data['year']['currYear']
    newData['semester'] = data['semester']['currSemester']
    firebase.post(f'/sharedSchedulersData/{uid}', newData)
    return 'OK'

@app.route('/updateUserDatabase/<uid>', methods=['POST'])
def update_user_database(uid):
    courses = request.get_json()
    firebase.put('users', uid, courses)
    return 'OK'

@app.route('/getUsersInfo', methods=['GET'])
def get_users_info():
    page = auth.list_users()
    while page:
        page = page.get_next_page()

    usersInfo = {}
    i = 0
    for user in auth.list_users().iterate_all():
        usersInfo[i] = user.__dict__
        i += 1
    return usersInfo


def getFromDatabase(url):
    return firebase.get(f'/{url}', None)


def addCoursesToDatabase(file):
    courses = getCourses(file)

    jsonMandatoryCourses = {'mandatoryCourses': listToDict(courses.mandatoryCourses)}
    firebase.put('', 'mandatoryCourses', jsonMandatoryCourses)
    jsonElectiveCourses = {'electiveCourses': listToDict(courses.electiveCourses)}
    firebase.put('', 'electiveCourses', jsonElectiveCourses)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/relevantGroups', methods=['GET'])
def get_relevant_groups():
    course_id = int(request.args.get('courseId'))
    semester = int(request.args.get('semester'))
    res_str = getGroupsBaseCourse(semester, course_id)
    res_str_distinct = {}
    for group in res_str:
        start_time = group['start_hour'].split(':')
        start_hour = start_time[0]
        start_min = start_time[1]
        end_time = group['end_hour'].split(':')
        end_hour = end_time[0]
        end_min = end_time[1]

        if group['group_id'] in res_str_distinct:
            res_str_distinct[group['group_id']].append({'lecturer': group['lecturer'], 'day': group['day'],
                                                   'start_hour': start_hour, 'start_min': start_min,
                                                   'end_hour': end_hour, 'end_min': end_min, 'is_exercise': group['is_exercise'], 'group_id': group['group_id'], 'name': group['course_name'], 'course_number': group['course_number']
                                                   })
        else:
            res_str_distinct[group['group_id']] = [{'lecturer': group['lecturer'], 'day': group['day'], 'start_hour': start_hour, 'start_min': start_min,
                                                   'end_hour': end_hour, 'end_min': end_min,  'is_exercise': group['is_exercise'], 'group_id': group['group_id'], 'name': group['course_name'], 'course_number': group['course_number']
                                                   }]
    res = json.dumps(res_str_distinct)
    return res


@app.route('/relevantExercise', methods=['GET'])
def get_relevant_exercise():
    group_id = int(request.args.get('groupId'))
    res_str = getExerciseBaseGroup(group_id)
    res_str_distinct = {}
    for group in res_str:
        start_time = group['start_hour'].split(':')
        start_hour = start_time[0]
        start_min = start_time[1]
        end_time = group['end_hour'].split(':')
        end_hour = end_time[0]
        end_min = end_time[1]

        if group['group_id'] in res_str_distinct:
            res_str_distinct[group['group_id']].append({'lecturer': group['lecturer'], 'day': group['day'],
                                                   'start_hour': start_hour, 'start_min': start_min,
                                                   'end_hour': end_hour, 'end_min': end_min, 'is_exercise': group['is_exercise'], 'group_id': group['group_id'], 'name': group['course_name'], 'course_number': group['course_number']
                                                   })
        else:
            res_str_distinct[group['group_id']] = [{'lecturer': group['lecturer'], 'day': group['day'], 'start_hour': start_hour, 'start_min': start_min,
                                                   'end_hour': end_hour, 'end_min': end_min,  'is_exercise': group['is_exercise'], 'group_id': group['group_id'], 'name': group['course_name'], 'course_number': group['course_number']
                                                   }]
    res = json.dumps(res_str_distinct)
    return res

@app.route('/relevantCourses', methods=['GET'])
def get_relevant_courses():
    section = int(request.args.get('section'))
    semester = int(request.args.get('semester'))
    res_str = getCourseBaseCondition(semester, section)
    return json.dumps(res_str)

def getCourseBaseCondition(semester, section):
    conn = sqlite3.connect('Sadna2021/sadna.db')
    section_str = section_mapping(section)
    q = """select distinct(course_name), courses.course_number from sections
            join courses on sections.course_number= courses.course_number
            join course_groups on course_groups.group_id=courses.group_id
            join group_times on group_times.group_id = courses.group_id
            where section_name='%s'
            and semester = %s""" % (section_str, semester)
    cursor = conn.execute(q)
    conn.commit()
    columns = cursor.description
    result = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]
    conn.close()
    return result


def getGroupsBaseCourse(semester, course_id):
    conn = sqlite3.connect('Sadna2021/sadna.db')
    q = """select DISTINCT courses.course_number, course_name, courses.group_id, semester, 
            lecturer, related_group_ids, is_exercise, day, start_hour, end_hour from courses
            left join course_groups on course_groups.group_id=courses.group_id
            left join group_times on group_times.group_id = courses.group_id
            where courses.course_number='%s'
            and semester = %s and is_exercise=0""" % (course_id, semester)
    cursor = conn.execute(q)
    conn.commit()
    columns = cursor.description
    result = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]
    conn.close()
    return result


def getExerciseBaseGroup(group_id):
    conn = sqlite3.connect('Sadna2021/sadna.db')
    relates_q = """select related_group_ids from course_groups where group_id=%s""" % (group_id)
    cursor = conn.execute(relates_q)
    conn.commit()
    relates = cursor.fetchall()
    if len(relates) != 1:
        return
    related_str = relates[0][0].replace('[', '').replace(']', '')
    q = """select DISTINCT courses.course_number, course_name, courses.group_id, semester, 
            lecturer, related_group_ids, is_exercise, day, start_hour, end_hour from courses
            left join course_groups on course_groups.group_id=courses.group_id
            left join group_times on group_times.group_id = courses.group_id
             where group_times.group_id in (%s)""" % (related_str)
    cursor = conn.execute(q)
    conn.commit()
    columns = cursor.description
    result = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]
    conn.close()
    return result



def section_mapping(section_number):
    if section_number == 1:
        return 'קורסי חובה במדעי המחשב שלב א'
    if section_number == 2:
        return 'קורסי חובה במדעי המחשב שלב ב'
    if section_number == 3:
        return 'קורסי חובה במדעי המחשב שלב ג'
    if section_number == 4:
        return 'מסגרת קורסי בחירה במדעי המחשב'
    if section_number == 5:
        return 'מסגרת קורסי בחירה במדעים'
    if section_number == 6:
        return 'מסגרת קורסי בחירה במתמטיקה'
    if section_number == 7:
        return 'מסגרת סדנא'
    if section_number == 8:
        return 'מסגרת קורסים שלא לתואר'



if __name__ == "__main__":
   app.run(debug=True)
