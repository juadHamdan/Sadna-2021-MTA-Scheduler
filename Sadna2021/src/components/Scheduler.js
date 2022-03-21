import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { Resources } from '@devexpress/dx-react-scheduler-material-ui';
import { Scheduler, WeekView, Appointments, AppointmentTooltip } 
from "@devexpress/dx-react-scheduler-material-ui";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue, orange, green } from "@material-ui/core/colors";
import { Container, Row, Col } from 'react-bootstrap'

const theme = createMuiTheme({ palette: { type: "dark" } });
const COURSE_TYPES = ['Mandatory', 'Elective', 'Sadna'];
const resources = [{
  fieldName: 'courseType',
  title: 'Course type',
  instances: [
    { id: COURSE_TYPES[0], text: COURSE_TYPES[0], color: blue },
    { id: COURSE_TYPES[1], text: COURSE_TYPES[1], color: orange },
    { id: COURSE_TYPES[2], text: COURSE_TYPES[2], color: green }
  ],
}];

export class SchedulerTable extends Component {
  render() {
  const data = this.props.data ?? []

    return (
      <MuiThemeProvider theme={theme}>
        <Paper>
          <Scheduler 
            data={data.map((group, index) => ({...group, id: index}))}
            height={this.props.height}

          >
            <ViewState currentDate="2020-11-01" />
            <WeekView startDayHour={8} endDayHour={21} excludedDays={[6]}/>        

            <Appointments />
            <AppointmentTooltip />
            
            <Resources
              data={resources}
            />
          </Scheduler>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default SchedulerTable