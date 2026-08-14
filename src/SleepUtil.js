class PostData{
  constructor(sleepSum,deepSleepSum,data){
    this.sleepSum=sleepSum;
    this.deepSleepSum=deepSleepSum;
    this.data=data;
  }
  addSleepSum(sleepSum){
    this.sleepSum=sleepSum+this.sleepSum;
  }
  addDeepSleepSum(deepSleepSum){
    this.deepSleepSum=deepSleepSum+this.deepSleepSum;
  }
  addData(data){
    this.data.push(data);
  }
  getSleepSum(){
    return this.sleepSum;
  }
  getDeepSleepSum(){
    return this.deepSleepSum;
  }
  getData(){
    return this.data
  }
};

// 睡眠の背景色を取得する。
function getSleepBackColor(time){
   let hour=time.substr(0,time.indexOf(":",0));
   let hourNum=Number(hour);
   var ret="";
   if(6<=hourNum){
     ret="goju";
   }else if(5===hourNum){
     ret="yonju";
   }else if(4===hourNum){
     ret="sanju";
   }else if(3===hourNum){
     ret="niju";
   }else if(1<=hourNum&&hourNum<=2){
     ret="ju";
   }else if(0===hourNum){
     ret="aka";
   }
   if(time===""){
     ret="white";
   }
   return ret;
}

// 深い睡眠の背景色を取得する。
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

// 起床の背景色を取得する。
function getWakeBackColor(time){
  var ret="";
  if(time<0){
    ret="aka";
  }else{
    ret="white";
  }
  return ret;
}

// 睡眠を分数に変換する。
function changeSleeptoMin(time){
  let hour=time.substr(0,time.indexOf(":",0));
  let hourNum=Number(hour);
  let min=time.substr(3,2); 
  let minNum=Number(min);
  return hourNum*60+minNum;
}

// 分数を00:00:00の形式の文字列に変換する。
function changeMintoSleep(time){
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

// 睡眠合計の背景色を取得する。
function getSumSleepColor(time){
  var ret="";
  let hourNum=Math.floor(time/60);
  if(hourNum<36){
    // 背景は白
  }else if(36<=hourNum&&hourNum<72){
    ret="ju";
  }else if(72<=hourNum&&hourNum<108){
    ret="niju";
  }else if(108<=hourNum&&hourNum<144){
    ret="sanju";
  }else if(144<=hourNum&&hourNum<180){
    ret="yonju";
  }else if(180<=hourNum){
    ret="goju";
  }
  return ret;
}

// 深い睡眠合計の背景色を取得する。
function getSumDeepSleepColor(time){
  var ret="";
  let hourNum=Math.floor(time/60);
  if(hourNum<7){
    // 背景は白
  }else if(7<=hourNum&&hourNum<14){
    ret="ju";
  }else if(14<=hourNum&&hourNum<21){
    ret="niju";
  }else if(21<=hourNum&&hourNum<28){
    ret="sanju";
  }else if(28<=hourNum&&hourNum<36){
    ret="yonju";
  }else if(36<=hourNum){
    ret="goju";
  }
  return ret;
}

// 次の月を取得する。
function getNextMonth(queryMonth){
  var ret="";
  if(queryMonth===undefined){
    ret=calcNextMonthFromNow();
  }else{
    var yearString=queryMonth.substr(0,4);
    var monthString=queryMonth.substr(4,2);
    var yearNum=parseInt(yearString);
    var monthNum=parseInt(monthString);
    if(monthNum===12){
      yearNum++;
      monthNum=1;
    }else{
      monthNum++;
    }
    ret=yearNum.toString()+monthNum.toString().padStart(2,0);
  }
  return ret;
}

// 現時点から次の月を計算する。
function calcNextMonthFromNow(){
  var ret="";
  const now=new Date();
  var year=now.getFullYear();
  // 0始まりの為+1します。
  var month=now.getMonth()+1;
  if(month===12){
    year++;
    month=1;
  }else{
    month++;
  }
  ret=year.toString()+month.toString().padStart(2,0);
  return ret;
}

// 前の月を取得する。
function getPreMonth(queryMonth){
  var ret="";
  if(queryMonth===undefined){
    ret=calcPreMonthFromNow();
  }else{
    var yearString=queryMonth.substr(0,4);
    var monthString=queryMonth.substr(4,2);
    var yearNum=parseInt(yearString);
    var monthNum=parseInt(monthString);
    if(monthNum===1){
      yearNum--;
      monthNum=12;
    }else{
      monthNum--;
    }
    ret=yearNum.toString()+monthNum.toString().padStart(2,0);
  }
  return ret;
}

// 今から前の月を計算する。
function calcPreMonthFromNow(){
  var ret="";
  const now=new Date();
  var year=now.getFullYear();
  // 0始まりのため+1します。
  var month=now.getMonth()+1;
  if(month===1){
    year--; 
    month=12;
  }else{
    month--;
  } 
  ret=year.toString()+month.toString().padStart(2,0);
  return ret;
}

function makePostData(value,key,counter,postData,sleep){
  switch(counter){
    case 0:
      // TODO : sleepをクラスにして新規作成で参照渡しで返り、(出来る?)でdateを追記して戻る。
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
      postData.addSleepSum(changeSleeptoMin(value));
      break;
    case 6:
      sleep.deep_sleep=value;
      postData.addDeepSleepSum(changeSleeptoMin(value));
      break;
    case 7:
      sleep.description=value;
      // TODO : sleepをクラスにして連想配列化メソッド書くかも。
      postData.addData(sleep);
      counter=-1;
      break;
    default:
      break;
  };
  return counter;
}

export {
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
  PostData
}