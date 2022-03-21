# coding: utf-8
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
import time
import re
import sqlite3
from selenium.common.exceptions import NoSuchElementException


def format_strings(string):
    return string.replace(' ', '').replace('`', '')


class CrawlerCourses:
    def __init__(self):
        self.user = 'koralfa'
        self.password = 'Password2710'
        self.driver = webdriver.Chrome(executable_path="crawler\chromedriver.exe")

    def extract(self):
        self.login()
        base_window = self.driver.current_window_handle

        self.switch_pages(base_window)
        return self.extract_sections(base_window)

    def switch_pages(self, base_window):
        computerScienceLink = "//input[@value='לחץ כאן למעבר']"

        sectionPage = WebDriverWait(self.driver, 10).until(lambda driver: driver.find_element_by_xpath(computerScienceLink))
        sectionPage.click()
        chwd = self.driver.window_handles
        for window in chwd:
            # switch focus to child window
            if window != base_window:
                self.driver.switch_to.window(window)

    def login(self):
        login_url = 'https://mtamn.mta.ac.il/yedion/fireflyweb.aspx'

        self.driver.get(login_url)

        user_url = "//input[@id='R1C1']"
        password_url = "//input[@id='R1C2']"
        ButtonURL = "//button[@id='loginbtn']"
        learningSearchsec = "//a[contains(.,'תוכנית הלימוד שלי')]"
        learningSearch = "//a[contains(.,'אתרי קורסים')]"

        user_element = WebDriverWait(self.driver, 10).until(lambda driver: driver.find_element_by_xpath(user_url))
        user_element.send_keys(self.user)

        pass_element = WebDriverWait(self.driver, 10).until(lambda driver: driver.find_element_by_xpath(password_url))
        pass_element.send_keys(self.password)

        ButtonElement = WebDriverWait(self.driver, 10).until(lambda driver: driver.find_element_by_xpath(ButtonURL))
        ButtonElement.click()

        learning = WebDriverWait(self.driver, 10).until(lambda driver: driver.find_element_by_xpath(learningSearch))
        learning.click()
        time.sleep(3)

        learningsec = WebDriverWait(self.driver, 10).until(lambda driver: driver.find_element_by_xpath(learningSearchsec))
        learningsec.click()

    def extract_sections(self, base_window):
        section_link_type = ".//a[contains(.,'הצגת קורסים ')]"
        table = self.driver.find_element_by_xpath("//table[@id='myTable0']")
        sections = []
        rows = table.find_elements_by_xpath(".//tr")
        for index in range(1, len(rows)):
            self.driver.switch_to.window(base_window)
            self.switch_pages(base_window)
            table = self.driver.find_element_by_xpath("//table[@id='myTable0']")
            rows = table.find_elements_by_xpath(".//tr")
            row = rows[index]
            values = row.find_elements_by_xpath(".//td")
            section_name = values[0].text
            section_link = values[1].find_element_by_xpath(section_link_type)
            section_link.click()
            courses = self.extract_courses_in_section()
            sections.append({'section_name': section_name, 'courses': courses})
        return sections

    def extract_courses_in_section(self):
        pages_index = "//li[contains(@class, 'paginate_button page-item')]"
        courses_res = []
        pages = self.driver.find_elements_by_xpath(pages_index)
        pages_amount = len(pages) - 1
        courses_res = self.extract_section_page(courses_res)
        for page_index in range(2, pages_amount):
            time.sleep(2)
            pages = self.driver.find_elements_by_xpath(pages_index)
            next_page_link = pages[page_index].find_element_by_xpath(".//a[@class='page-link']")
            next_page_link.click()
            self.driver.execute_script("scroll(250, 0)")
            courses_res = self.extract_section_page(courses_res)
        return courses_res

    def extract_section_page(self, courses_res):
        course_link_str = ".//input[@value='חיפוש קורס במערכת השעות']"
        table = self.driver.find_element_by_xpath("//table[@id='myTable0']")
        rows = table.find_elements_by_xpath(".//tr")
        for index in range(1, len(rows)):
            table = self.driver.find_element_by_xpath("//table[@id='myTable0']")
            rows = table.find_elements_by_xpath(".//tr")
            row = rows[index]
            values = row.find_elements_by_xpath(".//td")
            course_number = format_strings(values[0].text)
            course_name = values[1].text
            course_link = values[3].find_element_by_xpath(course_link_str)
            course_link.click()
            try:
                course_options = self.extract_course()
            except NoSuchElementException:
                self.driver.execute_script("window.history.go(-1)")
                continue
            courses_res.append({'course_name': course_name, 'course_number': course_number, 'course_options': course_options})
            time.sleep(2)
        return courses_res

    def extract_course(self):
        course_options = []
        body = self.driver.find_element_by_xpath("//tr[@class='TextAlignRight']")
        all_options_tables = body.find_elements_by_xpath(".//table[contains(@id, 'DataTables_Table_')]")
        all_options_titles = body.find_elements_by_xpath(".//div[contains(@class, 'text TextAlignRight')]")
        all_options_sub_titles = body.find_elements_by_xpath(".//span[@style='color: green']")

        for index in range(0, len(all_options_tables)):
            option = all_options_tables[index]
            title = all_options_titles[index]
            sub_title = all_options_sub_titles[index].text
            is_exercise = sub_title.find('תרגיל') != -1
            body = option.find_element_by_xpath(".//tbody")
            group_id = re.findall(r'[0-9]{3,}', title.find_element_by_xpath(".//span").text)[0]

            related_groups = re.findall(r'[0-9]{3,}', sub_title)
            group_sections = body.find_elements_by_xpath(".//tr")
            group_times = []
            semester = ''
            lecturer = ''
            for group_section in group_sections:
                values = group_section.find_elements_by_xpath(".//td")
                semester = format_strings(values[0].text)
                if semester == 'טבלהריקה':
                    continue
                day = format_strings(values[1].text)
                start_hour = format_strings(values[2].text)
                end_hour = format_strings(values[3].text)
                lecturer = values[4].text
                group_times.append({'day': day, 'start_hour': start_hour, 'end_hour': end_hour})
            course_options.append({'semester': semester, 'lecturer': lecturer, 'group_times': group_times, 'group_id': group_id, 'related_groups': related_groups, 'is_exercise': is_exercise})
        self.driver.execute_script("window.history.go(-1)")
        return course_options


class InitDB:
    def __init__(self, conn):
        self.conn = conn

    def create_tables(self):
        self.conn.execute('''CREATE TABLE IF NOT EXISTS sections
                 (
                 section_name           CHAR(50)    NOT NULL,
                 course_number         INT     NOT NULL);''')

        self.conn.execute('''CREATE TABLE IF NOT EXISTS courses
                 (
                 course_name           CHAR(50)    NOT NULL,
                 course_number         INT    NOT NULL,
                 group_id        INT);''')

        self.conn.execute('''CREATE TABLE IF NOT EXISTS course_groups
                 (
                 semester           INT     NOT NULL,
                 lecturer          CHAR(50)     NOT NULL,
                 group_id        INT,
                 related_group_ids        CHAR(50),
                 is_exercise        boolean);''')

        self.conn.execute('''CREATE TABLE IF NOT EXISTS group_times
                 (
                 group_id           INT    NOT NULL,
                 course_number         INT     NOT NULL,
                 day         INT     NOT NULL,
                 start_hour        CHAR(50),
                 end_hour        CHAR(50));''')
        self.conn.commit()

    def load_data(self, data):
        for section in data:
            section_name = section['section_name'].replace('"', '').replace("'", '')
            courses = section['courses']
            for course in courses:
                course_name = course['course_name'].replace('"', '').replace("'", '')
                course_number = int(course['course_number'])
                course_options = course['course_options']
                for option in course_options:
                    semester = self.format_day_to_num(option['semester'])
                    if semester == None:
                        continue
                    lecturer = option['lecturer'].replace('"', '').replace("'", '')
                    group_id = int(option['group_id'])
                    related_group_ids = str(self.parse_related_group_ids(option['related_groups']))
                    is_exercise = bool(option['is_exercise'])
                    group_times = option['group_times']
                    for time in group_times:
                        day = self.format_day_to_num(time['day'])
                        start_hour = time['start_hour']
                        end_hour = time['end_hour']
                        self.conn.execute("INSERT INTO group_times (group_id, course_number, day,start_hour, end_hour) VALUES (%s, %s, %s, '%s', '%s')" % (group_id, course_number, day, start_hour, end_hour))
                    self.conn.execute(
                        "INSERT INTO course_groups (semester, lecturer, group_id,related_group_ids, is_exercise) VALUES (%s, '%s', %s, '%s', %s)" % (
                        semester, lecturer, group_id, related_group_ids, is_exercise))
                    self.conn.execute(
                        "INSERT INTO courses (course_name, course_number, group_id) VALUES ('%s', %s, %s)" % (
                            course_name, course_number, group_id))
                self.conn.execute(
                    "INSERT INTO sections (section_name, course_number) VALUES ('%s', %s)" % (
                        section_name, course_number))
                self.conn.commit()
        self.conn.close()

    @staticmethod
    def format_day_to_num(day):
        if day == 'א':
            return 1
        if day == 'ב':
            return 2
        if day == 'ג':
            return 3
        if day == 'ד':
            return 4
        if day == 'ה':
            return 5
        if day == 'ו':
            return 6
        if day == 'קיץ':
            return 3

    @staticmethod
    def parse_related_group_ids(related_group_ids):
        related_groups = []
        for group in related_group_ids:
            related_groups.append(int(group))
        return related_groups


if __name__ == '__main__':
    conn = sqlite3.connect('Sadna2021/sadna.db')
    InitDB(conn).create_tables()
    data = CrawlerCourses().extract()
    InitDB(conn).load_data(data)


