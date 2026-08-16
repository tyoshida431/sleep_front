import './App.css';
import React, {useState, useEffect} from 'react';
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
          const response=await fetch(`${process.env.REACT_APP_BASE_URL}/sleep`,{method:'GET'});
          if(!response.ok){
            throw new Error(`HTTP error! status : ${response.status}`);
          }
          const result=await response.json();
          setGets(result);
        }else{
          const response=await fetch(`${process.env.REACT_APP_BASE_URL}/sleep?`+query,{method:'GET'});
          if(!response.ok){
            throw new Error(`HTTP error! status : ${response.status}`);
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
    let time=event.target.value;
    if(0<time.indexOf(":",0)){
      let deepSleepTimeClassName=getDeepSleepBackColor(time);
      event.target.className=deepSleepTimeClassName;
    }else{
      // 空欄化や入力途中や入力抜けは背景色を白にする。
      event.target.className="white";
    }
  };

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
    try{
      const post_options={
        method: "POST",
        headers: {"ContentType": "application/json"},
        body: JSON.stringify(postData.getData())
      };
      const response=fetch(`${process.env.REACT_APP_BASE_URL}/sleep`,post_options);
      if(!response.ok){
        throw new Error(`HTTP error! status : ${response.status}`);
      }
      const result=response.json();
      setGets(result)
    }catch(error){
      return(<p>{error}</p>);
    }finally{
      setLoading(false);
    }

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
    <div className="monthlink"><a href={'/sleep?='+preMonth}>←{preMonth}</a>&nbsp;<a href={'/sleep?='+nextMonth}>{nextMonth}→</a></div>
    <div className="flex">
      <div className="submitbutton"><input type="submit" value="保存" /></div>
      <div id="sleep_sum_box" className={getSumSleepColor(sleepSum)}><div id="sleep_sum_div" className="sleep_sum"><label id="sleep_sum" className={getSumSleepColor(sleepSum)}>{changeMintoSleep(sleepSum)}</label></div></div>
      <div id="deep_sleep_sum_box" className={getSumDeepSleepColor(deepSleepSum)}> <div id="deep_sleep_sum_div" className="deep_sleep_sum"><label id="deep_sleep_sum" className={getSumDeepSleepColor(deepSleepSum)}>{changeMintoSleep(deepSleepSum)}</label></div></div>
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
