import './App.css';
import {useState, useEffect} from 'react';
import {
    getSleepBackColor,
    getDeepSleepBackColor,
    getWakeBackColor,
    changeSleeptoMin,
    changeMintoSleep,
    getSumSleepColor,
    getSumDeepSleepColor,
    getNextMonth,
    getPreMonth,
    makePostData,
    PostData,
    Sleep
} from "./SleepUtil";

function App() {

  const [data, setGets]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  let urlParam = window.location.search.substring(1);
  let month=urlParam.split('=');
  let params={month: ''};
  params.month=month[1];
  let query=new URLSearchParams(params);
  const preMonth=getPreMonth(month[1]);
  const nextMonth=getNextMonth(month[1]);

  // 睡眠一覧を取得する。
  useEffect(() => {
    const fetchData=async()=>{
      try{
        if(!urlParam){
          const response=await fetch(`${import.meta.env.VITE_BASE_URL}/sleep`,{method:'GET'});
          if(!response.ok){
            throw new Error(`HTTP error! status : ${response.status} + ${response.message}`);
          }
          const result=await response.json();
          setGets(result);
        }else{
          const response=await fetch(`${import.meta.env.VITE_BASE_URL}/sleep?`+query,{method:'GET'});
          if(!response.ok){
            const errorData=await response.json();
            throw new Error(`HTTP error! status : ${response.status}` + ` ${errorData.message}`);
          }
          const result=await response.json();
          setGets(result);
        };
      }catch(err){
        setError(err.message);
      }finally{
        setLoading(false);
      }     
    };
    fetchData();
    // eslint-disable-next-line
  },[]);

  if(loading){
    return(<p>読込中...</p>);
  }
  if(error){
    return(<p>エラー:{error}</p>);
  }

  // 入力されたデータに対して背景色を設定する。
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
    setLoading(true);
    setError(null);
    let time=event.target.value;
    if(0<time.indexOf(":",0)){
      let deepSleepTimeClassName=getDeepSleepBackColor(time);
      event.target.className=deepSleepTimeClassName;
    }else{
      // 空欄化や入力途中や入力抜けは背景色を白にする。
      event.target.className="white";
    }
  };

  // 起床ボタンが押下された場合のハンドラー。
  const handleWake = (event) => {
    const now = new Date();
    const year = now.getFullYear();
    const month_tmp = now.getMonth()+1;
    const day_tmp = now.getDate();
    const hour_tmp = now.getHours();
    const minute_tmp = now.getMinutes();
    const month = month_tmp.toString().padStart(2,"0");
    const day = day_tmp.toString().padStart(2,"0");
    const hour = hour_tmp.toString().padStart(2,"0");
    const minute = minute_tmp.toString().padStart(2,"0");
    const time = `${year}-${month}-${day}T${hour}:${minute}:00:00`;
    var wakeTime={
      wakeTime: '',
    };
    wakeTime.wakeTime=time;
    // バックエンドに起床を送信する。
    const postProc=async()=>{
      try{
        const post_options={
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(wakeTime)
        };
        const response=await fetch(`${import.meta.env.VITE_BASE_URL}/wake`,post_options);
        const result=await response.json();
        if(!response.ok){
          const errorData=await response.json();
          throw new Error(`HTTP error! status : ${response.status}` + ` ${errorData.message}`);
        }
        const searchDay=year+"-"+month+"-"+day;
        const rows = document.querySelectorAll('#sleeps tbody tr');
        for (let row of rows){
          const dateText=row.querySelector('.date-cell').firstElementChild.value;
          if(dateText === searchDay){
            console.log(dateText);
            const inputField = row.querySelector('input[name="wake"]');
            inputField.value=result.wake;
            let wakeClassName=getWakeBackColor(result.wake);
            inputField.className=wakeClassName;
            break;
          }
        }
      }catch(error){
        alert("エラー : "+error.message);
        setError(err.message);
      }finally{
        setLoading(false);
      }
    };
    postProc();

    if(loading){
      return(<p>読込中...</p>);
    }
    if(error){
      return(<p>{error}</p>);
    }   
   }

  // 入浴ボタンが押下された場合のハンドラー。
  const handleBath = (event) => {
    const now = new Date();
    const year = now.getFullYear();
    const month_tmp = now.getMonth()+1;
    const day_tmp = now.getDate();
    const hour_tmp = now.getHours();
    const minute_tmp = now.getMinutes();
    const month = month_tmp.toString().padStart(2,"0");
    let day = day_tmp.toString().padStart(2,"0");
    const hour = hour_tmp.toString().padStart(2,"0");
    const minute = minute_tmp.toString().padStart(2,"0");
    const time = `${year}-${month}-${day}T${hour}:${minute}:00:00`;
    var bathTime={
      bathTime: '',
    };
    bathTime.bathTime=time;
    // バックエンドに入浴を送信する。
    const postProc=async()=>{
      try{
        const post_options={
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bathTime)
        };
        const response=await fetch(`${import.meta.env.VITE_BASE_URL}/bath`,post_options);
        const result=await response.json();
        if(!response.ok){
          const errorData=await response.json();
          throw new Error(`HTTP error! status : ${response.status}` + ` ${errorData.message}`);
        }
        // 0時跨ぎ判定で、この間は前日からまたいでいると判断する。
        if(0<=hour && hour<12){
          const pre_day=day_tmp-1;
          day=pre_day.toString().padStart(2,"0");
        }
        const searchDay=year+"-"+month+"-"+day;
        const rows = document.querySelectorAll('#sleeps tbody tr');
        for (let row of rows){
          const dateText=row.querySelector('.date-cell').firstElementChild.value;
          if(dateText === searchDay){
            console.log(dateText);
            const inputField = row.querySelector('input[name="bath"]');
            inputField.value=result.bath;
            let bathClassName=getWakeBackColor(result.bath);
            inputField.className=bathClassName;
            break;
          }
        }
      }catch(error){
        alert("エラー : "+error.message);
        setError(err.message);
      }finally{
        setLoading(false);
      }
    };
    postProc();

    if(loading){
      return(<p>読込中...</p>);
    }
    if(error){
      return(<p>{error}</p>);
    }   
   }

  // 就寝ボタンが押下された場合のハンドラー。
  const handleSleepIn = (event) => {
    const now = new Date();
    const year = now.getFullYear();
    const month_tmp = now.getMonth()+1;
    const day_tmp = now.getDate();
    const hour_tmp = now.getHours();
    const minute_tmp = now.getMinutes();
    const month = month_tmp.toString().padStart(2,"0");
    let day = day_tmp.toString().padStart(2,"0");
    const hour = hour_tmp.toString().padStart(2,"0");
    const minute = minute_tmp.toString().padStart(2,"0");
    const time = `${year}-${month}-${day}T${hour}:${minute}:00:00`;
    var bedTime={
      bedTime: '',
    };
    bedTime.bedTime=time;
    // バックエンドに起床を送信する。
    const postProc=async()=>{
      try{
        const post_options={
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bedTime)
        };
        const response=await fetch(`${import.meta.env.VITE_BASE_URL}/bed`,post_options);
        const result=await response.json();
        if(!response.ok){
          const errorData=await response.json();
          throw new Error(`HTTP error! status : ${response.status}` + ` ${errorData.message}`);
        }
        // 0時跨ぎ判定で、この間は前日からまたいでいると判断する。
        if(0<=hour && hour<12){
          const pre_day=day_tmp-1;
          day=pre_day.toString().padStart(2,"0");
        }
        const searchDay=year+"-"+month+"-"+day;
        const rows = document.querySelectorAll('#sleeps tbody tr');
        for (let row of rows){
          const dateText=row.querySelector('.date-cell').firstElementChild.value;
          if(dateText === searchDay){
            console.log(dateText);
            const inputField = row.querySelector('input[name="bed"]');
            inputField.value=result.bed;
            let bedClassName=getWakeBackColor(result.bed);
            inputField.className=bedClassName;
            break;
          }
        }
      }catch(error){
        alert("エラー : "+error.message);
        setError(err.message);
      }finally{
        setLoading(false);
      }
    };
    postProc();

    if(loading){
      return(<p>読込中...</p>);
    }
    if(error){
      return(<p>{error}</p>);
    }   
  }

  // 保存ボタンが押下された場合のハンドラー。
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    var postData=new PostData(0,0,[]);
    var sleep=new Sleep(
      '',
      0,
      0,
      0,
      '',
      '',
      '',
      '',
      0
    );
    // フォームからデーターをパースして取得します。
    form.forEach(function(value,key){
      sleep=makePostData(value,key,postData,sleep);
      sleep.addCounter();
    });

    // 合計を反映します。
    document.getElementById("sleep_sum").textContent=changeMintoSleep(postData.getSleepSum());
    document.getElementById("deep_sleep_sum").textContent=changeMintoSleep(postData.getDeepSleepSum());
    document.getElementById("sleep_sum").className=getSumSleepColor(postData.getSleepSum());
    document.getElementById("sleep_sum_box").className=getSumSleepColor(postData.getSleepSum());
    document.getElementById("deep_sleep_sum").className=getSumDeepSleepColor(postData.getDeepSleepSum());
    document.getElementById("deep_sleep_sum_box").className=getSumDeepSleepColor(postData.getDeepSleepSum());

    // バックエンドに一覧データーを送信する。
    const postProc=async()=>{
      try{
        const post_options={
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(postData.getData())
        };
        const response=await fetch(`${import.meta.env.VITE_BASE_URL}/sleep`,post_options);
        if(!response.ok){
          const errorData=await response.json();
          throw new Error(`HTTP error! status : ${response.status}` + ` ${errorData.message}`);
        }
      }catch(error){
        alert("エラー : "+error.message);
        return(<p>{error}</p>);
      }finally{
        setLoading(false);
      }
    };
    postProc();

    if(loading){
      return(<p>読込中...</p>);
    }
    if(error){
      return(<p>{error}</p>);
    }    
  };

  // 睡眠一覧を表示する。
  var sleepSum=0;
  var deepSleepSum=0;
  data.map((row) => (
    (() => {
      row.wakeClassName=getWakeBackColor(row.wake);
      row.bathClassName=getWakeBackColor(row.bath);
      row.bedClassName=getWakeBackColor(row.bed);
      row.sleepClassName=getSleepBackColor(row.sleep);
      row.deepSleepClassName=getDeepSleepBackColor(row.deep_sleep);
      sleepSum+=changeSleeptoMin(row.sleep);
      deepSleepSum+=changeSleeptoMin(row.deep_sleep);
    })()
  ));
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
    <div className="monthlink">
      <a href={'/sleep?month='+preMonth}>←{preMonth}</a>&nbsp;<a href={'/sleep?month='+nextMonth}>{nextMonth}→</a>
    </div>
    <div className="flex">
      <div className="submitbutton">
        <input type="submit" value="保存" />
      </div>
      <div id="sleep_sum_box" className={getSumSleepColor(sleepSum)}>
        <div id="sleep_sum_div" className="sleep_sum">
          <label id="sleep_sum" className={getSumSleepColor(sleepSum)}>{changeMintoSleep(sleepSum)}</label>
        </div>
      </div>
      <div id="deep_sleep_sum_box" className={getSumDeepSleepColor(deepSleepSum)}>
        <div id="deep_sleep_sum_div" className="deep_sleep_sum">
          <label id="deep_sleep_sum" className={getSumDeepSleepColor(deepSleepSum)}>{changeMintoSleep(deepSleepSum)}</label>
        </div>
       </div>
       <div className="wakebutton">
         <button type="button" onClick={(e) => handleWake(e)}>起床</button>
       </div>
       <div className="wakebutton">
         <button type="button" onClick={(e) => handleBath(e)}>入浴</button>
       </div>
       <div className="wakebutton">
         <button type="button" onClick={(e) => handleSleepIn(e)}>就寝</button>
       </div>
    </div>
    <table id='sleeps' border='1'>
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
              <td className="date-cell"><input type='text' size="10" defaultValue={row.date_str} name="date" readOnly /></td>
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
