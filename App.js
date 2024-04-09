import './App.css';
import React, {useState, useEffect} from 'react';

function getSleepBackColor(time){
   let hour=time.substr(0,time.indexOf(":",0));
   let hourNum=Number(hour);
   var ret="";
   if(9<=hourNum){
     ret="goju";
   }else if(8===hourNum){
     ret="yonju";
   }else if(7===hourNum){
     ret="sanju";
   }else if(6===hourNum){
     ret="niju";
   }else if(1<=hourNum&&hourNum<=5){
     ret="ju";
   }else if(0===hourNum){
     ret="aka";
   }
   if(time===""){
     ret="white";
   }
   return ret;
}

function getDeepSleepBackColor(time){
   let hour=time.substr(0,time.indexOf(":",0));
   let hourNum=Number(hour);
   var ret="";
   if(3<=hourNum){
     ret="goju";
   }else if(2===hourNum){
     ret="yonju";
   }else if(1===hourNum){
     ret="sanju";
   }else if(0===hourNum){
     ret="aka";
   }
   if(time===""){
     ret="white";
   }
   return ret;
}

function getWakeBackColor(time){
  var ret="";
  if(time<0){
    ret="aka";
  }else{
    ret="white";
  }
  return ret;
}
function getSleeptoMin(time){
  let hour=time.substr(0,time.indexOf(":",0));
  let hourNum=Number(hour);
  let min=time.substr(3,2); 
  let minNum=Number(min);
  return hourNum*60+minNum;
}

function getSleeptoHour(time){
  let hourNum=Math.floor(time/60);
  var hour=String(hourNum);
  if(hourNum<10){
    hour="0"+hour;
  }
  let minNum=time%60;
  var min=String(minNum);
  if(minNum<10){
    min="0"+min;
  } 
  return hour+":"+min+":00";
}

function getSumSleepColor(time){
  var ret="";
  let hourNum=Math.floor(time/60);
  if(hourNum<50){
    // 背景は白
  }else if(50<=hourNum&&hourNum<100){
    ret="ju";
  }else if(100<=hourNum&&hourNum<150){
    ret="niju";
  }else if(150<=hourNum&&hourNum<200){
    ret="sanju";
  }else if(200<=hourNum&&hourNum<248){
    ret="yonju";
  }else if(248<=hourNum){
    ret="goju";
  }
  return ret;
}

function getSumDeepSleepColor(time){
  var ret="";
  let hourNum=Math.floor(time/60);
  if(hourNum<18){
    // 背景は白
  }else if(18<=hourNum&&hourNum<36){
    ret="ju";
  }else if(36<=hourNum&&hourNum<54){
    ret="niju";
  }else if(54<=hourNum&&hourNum<72){
    ret="sanju";
  }else if(72<=hourNum&&hourNum<90){
    ret="yonju";
  }else if(90<=hourNum){
    ret="goju";
  }
  return ret;
}

function App() {
    //const data = 
    //  [
    //      {
    //      date: '2023-10-01',
    //      wake: 52,
    //      bath: 0,
    //      bed: -50,
    //      sleep_in: '-',
    //      sleep: '07:45:00',
    //      deep_sleep: '03:21:00',
    //      },
    //      {
    //      date: '2023-10-02',
    //      wake: -276,
    //      bath: 0,
    //      bed: -9,
    //      sleep_in: '12min16s',
    //      sleep: '03:41:00',
    //      deep_sleep: '00:41:00',
    //      },
    //      {
    //      date: '2023-10-03',
    //      wake: 430,
    //      bath: 0,
    //      bed: -94,
    //      sleep_in: '13min33s',
    //      sleep: '10:54:00',
    //      deep_sleep: '01:33:00',
    //      },
    //      {
    //      date: '2023-10-04',
    //      wake: 0,
    //      bath: 0,
    //      bed: 0,
    //      sleep_in: '',
    //      sleep: '',
    //      deep_sleep: '',
    //      },
    //  ];

  // TODO : パラメーター未指定で今月表示に変更する。

  const [data, setGets]=useState([]);

  let urlParam = window.location.search.substring(1);
  console.log(urlParam);
  let month=urlParam.split('=');
  console.log(month);
  //let params={};
  //params.month=month
  //let params={month: '202310'};
  let params={month: ''};
  params.month=month[1];
  console.log(params);
  let query=new URLSearchParams(params);
  console.log(query);

  useEffect(() => {
    // other code
    if(!urlParam){
      fetch('/sleep',{method:'GET'})
      .then(res=>res.json())
      .then(data=>{
        setGets(data)
      })
    }else{
      fetch('/sleep?'+query,{method:'GET'})
      .then(res=>res.json())
      .then(data=>{
        setGets(data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleChangeNumber = (event) => {
    let wakeBedClassName=getWakeBackColor(event.target.value);
    event.target.className=wakeBedClassName;
  };
  const handleChangeSleepTime = (event) => {
    let time=event.target.value;
    if(0<time.indexOf(":",0)){
      let sleepTimeClassName=getSleepBackColor(time);
      event.target.className=sleepTimeClassName;
    }else{
      // 空欄化や入力途中や入力抜けは背景色を白にする。
      event.target.className="white";
    }
  };
  const handleChangeDeepSleepTime = (event) => {
    let time=event.target.value;
    if(0<time.indexOf(":",0)){
      let deepSleepTimeClassName=getDeepSleepBackColor(time);
      event.target.className=deepSleepTimeClassName;
    }else{
      // 空欄化や入力途中や入力抜けは背景色を白にする。
      event.target.className="white";
    }
  };
  const HandleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    var counter=0;
    var sleep_sum=0;
    var deep_sleep_sum=0;
    var data=[];
    var sleep={
      date: '',
      wake: 0,
      bath: 0,
      bed: 0,
      sleep_in: '',
      sleep: '',
      deep_sleep: '',
      description: ''
    };
    form.forEach(function(value,key){
      switch(counter){
        case 0:
          sleep={
            date: '',
            wake: 0,
            bath: 0,
            bed: 0,
            sleep_in: '',
            sleep: '',
            deep_sleep: '',
            description: ''
          };
          sleep.date=value;
          break;
        case 1:
          sleep.wake=value;
          break;
        case 2:
          sleep.bath=value;
          break;
        case 3:
          sleep.bed=value;
          break;
        case 4:
          sleep.sleep_in=value;
          break;
        case 5:
          sleep.sleep=value;
          sleep_sum+=getSleeptoMin(value);
          break;
        case 6:
          sleep.deep_sleep=value;
          deep_sleep_sum+=getSleeptoMin(value);
          break;
        case 7:
          sleep.description=value;
          data.push(sleep);
          counter=-1;
          break;
        default:
          break;
      };
      counter=counter+1;
      //console.log(key);
      //console.log(value);
    });
    
    // 合計を反映します。
    console.log(document.getElementById("sleep_sum"));
    console.log(document.getElementById("sleep_sum_box"));
    console.log(sleep_sum);
    console.log(deep_sleep_sum);
    document.getElementById("sleep_sum").textContent=getSleeptoHour(sleep_sum);
    document.getElementById("deep_sleep_sum").textContent=getSleeptoHour(deep_sleep_sum);
    document.getElementById("sleep_sum").className=getSumSleepColor(sleep_sum);
    document.getElementById("sleep_sum_box").className=getSumSleepColor(sleep_sum);
    document.getElementById("deep_sleep_sum").className=getSumDeepSleepColor(deep_sleep_sum);
    document.getElementById("deep_sleep_sum_box").className=getSumDeepSleepColor(deep_sleep_sum);
    //const test = 
    //  [
    //      {
    //      date: '2023-10-01',
    //      wake: 52,
    //      bath: 0,
    //      bed: -50,
    //      sleep_in: '-',
    //      sleep: '07:45:00',
    //      deep_sleep: '03:21:00',
    //      },
    //  ];
    //console.log(data);
    //console.log(test);
    //console.log(data);
    //console.log(JSON.stringify(data));
    const post_options={
      method: "POST",
      headers: {"ContentType": "application/json"},
      body: JSON.stringify(data)
    };
    // TODO : エラー処理を書きます。
    fetch('/sleep',post_options);
    //  .then(res=>res.json())
    //  .then(data=>{
    //  setGets(data)
    //  });
  };
  var sleep_sum=0;
  var deep_sleep_sum=0;
  data.map((row) => (
    (() => {
      row.wakeClassName=getWakeBackColor(row.wake);
      row.bathClassName=getWakeBackColor(row.bath);
      row.bedClassName=getWakeBackColor(row.bed);
      row.sleepClassName=getSleepBackColor(row.sleep);
      row.deepSleepClassName=getDeepSleepBackColor(row.deep_sleep);
      sleep_sum+=getSleeptoMin(row.sleep);
      deep_sleep_sum+=getSleeptoMin(row.deep_sleep);
    })()
  ));
  console.log(sleep_sum);
  console.log(deep_sleep_sum);
  console.log(getSleeptoHour(sleep_sum));
  console.log(getSleeptoHour(deep_sleep_sum));
  return (
    <form onSubmit={(e) => HandleSubmit(e)}>
    <div className="flex">
      <div className="submitbutton"><input type="submit" value="保存" /></div>
      <div id="sleep_sum_box" className={getSumSleepColor(sleep_sum)}><div id="sleep_sum_div" className="sleep_sum"><label id="sleep_sum" className={getSumSleepColor(sleep_sum)}>{getSleeptoHour(sleep_sum)}</label></div></div>
      <div id="deep_sleep_sum_box" className={getSumDeepSleepColor(deep_sleep_sum)}> <div id="deep_sleep_sum_div" className="deep_sleep_sum"><label id="deep_sleep_sum" className={getSumDeepSleepColor(deep_sleep_sum)}>{getSleeptoHour(deep_sleep_sum)}</label></div></div>
    </div>
    <table border='1'>
      <thead>
        <tr>
          <th>日付</th>
          <th>起床</th>
          <th>入浴</th>
          <th>就寝</th>
          <th>睡眠 入眠潜時</th>
          <th>睡眠 睡眠時間</th>
          <th>睡眠 深い眠り</th>
          <th>補足</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr key={row.id}>
              <td><input type='text' size="10" defaultValue={row.date} name="date" readOnly /></td>
              <td><input type='text' onChange={(e) => handleChangeNumber(e)} size="4" className={row.wakeClassName} defaultValue={row.wake} name="wake" /></td>
              <td><input type='text' onChange={(e) => handleChangeNumber(e)} size="4" className={row.bathClassName} defaultValue={row.bath} name="bath" /></td>
              <td><input type='text' onChange={(e) => handleChangeNumber(e)} size="4" className={row.bedClassName} defaultValue={row.bed} name="bed" /></td>
              <td><input type='text' size="10" defaultValue={row.sleep_in} name="sleep_in" /></td>
              <td><input type='text' onChange={(e) => handleChangeSleepTime(e)} size="12" className={row.sleepClassName} defaultValue={row.sleep} name="sleep" /></td>
              <td><input type='text' onChange={(e) => handleChangeDeepSleepTime(e)} size="12" className={row.deepSleepClassName} defaultValue={row.deep_sleep} name="deep_sleep" /></td>
              <td><input type='text' defaultValue={row.description} name="description" /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </form>
  );
}

export default App;
