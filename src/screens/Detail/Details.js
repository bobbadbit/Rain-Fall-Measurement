/** @format */
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import * as React from 'react';
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import MyDetailTable from "../../components/Table/DetailTable";
import {tableData2 ,fakedata,fakedata2} from '../../utils/Constants';
import axios from 'axios';
import {sum} from 'd3-array'

const TimeType = {
  month: 0,
  day: 1,
  hour: 2,
};
const TimeType2 ={
  month: 0,
  hour:1,
  week:2
}
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MjU4OTc5MTYsImlkIjoiNjE4MGVmZGJjOTVhMDAwMDNmMDAzNzE2IiwibmFtZSI6ImFkbWluIiwib3JpZ19pYXQiOjE2NjgyMTc5MTYsInVzZXJuYW1lIjoiYWRtaW4ifQ.qcohKNm2QpvEN0c2wUMmb5wA_1ChLPYje8PaKai6J0A';
const apiUrl = 'https://quantrac.xathongminh.vn/api/admin/water-monitorings?length=30';
const apiUrl2 = 'https://be-datn.vercel.app/allData';
const apiUrl3 = 'https://be-datn.vercel.app';




axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Chart.register(...registerables);

  
function Details() {

/* Define default value for dropdown menu of CHART, TABLE, MONTH'S TABLE, YEAR'S TABLE */
  const [dropDownValue, setDropDownValue] = React.useState(
    (new Date().getMonth() + 1).toString()
  )
  const [dropDownValueYear, setDropDownValueYear] = React.useState(
    (new Date().getFullYear()).toString()
  )
  const [dropDownValueYear2, setDropDownValueYear2] = React.useState(
    (new Date().getFullYear()).toString()
  )
  const [dropDownValueChart, setDropDownValueChart] = React.useState(
    "Biểu đồ lượng mưa theo giờ"
  )
  const [dropDownValueTable, setDropDownValueTable] = React.useState(
    "Bảng lượng mưa theo tháng"
  )

/* Define option for user's choosing of CHART, TABLE, MONTH'S TABLE, YEAR'S TABLE dropdown menu */
  const optionsfordropdown = [
    "1","2","3","4","5","6","7","8","9","10","11", "12",
  ];
  const optionsforYearDropDown = [
    "2022","2023","2024"
  ]
  const optionforChartDropDown = [
    "Biểu đồ lượng mưa theo giờ", "Biểu đồ lượng mưa theo tháng", "Biểu đồ lượng mưa theo ngày"
  ]
  const optionforTableDropDown = [
    "Bảng lượng mưa theo tháng", "Bảng lượng mưa theo ngày", "Bảng lượng mưa theo giờ"
  ]

  /* Set what will happen when user choose an option */
  function _onSelect(item) {
    setDropDownValue(item.label);
  }
  function _onSelectYear(item) {
    setDropDownValueYear(item.label);
  }
  function _onSelectYear2(item) {
    setDropDownValueYear2(item.label);
  }
  function _onSelectChart(item) {
    switch(item.label){
      case "Biểu đồ lượng mưa theo tháng":
        setSwitchChart(TimeType2.month);
        break;
      case "Biểu đồ lượng mưa theo giờ":
        setSwitchChart(TimeType2.hour);
        break;  
      case "Biểu đồ lượng mưa theo ngày":
        setSwitchChart(TimeType2.week);
        break;
    }
  }
  function _onSelectTable(item) {
    // console.log("item",item)
    switch(item.label){
      case "Bảng lượng mưa theo tháng":
        setSwitchTable(TimeType.month);
        break;
      case "Bảng lượng mưa theo ngày":
        setSwitchTable(TimeType.day);
        break;
      case "Bảng lượng mưa theo giờ":
        setSwitchTable(TimeType.hour);
        break;
    }
  }

  /* Define default value for Table, Chart (fake data) */
  const [rainPoint, setRainPoint] = React.useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: "FPT",
        borderColor: "#3e95cd",
        fill: false,
      },
    ],
  });
  const [averageDayRain, setAverageDayRain] = React.useState(tableData2)
  const [rainDataTable, setRainDataTable] = React.useState([]);
  const [SwitchTable, setSwitchTable] = React.useState(0);
  const [SwitchChart, setSwitchChart] = React.useState(1);
  const [monthTable, setMonthTable] = React.useState(fakedata);
  const [serverData, setServerData] = React.useState([]);
  const [dayTable, setDaytable] = React.useState(fakedata2);
  const [monthChart, setMonthChart] = React.useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        label: "Đại học Bách Khoa Đà Nẵng",
        borderColor: "#3e95cd",
        fill: false,
      },
    ],
  })
  const [weekChart, setWeekChart] = React.useState({
    labels: ['-', '-', '-', '-', '-', '-', '-'],
    datasets: [
      {
        data: ['-', '-', '-', '-', '-', '-', '-'],
        label: "Tổng lượng mưa mỗi ngày",
        borderColor: "#3e95cd",
        fill: false,
      },
    ],
  })

  /* function convert number of character in JSON return file */
  const convertDay = (day) => {
    if(parseInt(day)<10)
    {
      return `0${day}`
    }
    return day;
  }

  /* Fetch data from APIs */
  const handleFetchServerData = () => {
    var currentMonth = dropDownValue;
    const preMonthTableData = monthTable;

    serverData.forEach((item) => {
    
      for(var i = 0; i < preMonthTableData.length; i++) {
        if (preMonthTableData[i].date === convertDay(item.Day) && currentMonth === item.Month)
        {
          preMonthTableData[i][item.Hour] = item.RainHour;
          //console.log("ngay 2",item)
        }
      }
    })
    setMonthTable(preMonthTableData);
  }
  const handleFetchServerData2 = () => {
    const preDayTableData = dayTable;
    var today = new Date();
  
    serverData.forEach((item) => {
        if (today.getDate().toString() === item.Day)
        {
          preDayTableData[0][item.Hour] = item.RainHour;
        }
    })
    preDayTableData[0].dateAndTime = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
    setDaytable(preDayTableData);
  }
  const fetchSumaryData = async () => {
    try {
        const fullData = `${apiUrl3}/Max${dropDownValueYear2}`
        const response = await axios.get(fullData);
        initRainData(response)
    }catch (error) {
        console.log(error)
    }
  };
  const fetchData = async () => {
    try {
        const fullData = `${apiUrl2}${dropDownValueYear}`
        const response = await axios.get(fullData);
        setServerData(response.data)
    }catch (error) {
        console.log(error)
    }
  };

  /* Refresh data (call url again) when timeout reach or an option from dropdown menu is chosen */  
  React.useEffect(() => {
    if(SwitchTable === TimeType.month)
    {
      handleFetchServerData();
    }
    else{
      handleFetchServerData2();
    }
  }, [serverData, dropDownValue]);
  React.useEffect(() => {
    let interval = setInterval(() => {
      getChartData();
      fetchData();
      fetchSumaryData();
      calculateWeekRain();
    }, 3000);
    return () => clearInterval(interval);
  }, [dropDownValueYear2, rainPoint]);
  
  React.useEffect(() => {
    const monthValue = parseInt(dropDownValue);
    // console.log("month",monthValue);
    var initMonthTable = []
    var endMonthDay = 0;
    switch(monthValue)
    {
      case 1:
        endMonthDay = 31;
        break;
      case 3:
        endMonthDay = 31;
        break;
      case 5:
        endMonthDay = 31;
        break;
      case 7:
        endMonthDay = 31;
        break;
      case 8:
        endMonthDay = 31;
        break;
      case 10:
        endMonthDay = 31;
        break;
      case 12:
        endMonthDay = 31;
        break;
      case 2:
        endMonthDay = 29;
        break;
      default:
        endMonthDay = 30;
        break;
    }
    for ( var i = 1; i <= endMonthDay;i++)
    {
      initMonthTable = [...initMonthTable, {
        date: i<10?`0${i}`:`${i}`,
        0: "-",
        1: "-",
        2: "-",
        3:"-",
        4:"-",
        5:"-",
        6:"-",
        7:"-",
        8:"-",
        9:"-",
        10:"-",
        11:"-",
        12:"-",
        13:"-",
        14:"-",
        15:"-",
        16:"-",
        17:"-",
        18:"-",
        19:"-",
        20:"-",
        21:"-",
        22:"-",
        23:"-",
      },]
    }
    setMonthTable(initMonthTable);
  }, [dropDownValueYear, dropDownValue]);

  /* EXTRA FUNCTION for more detail works */
  function processRainTable (res) {
    var inSide = [];
        // console.log("full data here",res.data.data.length);
        res.data.data.entries.forEach((element) => {
        if(element.objectJSON !== "")
        {
        let rainData = JSON.parse(element.objectJSON);
          var newItem = {
            dateAndTime: element.created_at,
            from0to2: rainData.Rain,
            from2to4: rainData.Rain_OBS,
            from4to6: `${rainData.Hours}h${rainData.Mins}m`
          };
          inSide = [...inSide, newItem];
          setRainDataTable(inSide)
        }
        })  
  }
  function initRainData (res) {
    var arrMonth = {
      "1" : {},
      "2" : {},
      "3" : {},
      "4" : {},
      "5" : {},
      "6" : {},
      "7" : {},
      "8" : {},
      "9" : {},
      "10" : {},
      "11" : {},
      "12" : {},
    };
    var endofMonth = 0
    
    for(var i = 1; i<13; i++)
    {
      endofMonth = getEndOfMonth(i);
      for(var j = 1; j <= endofMonth; j++)
      {
        arrMonth[`${i}`][`${j}`] = 0;
      }
    }
    res.data.forEach((item) =>{

        if(item.RainEachHour !== null){
          arrMonth[item._id.month][item._id.day] += parseInt(item.RainEachHour)
        }
    })
    calCulateRainDay(arrMonth);
    // console.log("arr",arrMonth)
  
  }
  function getEndOfMonth (index){
    var endofMonth = 0;
    switch (index){
      case 1,3,5,7,8,10,12:
        endofMonth = 31;
        break;
      case 2:
        endofMonth = 28;
        break;
      default:
        endofMonth = 30;
        break;
    }
    return (endofMonth)
  }
  function calCulateRainDay (arrMonth)
  {
    var monthAveragePoint = [];
    var preAverageDayRain = averageDayRain;

    for (var i = 0 ; i<12;i++)
    {
      var index = i+1;
      if(arrMonth[`${index}`] !== undefined)
      {
        var totalRainData = Object.values(arrMonth[`${index}`])
        preAverageDayRain[i].mostRainDay = Math.max(...totalRainData)
        preAverageDayRain[i].leastRainDay = Math.min(...totalRainData)
        preAverageDayRain[i].averageRainInYear = Math.round(sum(totalRainData)/getEndOfMonth(index) * 100 + Number.EPSILON) / 100;
        monthAveragePoint = [...monthAveragePoint,sum(totalRainData)/getEndOfMonth(index)];
      }
    }
    monthChart.datasets[0].data = monthAveragePoint
    calculateWeekRain(arrMonth);
    setMonthChart(monthChart);
    setAverageDayRain(preAverageDayRain);
    console.log("month chart",monthChart);
  }

  function calculateWeekRain (arrMonth){
    var newItem = {
      labels: [],
      datasets: [
      {
        data: [],
        label: "Tổng lượng mưa mỗi ngày",
        borderColor: "#3e95cd",
        fill: false,
      },
    ],
    };
    let testWeekData = new Date().getDate();
    // console.log("presentday",testWeekData);
    let testMonthData = new Date().getMonth() + 1;
    // console.log("presentmonth",testMonthData);

    var totalRainData = Object.values(arrMonth[testMonthData]);
    // console.log("presentmonth2",totalRainData);
    for (var i = 6; i >= 0;i--)
    {
      newItem.datasets[0].data = [...newItem.datasets[0].data, totalRainData[testWeekData-i]]
      newItem.labels = [...newItem.labels, testWeekData-i+1]
    }
    // console.log("hehhe",newItem);
    setWeekChart(newItem);
}

  function processRainChart (res) {
    var newItem = {
      labels: [],
      datasets: [
        {
          data: [],
          label: "Đại học Bách Khoa Đà Nẵng",
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    };
    for(let i = (res.data.data.entries.length)-1; i >= 0; i--)
    {
      if(res.data.data.entries[i].objectJSON !== ""){
        let rainData = JSON.parse( res.data.data.entries[i].objectJSON);

        newItem.labels = [...newItem.labels, `${rainData.Hours}h ${rainData.Mins}m`];
        newItem.datasets[0].data = [...newItem.datasets[0].data, rainData.Rain_OBS];
    }
    setRainPoint(newItem);
  }}
  const getChartData = () => {
    axios
      .get(apiUrl, {})
      .then((res) => {
        processRainChart(res);
        processRainTable(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /* History MONTH table design */
  const rainMonthTable = [
    {
      Header: 'Ngày / giờ',
      accessor: 'date',
      Filter: false,
    },
    {
      Header: '0',
      accessor: '0',
      Filter: false,
    },
    {
      Header: '1',
      accessor: '1',
      Filter: false,
    },
    {
      Header: '2',
      accessor: '2',
      Filter: false,
    },
    {
      Header: '3',
      accessor: '3',
      Filter: false,
    },
    {
      Header: '4',
      accessor: '4',
      Filter: false,
    },
    {
      Header: '5',
      accessor: '5',
      Filter: false,
    },
    {
      Header: '6',
      accessor: '6',
      Filter: false,
    },
    {
      Header: '7',
      accessor: '7',
      Filter: false,
    },
    {
      Header: '8',
      accessor: '8',
      Filter: false,
    },
    {
      Header: '9',
      accessor: '9',
      Filter: false,
    },
    {
      Header: '10',
      accessor: '10',
      Filter: false,
    },
    {
      Header: '11',
      accessor: '11',
      Filter: false,
    },
    {
      Header: '12',
      accessor: '12',
      Filter: false,
    },
    {
      Header: '13',
      accessor: '13',
      Filter: false,
    },
    {
      Header: '14',
      accessor: '14',
      Filter: false,
    },
    {
      Header: '15',
      accessor: '15',
      Filter: false,
    },
    {
      Header: '16',
      accessor: '16',
      Filter: false,
    },
    {
      Header: '17',
      accessor: '17',
      Filter: false,
    },
    {
      Header: '18',
      accessor: '18',
      Filter: false,
    },
    {
      Header: '19',
      accessor: '19',
      Filter: false,
    },
    {
      Header: '20',
      accessor: '20',
      Filter: false,
    },
    {
      Header: '21',
      accessor: '21',
      Filter: false,
    },
    {
      Header: '22',
      accessor: '22',
      Filter: false,
    },
    {
      Header: '23',
      accessor: '23',
      Filter: false,
    },
  ]

  /* History DAY table design */
  const rainDayTable = [
    {
      Header: 'Ngày / giờ',
      accessor: 'dateAndTime',
      Filter: false,
    },
    {
      Header: '0',
      accessor: '0',
      Filter: false,
    },
    {
      Header: '1',
      accessor: '1',
      Filter: false,
    },
    {
      Header: '2',
      accessor: '2',
      Filter: false,
    },
    {
      Header: '3',
      accessor: '3',
      Filter: false,
    },
    {
      Header: '4',
      accessor: '4',
      Filter: false,
    },
    {
      Header: '5',
      accessor: '5',
      Filter: false,
    },
    {
      Header: '6',
      accessor: '6',
      Filter: false,
    },
    {
      Header: '7',
      accessor: '7',
      Filter: false,
    },
    {
      Header: '8',
      accessor: '8',
      Filter: false,
    },
    {
      Header: '9',
      accessor: '9',
      Filter: false,
    },
    {
      Header: '10',
      accessor: '10',
      Filter: false,
    },
    {
      Header: '11',
      accessor: '11',
      Filter: false,
    },
    {
      Header: '12',
      accessor: '12',
      Filter: false,
    },
    {
      Header: '13',
      accessor: '13',
      Filter: false,
    },
    {
      Header: '14',
      accessor: '14',
      Filter: false,
    },
    {
      Header: '15',
      accessor: '15',
      Filter: false,
    },
    {
      Header: '16',
      accessor: '16',
      Filter: false,
    },
    {
      Header: '17',
      accessor: '17',
      Filter: false,
    },
    {
      Header: '18',
      accessor: '18',
      Filter: false,
    },
    {
      Header: '19',
      accessor: '19',
      Filter: false,
    },
    {
      Header: '20',
      accessor: '20',
      Filter: false,
    },
    {
      Header: '21',
      accessor: '21',
      Filter: false,
    },
    {
      Header: '22',
      accessor: '22',
      Filter: false,
    },
    {
      Header: '23',
      accessor: '23',
      Filter: false,
    },
    {
      Header: '24',
      accessor: '24',
      Filter: false,
    },
  ]

  /* History YEAR table design */
	const yearStatisticsCol = [
		{
      Header: 'Ngày',
      accessor: 'dateAndTime',
			Filter: false,
    },
		{
      Header: 'Lượng mưa theo ngày',
      accessor: 'from0to2',
			Filter: false,
    },
		{
      Header: 'Lượng mưa theo giờ',
      accessor: 'from2to4',
			Filter: false,
    },
		{
      Header: 'Thời gian cập nhật',
      accessor: 'from4to6',
			Filter: false,
    },
	]

  /* SUMARY table */
	const weekStatisticsCol = [
		{
      Header: 'Tháng',
      accessor: 'month',
      Filter: false,
    },
    {
      Header: 'Lượng mưa nhiều nhất trong tháng (mm)',
      accessor: 'mostRainDay',
      Filter: false,
    },
    {
      Header: 'Lượng mưa ít nhất trong tháng (mm)',
      accessor: 'leastRainDay',
      Filter: false,
    },
    {
      Header: 'Trung bình lượng mưa trong tháng (mm)',
      accessor: 'averageRainInYear',
      Filter: false,
    }
	]

  /* options for chart */
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Đồ thị lượng mưa theo giờ',
      },
    },
  };
  const optionForMonthChart = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Đồ thị lượng mưa theo tháng',
      },
    },
  };

  /* options for table */

  return (
    <div style={{
      textAlign: 'center',
      margin: 40,
      marginTop: 50,
    }}>
      <h1 id='title'>Bảng thống kê sơ bộ lượng mưa các tháng trong năm </h1>
			<div style={{
        display: 'flex',
        flexDirection: 'column',        
        alignItems: 'flex-start',
        }}>
        
        <p style={{
          marginRight: 200,
          marginLeft: 0,
          margin: 0,
        }}>Chọn năm hiển thị:</p>  
        <div style={{
          margin: 20,
          marginLeft: 0,
        }}>
          <Dropdown options={optionsforYearDropDown} onChange={_onSelectYear2} value={dropDownValueYear2} placeholder="Biểu đồ lượng mưa theo giờ"/>
        </div>
				<MyDetailTable columns={weekStatisticsCol} data={ averageDayRain } />
			</div>
      <div style={{
        marginTop: 50,
      }}>
        
      
      <h1 id='title'>Đồ thị biểu diễn tình hình lượng mưa </h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',        
        alignItems: 'flex-start',
        }}>
 
        <p style={{
          marginRight: 200,
          marginLeft: 155,
        }}>Chọn biểu đồ hiển thị:</p>  
        <div style={{
          marginLeft: 155,
        }}>
          <Dropdown options={optionforChartDropDown} onChange={_onSelectChart} value={dropDownValueChart} placeholder="Biểu đồ lượng mưa theo giờ"/>
        </div>
      </div>
      </div>
      {SwitchChart === TimeType2.month && 
      (      
      <div className="line-wrapper2">
        {/* <div style={{
            display: 'flex',
            flexDirection: 'column',        
            alignItems: 'flex-start',
          }}>
          <p style={{
          
            margin: 20,
          }}>Chọn năm hiển thị:</p>  
          <Dropdown options={optionsforYearDropDown} onChange={_onSelectYear2} value={dropDownValueYear2}/>
          
        </div> */}
        <Line
          height={100}
          width={200}
          data={monthChart}
          options={optionForMonthChart}
        />
      </div>)}
      {SwitchChart === TimeType2.hour &&
        (
          <div className="line-wrapper2">
            <Line  
              data={rainPoint}
              options={options}
            /> 
          </div>
        )
      }
      {SwitchChart === TimeType2.week &&
        (
          <div className="line-wrapper2">
            <Bar
            data={weekChart}
            /> 
          </div>  
        )
      }

      <div style={{
        marginTop: 50,
      }}>
        <h1 id='title'>Bảng theo dõi lượng mưa</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',        
      }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',        
        alignItems: 'flex-start',
        }}>
        
        <p>Chọn bảng hiển thị:</p>
        <Dropdown options={optionforTableDropDown} onChange={_onSelectTable} value={dropDownValueTable} placeholder="Bảng lượng mưa theo giờ" />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',        
        alignItems: 'flex-start',
        marginLeft: 30,
        }}>

        <p>Chọn năm hiển thị:</p>
        <div style={{
          width: 250
        }}>
        <Dropdown options={optionsforYearDropDown} onChange={_onSelectYear} value={dropDownValueYear} placeholder="2022" />
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',        
        alignItems: 'flex-start',
        marginLeft: 30,
        }}>
        <p>Chọn tháng hiển thị:</p>
        <div style={{
          width: 250
        }}>
        <Dropdown options={optionsfordropdown} onChange={_onSelect} value={dropDownValue} placeholder="Chọn tháng hiển thị" />
        </div>
      </div>
        
      </div>
      {SwitchTable === TimeType.month && 
      (<div style={{
        display: 'flex',
        flexDirection: 'column',        
        alignItems: 'flex-start',
        marginTop: 30,
        }}>

        
        
        <MyDetailTable columns={rainMonthTable} data={monthTable}/>

      </div>)}
      
      {SwitchTable === TimeType.day &&
        (
          <div>
            <MyDetailTable columns={rainDayTable} data={dayTable}/>
          </div>
        )
      }
      {SwitchTable === TimeType.hour &&
      (
        <div className="rt-table">
				  <MyDetailTable columns={yearStatisticsCol} data={ rainDataTable } />
			  </div>
      )}
    </div>
    </div>

  );
}

export default Details;