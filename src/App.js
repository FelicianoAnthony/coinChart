import React, { Component } from 'react';
import logo from './logo.svg';
import {Line} from 'react-chartjs-2';
import './App.css';
import axios from 'axios';
import moment from 'moment';

class App extends Component {

    constructor(props) {
    super(props);
    this.state = {
      coinlist: [{value: 0, label: "Loading..."}],
      currencylist: [{value: 0, label: "USD"}, {value: 0, label: "EUR"}],
      plotData:[],
      boolz: false,
      inputValue: "",
      dateRange:[]
     }
   }


  componentWillMount(){
    console.log('First this called');
    //this.getData()
  }




  getData = () =>  {

    // TAKE ARG FORMATTED LIKE '6 2' AND CHANGES IT TO '06 02' and returns array of previous 30 days depending on month 
    var prev30DaysArr =     
    function getDates (dateStr, currYear) {

      let monthsDict = {
      1: 31,
      2: 28, 
      3: 31,
      4: 30,
      5: 31,
      6: 30, 
      7: 31,
      8: 31,
      9: 30,
      10: 31, 
      11: 30,
      12: 31
    }


      let month = dateStr.split(' ')[0] * 1
      let prevMonth = month -1
      let currDay = dateStr.split(' ')[1] * 1



      // number of days in current month
      let daysInCurrMonth = monthsDict[month]
      //30

      // number of days to subtract from the end of the previous month 
      let daysToTake = daysInCurrMonth - currDay
        //5

      // number of days in previous month 
      let daysInPrevMonth = monthsDict[prevMonth]
      //31

       
      //most important -- what day in previous month to start at 
      let prevMonthStartDate = daysInPrevMonth - daysToTake
        //26

      //console.log(daysToTake, prevMonthStartDate, daysInPrevMonth, daysInCurrMonth)

      if (month.toString().length === 1 ){
        month = '0'+ month.toString()
      }

      //const prevMonth = ""
      if (prevMonth.toString().length === 1 ){
        prevMonth = '0'+ prevMonth.toString()
      }

        // this is an array of days from previous month starting in the middle 
      let prevMonthDaysArr = []
      for (var i=prevMonthStartDate; i < daysInPrevMonth; i++) {

        // to add 0 to singel digit #'s '
        const elem = i.toString()
        if (elem.length === 1) {
          const monthDate = `${currYear}.${prevMonth}.0${i}`
          prevMonthDaysArr.push(monthDate)
        }
        else {
          const monthDate = `${currYear}.${prevMonth}.${i}`
          prevMonthDaysArr.push(monthDate)
        }
      }

      let currMonthDaysArr = []
      for (var j=1; j <= currDay; j++) {
        const elem = j.toString()
        if (elem.length == 1) {
          let monthDate = `${currYear}.${month}.0${j}`
          currMonthDaysArr.push(monthDate)
        } else {
          let monthDate = `${currYear}.${month}.${j}`
          currMonthDaysArr.push(monthDate)
        }
      }

      let bothMonths = prevMonthDaysArr.concat(currMonthDaysArr)

      let finalArr = []; 

      for (var k=0; k < bothMonths.length-1; k++) {
        if (k %  2 !== 0 ){
          finalArr.push(bothMonths[k]) 
        }
      }

      return finalArr
    }


    let nowDate = new Date();
    let nowMonth = (nowDate.getMonth() + 1).toString()
    let nowDay = nowDate.getDate().toString()
    let nowYear = nowDate.getYear().toString()
    
    let queryDate = `${nowMonth} ${nowDay}`


    let unixFormat = prev30DaysArr(queryDate, '2018')
    console.log(unixFormat)
 




    let coin = this.state.inputValue
    let url = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + coin + '&tsyms=USD,EUR&ts='


    let labelsArr = []
    let pricesArr = []


    for (var i=0; i <= unixFormat.length-1; i++) {

      var arrElem = unixFormat[i]
      //console.log(arrElem, 'axis label')

      var dateElem = new Date(arrElem)
      

      var unixTimestamp = dateElem / 1000
      console.log(unixTimestamp)
      var api_url = url + unixTimestamp
      console.log(api_url)


        axios.get(api_url)
        .then(res => {
            var ob = res.data
            //timestampArr.push(ob)
            //var humanDate = moment(dateElem).format('L')
            pricesArr.push(ob[coin]['USD'])
            labelsArr.push(arrElem)
        })
      
    }

    //console.log('pricesarr ', pricesArr, '\ndateArr ', dateArr )
    

    let dataObj = { labels: unixFormat, 
                datasets: [
                  {
                    label: 'Price of ' + coin + ' from ' + new Date() + '  minus 30 days ago' ,
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: pricesArr
                          }
                        ]
                      }

   
    this.setState({plotData: dataObj, boolz:!this.state.boolz, dateRange: unixFormat})
  }

  handleChange = (e) => {
    this.setState({inputValue: e.target.value})
  }


  componentDidMount () {
    // this.getData()
  }

  render() {

    const data= this.state.plotData

    return (
      <div>
        <h2>{this.state.inputValue} Example</h2>
        <input value={this.state.inputValue} onChange={this.handleChange}/> 
        <button onClick={this.getData}> Generate Plot </button> 
        {!this.state.boolz ? null: <Line data={data} />}
      </div>
    );
  }
}

export default App;
