import React, { Component } from 'react'

export class Group extends Component {
    constructor(props) {
        super(props)
        this.state = {renderDone: true}
    }

    render() {
         function onlyOne(checkbox, e, group_id, props) {
            var checkboxes = document.getElementsByName('checkGroup')
            checkboxes.forEach((item) => {
                if (Number(item.id) !== group_id) item.checked = false
            })
            props.onChecked(e, group_id)
        }

        function mapDay(day) {
            if (day == 1){
                return 'ראשון'
            }
            if (day == 2){
                return 'שני'
            }
            if (day == 3){
                return 'שלישי'
            }
            if (day == 4){
                return 'רביעי'
            }
            if (day == 5){
                return 'חמישי'
            }
            if (day == 6){
                return 'שישי'
            }
        }


        let sub_inputs = []
        const group_id = this.props.group[0]['group_id']
        const lecturer = this.props.group[0]['lecturer']
        const is_exercise = this.props.group[0]['is_exercise']
        const checked = this.props.group[0]['checked']
        let index = 1
        this.props.group.forEach(option => {
            const day = option['day']
            const end_time = option['end_hour'] + ':' + option['end_min']
            const start_time = option['start_hour'] + ':' + option['start_min']
            sub_inputs.push(<li value={index}>{mapDay(day)} משעה {start_time} עד {end_time}</li>)
            index+=1;
        })
        return (
            <div>
                <>
                    <input 
                    type="checkbox" 
                    id={group_id} 
                    checked={checked} 
                    name="checkGroup" 
                    onChange={(e) => {
                        this.props.onChecked(e, group_id)
                        this.setState({renderDone: true})
                        }}/> 
                    {' '} קבוצה {group_id} {is_exercise === 0? 'שיעור': 'תירגול'}
                    <ol>
                      {sub_inputs}
                    </ol>
                </>
            </div>
        )
    }
}

//(e) => onlyOne(this, e, group_id, this.props)
export default Group




// import React, { Component } from 'react'

// export class Group extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {renderDone: true}
//     }

//     render() {
//          function onlyOne(checkbox, e, group_id, props) {
//             var checkboxes = document.getElementsByName('checkGroup')
//             checkboxes.forEach((item) => {
//                 if (Number(item.id) !== group_id) item.checked = false
//             })
//             props.onChecked(e, group_id)
//         }

//         function mapDay(day) {
//             if (day == 1){
//                 return 'ראשון'
//             }
//             if (day == 2){
//                 return 'שני'
//             }
//             if (day == 3){
//                 return 'שלישי'
//             }
//             if (day == 4){
//                 return 'רביעי'
//             }
//             if (day == 5){
//                 return 'חמישי'
//             }
//             if (day == 6){
//                 return 'שישי'
//             }
//         }


//         let sub_inputs = []
//         const group_id = this.props.group[0]['group_id']
//         const lecturer = this.props.group[0]['lecturer']
//         const is_exercise = this.props.group[0]['is_exercise']
//         const checked = this.props.group[0]['checked']
//         let index = 1
//         this.props.group.forEach(option => {
//             const day = option['day']
//             const end_time = option['end_hour'] + ':' + option['end_min']
//             const start_time = option['start_hour'] + ':' + option['start_min']
//             sub_inputs.push(<li value={index}>{mapDay(day)} משעה {start_time} עד {end_time}</li>)
//             index+=1;
//         })
//         return (
//             <div>
//                 <>
//                     <input 
//                     type="checkbox" 
//                     id={group_id} 
//                     checked={checked} 
//                     name="checkGroup" 
//                     onChange={(e) => {
//                         this.props.onChecked(e, group_id)
//                         this.setState({renderDone: true})
//                         }}/> 
//                     {' '} קבוצה {group_id} {is_exercise === 0? 'שיעור': 'תירגול'}
//                     {checked? " checked ":" not checked "}
//                     <ol>
//                       {sub_inputs}
//                     </ol>
//                 </>
//             </div>
//         )
//     }
// }

// //(e) => onlyOne(this, e, group_id, this.props)
// export default Group



