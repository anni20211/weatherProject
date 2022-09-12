const http= require("http");
const fs= require("fs");
const requests= require("requests");

const indexFile=fs.readFileSync("index.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let a=273;
    let tem=tempVal.replace("{%tempval%}", ((orgVal.main.temp)-a).toFixed(2));
    tem=tem.replace("{%tempmin%}", ((orgVal.main.temp_min)-a).toFixed(2));
    tem=tem.replace("{%tempmax%}", ((orgVal.main.temp_max)-a).toFixed(2));
    tem=tem.replace("{%location%}", orgVal.name);
    tem=tem.replace("{%country%}", orgVal.sys.country);
    tem=tem.replace("{%tempstatus%}", orgVal.weather[0].main);
    return tem;
};
const server= http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Basti&appid=7931c029742c5dd63907b52f3a33124f")
.on("data", (chunk)=> {
    const objData=JSON.parse(chunk);
    const arrData=[objData];
    // console.log(arrData);
//   console.log(arrData[0].main.temp);
    const realTimeData= arrData.map(val=> replaceVal(indexFile,val)).join(" ");
    res.write(realTimeData);
})
.on("end", (err) =>{
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
    }
});
server.listen(8000,"127.0.0.1");
