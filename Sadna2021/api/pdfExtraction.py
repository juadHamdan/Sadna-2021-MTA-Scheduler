import pdfplumber  # Documentation: "https://github.com/jsvine/pdfplumber#extracting-tables"

MandatoryCoursesKeyName = "קורסי חובה"
ElectiveCoursesKeyName = "קורסי בחירה"
CourseKeyNames = ["שם הקורס", "שם קורס"]
LecHoursKeyNames = ["שעות שבועיות", "שיעור", "הרצאה", "ש\"ס", "שעות סמסטריאליות"]  # from hard match to soft match
ExHoursKeyNames = ["תרגיל", "תרגול"]
ParallelReqsKeyNames = ["לימוד במקביל", "מקביל"]
PrerequisitesKeyNames = ["עובר"]
CreditsKeyNames = ["נ\"ז", "נקודות זכות"]
SemesterKeyNames = ["סמס", "סמסטר"]
SemesterHebrewKeyNames = ["א\' או ב\'", "ב", "א"]
SemesterHebrewKeyNamesMatch = [[1, 2], [2], [1]]

Year = "שנה"
Years = ["שנה א", "שנה ב", "שנה ג"]
YearsInHebrewAlpha = ["א", "ב", "ג"]
Mandatory = "קורסי חובה"
Elective = "קורסי בחירה"
Semester = "סמסטר"
DefaultSemester = [1]  # [1, 2] for semesters A and B
StartingSemester = [1]
StartingYear = 1


class Degree:
    def __init__(self, mandatoryCourses, electiveCourses):
        self.mandatoryCourses = mandatoryCourses
        self.electiveCourses = electiveCourses

    def print(self):
        print("---------------------------------------------------------------\nMandatory Courses: ")
        printCourses(self.mandatoryCourses)
        if self.electiveCourses:
            print("---------------------------------------------------------------\nElective Courses: ")
            printCourses(self.electiveCourses)


class MandatoryCourse:
    def __init__(self, title, credits=0, lecSemHours=0, exSemHours=0, year=0, semesters=None,
                 prerequisites=None, parallelReqs=None):
        if lecSemHours is None:
            lecSemHours = 0
        if exSemHours is None:
            exSemHours = 0
        if credits is None:
            credits = 0
        if year is None:
            year = 0
        if semesters is None:
            semesters = DefaultSemester
        if prerequisites is None:
            prerequisites = ""
        if parallelReqs is None:
            parallelReqs = ""

        self.title = title
        self.credits = credits
        self.lecSemHours = lecSemHours
        self.exSemHours = exSemHours
        self.year = year
        self.semesters = semesters
        self.parallelReqs = parallelReqs
        self.prerequisites = prerequisites

    def print(self):
        print("-------")
        print("Name: " + self.title, "| Credits:", self.credits,
              "| Lecture Sem' Hours:", self.lecSemHours, "| Exercise Sem' Hours:", self.exSemHours,
              "| Year:", self.year, "| Semester: ", end='')
        if len(self.semesters) == 1:
            if self.semesters[0] == 1:
                print("A")
            else:
                print("B")
        else:
            print("A and B")

        if self.prerequisites:
            print("Prerequisites:", self.prerequisites)
        if self.parallelReqs:
            print("Parallel Requests:", self.parallelReqs)


class ElectiveCourse:
    def __init__(self, title, credits=0, semesters=None, prerequisites=None):
        if prerequisites is None:
            prerequisites = ""
        if credits is None:
            credits = 0
        if semesters is None:
            semesters = DefaultSemester

        self.title = title
        self.credits = credits
        self.semesters = semesters
        self.prerequisites = prerequisites

    def print(self):
        print("-------")
        print("Name: " + self.title, "| Credits:", self.credits, "| Semester: ", end='')
        if len(self.semesters) == 1:
            if self.semesters[0] == 1:
                print("A")
            else:
                print("B")
        else:
            print("A and B")
        if self.prerequisites:
            print("Prerequisites:", self.prerequisites)


def isEnglish(word):
    return word.replace('(', '').replace(')', '').encode().isalpha()


def findIndexOfColumnNameInLine(line, optionalColumnNames):
    i = len(line) - 1
    while i >= 0:
        for optionalColumnName in optionalColumnNames:
            if line[i] and optionalColumnName in line[i]:
                return i
        i -= 1
    return None


def findIndexOfColumnNameInTable(table, optionalColumnNames):
    for line in table:
        index = findIndexOfColumnNameInLine(line, optionalColumnNames)
        if index is not None:
            return index
    return None


def findColumnNameInLine(line, columnNames):
    for i in range(0, len(line)):
        for columnName in columnNames:
            if line[i] is not None and columnName in line[i]:
                return line[i]
    return None


def printCourses(courses):
    for course in courses:
        course.print()


def convertSemesterStringToNumber(notConvertedSemester):
    for i in range(0, len(SemesterHebrewKeyNames)):
        if SemesterHebrewKeyNames[i] in notConvertedSemester:
            return SemesterHebrewKeyNamesMatch[i]


def handleCellWithNewLine(cell):
    tempCell = cell.split("\n")
    resCell = ""
    i = len(tempCell) - 1

    while i >= 0:
        resCell = resCell + " " + tempCell[i].strip()
        i -= 1
    return resCell[1:]


def removeUnnecessarySpacesFromString(string):
    length = len(string)
    newString = string

    if (not newString.isnumeric()) and newString[length - 1] != ' ' and (not newString[length - 1].isnumeric()) and (
            not isEnglish(newString[length - 1])) and newString[length - 2] == ' ':
        newString = " ".join(string.split())
        length = len(newString)  # new length
        newString = newString[:length - 2] + newString[length - 1]

    return newString


def reverseEnglishLetters(String):
    words = String.split(' ')
    newString = ' '.join([word if not isEnglish(word) else word[::-1] for word in words])
    return newString


def tableManipulations(table):
    for lineIndex in range(0, len(table)):
        for cellIndex in range(0, len(table[lineIndex])):
            if table[lineIndex][cellIndex]:
                if "\n" in table[lineIndex][cellIndex]:
                   table[lineIndex][cellIndex] = handleCellWithNewLine(table[lineIndex][cellIndex])
                # reverse the string in every cell of table
                if not table[lineIndex][cellIndex].replace("-", "").isnumeric():
                    table[lineIndex][cellIndex] = table[lineIndex][cellIndex][::-1]
                table[lineIndex][cellIndex] = removeUnnecessarySpacesFromString(table[lineIndex][cellIndex]).replace("*", "")
                table[lineIndex][cellIndex] = reverseEnglishLetters(table[lineIndex][cellIndex])


def isTableOfCourses(table):
    for _ in range(0, len(CourseKeyNames)):
        if findColumnNameInLine(table[0], CourseKeyNames) is not None:
            return True
    return False


def isTableOfCoursesSplit(table):
    if isTableOfCourses(table):
        return False
    for cell in table[0]:
        if cell and cell.isnumeric():
            return True
    return False


def updateCurrCourseSemesterFromTable(line):
    courseSemester = findColumnNameInLine(line, SemesterKeyNames)
    if courseSemester:
        courseSemester = convertSemesterStringToNumber(courseSemester)
    return courseSemester


def extractDataOfElectiveCoursesFromTable(courses, table, nameIndex, creditsIndex, prerequisitesIndex):
    currCourseSemester = StartingSemester
    for line in table:
        prevCourseSemester = currCourseSemester
        tempCourseSemester = updateCurrCourseSemesterFromTable(line)
        if tempCourseSemester and tempCourseSemester != prevCourseSemester:
            currCourseSemester = tempCourseSemester
        name = line[nameIndex]
        credits = line[creditsIndex]
        prerequisites = line[prerequisitesIndex]

        # allocating a new Course using the wanted data and add to the list
        if name and name != "" and credits != "" and credits.isdecimal():
            courses.append((ElectiveCourse(name, credits, currCourseSemester, prerequisites)))


def updateCurrIndexesOfMandatoryCourseKeyWords(line, nameIndex, creditsIndex,
                                               lectureSemHoursIndex, exerciseSemHoursIndex, parallelReqsIndex,
                                               prerequisitesIndex):
    nameIndex[0] = findIndexOfColumnNameInLine(line, CourseKeyNames)
    creditsIndex[0] = findIndexOfColumnNameInLine(line, CreditsKeyNames)
    lectureSemHoursIndex[0] = findIndexOfColumnNameInLine(line, LecHoursKeyNames)
    exerciseSemHoursIndex[0] = findIndexOfColumnNameInLine(line, ExHoursKeyNames)
    parallelReqsIndex[0] = findIndexOfColumnNameInLine(line, ParallelReqsKeyNames)
    prerequisitesIndex[0] = findIndexOfColumnNameInLine(line, PrerequisitesKeyNames)


def extractDataOfMandatoryCoursesFromTable(courses, table, currYear, currSemester, nameIndex, creditsIndex,
                                           lectureSemHoursIndex, exerciseSemHoursIndex, parallelReqsIndex,
                                           prerequisitesIndex):
    prevLineSize = len(table[0])  # update line size

    for line in table:
        # a line may be of a different table format
        currLineSize = len(line)
        if prevLineSize != currLineSize:
            updateCurrIndexesOfMandatoryCourseKeyWords(line, [nameIndex], [creditsIndex],
                                                       [lectureSemHoursIndex], [exerciseSemHoursIndex],
                                                       [parallelReqsIndex],
                                                       [prerequisitesIndex])

        # year update
        prevCourseSemester = currSemester[0]
        tempCourseSemester = updateCurrCourseSemesterFromTable(line)
        if tempCourseSemester and tempCourseSemester != prevCourseSemester:
            currSemester[0] = tempCourseSemester
        # when current semester changed from B to A => a new year
        if prevCourseSemester == [2] and currSemester[0] == [1]:
            currYear[0] = currYear[0] + 1

        # find the wanted data using the indexes of data
        if nameIndex is None or creditsIndex is None or lectureSemHoursIndex is None:
            return
        if nameIndex > len(line):
            return
        name = line[nameIndex]
        credits = line[creditsIndex]
        lectureSemHours = line[lectureSemHoursIndex]
        if exerciseSemHoursIndex:
            exerciseSemHours = line[exerciseSemHoursIndex]
        else:
            exerciseSemHours = None
        if parallelReqsIndex:
            parallelReqs = line[parallelReqsIndex]
        else:
            parallelReqs = None
        if prerequisitesIndex:
            prerequisites = line[prerequisitesIndex]
        else:
            prerequisites = None

        if prerequisites is None:
            prerequisites = []

        # allocating a new Course using the wanted data and add to the list
        if name and name != "" and credits and credits != "" and credits != 0 and credits.isdecimal():
            courses.append((MandatoryCourse(name, credits, lectureSemHours,
                                            exerciseSemHours, currYear[0],
                                            currSemester[0], prerequisites, parallelReqs)))


def getMandatoryCoursesFromTables(mandatoryCoursesTables, mandatoryCourses):
    currYear = [StartingYear]
    currSemester = [StartingSemester]

    for mandatoryCoursesTable in mandatoryCoursesTables:
        if mandatoryCoursesTable:
            # get the indexes of a certain key words that we want to extract from each table
            nameIndex = findIndexOfColumnNameInTable(mandatoryCoursesTable, CourseKeyNames)
            creditsIndex = findIndexOfColumnNameInTable(mandatoryCoursesTable, CreditsKeyNames)
            lectureSemHoursIndex = findIndexOfColumnNameInTable(mandatoryCoursesTable, LecHoursKeyNames)
            exerciseSemHoursIndex = findIndexOfColumnNameInTable(mandatoryCoursesTable, ExHoursKeyNames)
            parallelReqsIndex = findIndexOfColumnNameInTable(mandatoryCoursesTable, ParallelReqsKeyNames)
            prerequisitesIndex = findIndexOfColumnNameInTable(mandatoryCoursesTable, PrerequisitesKeyNames)

            extractDataOfMandatoryCoursesFromTable(mandatoryCourses, mandatoryCoursesTable, currYear, currSemester,
                                                   nameIndex,
                                                   creditsIndex, lectureSemHoursIndex, exerciseSemHoursIndex,
                                                   parallelReqsIndex, prerequisitesIndex)


def getElectiveCoursesFromTables(electiveCoursesTables, electiveCourses):
    for electiveCoursesTable in electiveCoursesTables:
        if electiveCoursesTable:
            # get the indexes of a certain key words that we want to extract from each table
            nameIndex = findIndexOfColumnNameInTable(electiveCoursesTable, CourseKeyNames)
            creditsIndex = findIndexOfColumnNameInTable(electiveCoursesTable, CreditsKeyNames)
            prerequisitesIndex = findIndexOfColumnNameInTable(electiveCoursesTable, PrerequisitesKeyNames)

            extractDataOfElectiveCoursesFromTable(electiveCourses, electiveCoursesTable, nameIndex,
                                                  creditsIndex,
                                                  prerequisitesIndex)
    if len(electiveCourses) <= 5:
        electiveCourses.clear()


def newsletterHasElectiveCourses(pdf):
    electiveCoursesReversed = ElectiveCoursesKeyName[::-1]
    for i in range(0, len(pdf.pages)):
        currPageAsString = pdf.pages[i].extract_text()
        if electiveCoursesReversed in currPageAsString:
            return True
    return False


def pageHasElectiveCourses(page):
    electiveCoursesReversed = ElectiveCoursesKeyName[::-1]
    pageAsString = page.extract_text()
    if electiveCoursesReversed in pageAsString:
        return True
    return False


def joinElectiveCoursesTables(pdf, currPageIndex):
    electiveCoursesTables = []
    tablesStart = False  # after tableStart is True, every table after is also of courses
    tablesDone = False  # done with the tables
    courseTable = False
    tableSplit = False

    while currPageIndex[0] < len(pdf.pages) and tablesDone is False:
        page = pdf.pages[currPageIndex[0]]
        tables = page.extract_tables()
        for i in range(0, len(tables)):
            tableManipulations(tables[i])
            courseTable = isTableOfCourses(tables[i])
            tableSplit = isTableOfCoursesSplit(tables[i])
            if courseTable:
                electiveCoursesTables.append(tables[i])
                tablesStart = True
            if tablesStart and tableSplit:
                electiveCoursesTables[len(electiveCoursesTables) - 1].extend(
                    tables[i])  # add split table to the last table

            if tablesStart and (not courseTable) and (not tableSplit):
                tablesDone = True
                break

        currPageIndex[0] = currPageIndex[0] + 1

    return electiveCoursesTables


def joinMandatoryCoursesTables(pdf, currPageIndex):
    mandatoryCoursesTables = []
    tablesStart = False  # after tableStart is True, every table after is also of courses
    tablesDone = False  # done with the tables
    courseTable = False

    while currPageIndex[0] < len(pdf.pages) and tablesDone is False:
        page = pdf.pages[currPageIndex[0]]
        tables = page.extract_tables()
        for i in range(0, len(tables)):
            tableManipulations(tables[i])
            courseTable = isTableOfCourses(tables[i])
            if courseTable:
                mandatoryCoursesTables.append(tables[i])
                tablesStart = True
            elif tablesStart:
                tablesDone = True
                break

        if tablesDone:
            break

        currPageIndex[0] = currPageIndex[0] + 1

    return mandatoryCoursesTables


# Our pdf extraction main function
def getCourses(file):
    with pdfplumber.open(file) as pdf:
        mandatoryCourses = []
        electiveCourses = []
        degree = Degree(mandatoryCourses, electiveCourses)

        currPageIndex = [0]  # a way to pass the variable by ref.
        mandatoryCoursesTables = joinMandatoryCoursesTables(pdf, currPageIndex)  # also deal with split tables
        electiveCoursesTables = joinElectiveCoursesTables(pdf, currPageIndex)

        getMandatoryCoursesFromTables(mandatoryCoursesTables, mandatoryCourses)
        if newsletterHasElectiveCourses(pdf):
            getElectiveCoursesFromTables(electiveCoursesTables, electiveCourses)

        pdf.close()
        return degree


def listToDict(courses):
    courseDict = {}
    for i in range(0, len(courses)):
        courseDict[i] = courses[i].__dict__
    return courseDict