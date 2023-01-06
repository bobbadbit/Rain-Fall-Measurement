import React from 'react';
import MyTable from '../../components/Table/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultColumnFilter from '../../components/DefaultFilter';
import axios from 'axios';

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MjU4OTc5MTYsImlkIjoiNjE4MGVmZGJjOTVhMDAwMDNmMDAzNzE2IiwibmFtZSI6ImFkbWluIiwib3JpZ19pYXQiOjE2NjgyMTc5MTYsInVzZXJuYW1lIjoiYWRtaW4ifQ.qcohKNm2QpvEN0c2wUMmb5wA_1ChLPYje8PaKai6J0A';
const apiUrl = 'https://quantrac.xathongminh.vn/api/admin/water-monitorings?length=30';

axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const imageURL = [
  'https://vnn-imgs-f.vgcloud.vn/2018/12/11/14/ngap-lut-vietnamnet-2.jpg',
  'https://icdn.dantri.com.vn/thumb_w/1920/2022/10/15/huukhoa-23-of-23-1665767648090.jpg',
  'https://danviet.mediacdn.vn/296231569849192448/2022/10/15/df0a5f491a84ddda8495-1665801882969214241737-1665801962402396695827.jpeg',
  'https://static-images.vnncdn.net/files/publish/2022/10/15/ham-chui-5-268.jpg',
]
function Overview() {
  const [data, setData] = React.useState([]);
  const [image, setImage] = React.useState(imageURL[0]);
  React.useEffect(() => {
    let interval = setInterval(() => {
      getRainData();

      const randomIndex = Math.floor(Math.random() * 4);
      setImage(imageURL[randomIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  const getRainData = () => {
    axios
      .get(apiUrl, {})
      .then((res) => {
        var inSide = [];
        // console.log("full data here",res.data);
        let element = res.data.data.entries[0];
        let rainData = JSON.parse(element.objectJSON);
          var newItem = {
            id: 1,
            Dia_diem: 'Đại học Bách Khoa Đà Nẵng',
            Date: (element.created_at).substr(0,10),
            Theo_ngay: rainData.Rain,
            Theo_gio: rainData.Rain_OBS,
            Battery: rainData.BatV,
            Signal: element.rxInfo[0].rssi,
            Time: `${rainData.Hours}h ${rainData.Mins}m`,
            xem: 'Xem',
          };
          inSide = [...inSide, newItem];
          inSide = [...inSide, {
            id: 2,
            Dia_diem: 'FPT Complex',
            Date: (element.created_at).substr(0,10),
            Theo_ngay: 0,
            Theo_gio: 0,
            Battery: 0,
            Signal: 0,
            Time: `${rainData.Hours}h ${rainData.Mins}m`,
            xem: 'Xem',
          }]
          inSide = [...inSide, {
            id: 3,
            Dia_diem: 'Đại học Ngoại Ngữ Đà Nẵng',
            Date: (element.created_at).substr(0,10),
            Theo_ngay: 0,
            Theo_gio: 0,
            Battery: 0,
            Signal: 0,
            Time: `${rainData.Hours}h ${rainData.Mins}m`,
            xem: 'Xem',
          }]
        setData(inSide)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    {
      Header: 'STT',
      accessor: 'id',
      Filter: defaultColumnFilter,
    },
    {
      Header: 'Địa điểm',
      accessor: 'Dia_diem',
    },
    {
      Header: 'Ngày',
      accessor: 'Date',
      Filter: false,
    },
    {
      Header: 'Lượng mưa theo ngày (mm)',
      accessor: 'Theo_ngay',
      Filter: false,
    },
    {
      Header: 'Lượng mưa theo giờ (mm)',
      accessor: 'Theo_gio',
      Filter: false,
    },
    {
      Header: 'Thời gian cập nhật',
      accessor: 'Time',
      Filter: false,
    },
    {
      Header: 'Dung lượng pin (V)',
      accessor: 'Battery',
      Filter: false,
    },
    {
      Header: 'Cường độ tín hiệu (dBM)',
      accessor: 'Signal',
      Filter: false,
    },
    {
      Header: 'Chi tiết',
      accessor: 'xem',
      Filter: false,
    },
  ];

  return(
    <div>
      
      <div style={{
        height: 250,
        color: 'white',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:`url(${image})`,
      }}>
        
      </div>
      <h1 style={{
        textAlign: 'center',
        //fontWeight: 'bold',
        height: 70,
        fontSize: 50,
        marginTop: 30,
    
      }}> HỆ THỐNG THEO DÕI LƯỢNG MƯA VÀ CẢNH BÁO NGẬP LỤT 
        
      </h1>
      <div className="rt-table">
				<MyTable columns={columns} data={data} />
			</div>
    </div>
  )
}

export default Overview;