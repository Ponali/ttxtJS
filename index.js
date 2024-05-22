const SEXTANTS = [
    ' ', '🬀', '🬁', '🬂', '🬃', '🬄', '🬅', '🬆', '🬇', '🬈', '🬉', '🬊', '🬋', '🬌', '🬍', '🬎',
    '🬏', '🬐', '🬑', '🬒', '🬓', '▌', '🬔', '🬕', '🬖', '🬗', '🬘', '🬙', '🬚', '🬛', '🬜', '🬝', 
    '🬞', '🬟', '🬠', '🬡', '🬢', '🬣', '🬤', '🬥', '🬦', '🬧', '▐', '🬨', '🬩', '🬪', '🬫', '🬬',
    '🬭', '🬮', '🬯', '🬰', '🬱', '🬲', '🬳', '🬴', '🬵', '🬶', '🬷', '🬸', '🬹', '🬺', '🬻', '█'
];
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//import WebSocket from "ws";
let WebSocket = require("ws");
let ws = new WebSocket("wss://zxnet.co.uk/teletext/viewer/channels/ws1");
let CSI="\x1B[";
function atob(data){
    return Buffer.from(data, 'base64').toString('ascii');
};
function position(x,y){
    //process.stdout.write(CSI+String.fromCharCode(y)+";"+String.fromCharCode(x)+"H");
    process.stdout.write(CSI+y+";"+x+"H");
};
function clear(){
    process.stdout.write(CSI+"2J");
}
function switchPage(num){
    if(typeof(num)=="number"){num=num.toString()}
    let a=parseInt(num[0]);
    let b=parseInt(num[1]);
    let c=parseInt(num[2],16);
    let s=[a,b*16+c];
    ws.send("pagesearch,0,"+s[0]+","+s[1]+",16255,true,false")
};
function graphicsManage(str){
    let out="";
    let usesGraphics=false;
    for(let i=0;i<str.length;i++){
        if((str.charCodeAt(i)&0xf0)==0x10){
            usesGraphics=true;
        }
        if((str.charCodeAt(i)&0xf0)==0x0){
            usesGraphics=false;
        }
        if(usesGraphics){
            if(str.charCodeAt(i)<0x20){
                out+=str[i]+" ";
            } else {
                out+=((b)=>{let a=b.charCodeAt();a=a-0x20*(1+(a>=0x60));let out=SEXTANTS[a];return out?out:b;})(str[i]);
            }
        } else {
            out+=str[i];
        };
        //out+=str.charCodeAt(i).toString(16).padStart(2,"0")
    };
    return out;
    //return str.replace(/[\x20-\x3f\x60-\x7f]/gm,(a)=>{a=a.charCodeAt();return SEXTANTS[a-0x20*(1+(a>=0x60))]})
}
function paletteLog(str){
    let bright=true;
    str=graphicsManage(str);
    str=str.replace(new RegExp("[\x01-\x07\x11-\x17] \x1d","gm"),(a)=>{a=a.charCodeAt(0);/*return a.toString(16);*/return " "+CSI+"1;34;"+(40+60*bright+(a&7))+"m";});
    str=str.replace(/[\x01-\x07]/gm,(a)=>{a=a.charCodeAt();return CSI+"1;34;"+(30+60*bright+(a&7))+"m ";});
    str=str.replace(/[\x11-\x17]/gm,(a)=>{a=a.charCodeAt();return CSI+"1;34;"+(30+60*bright+(a&7))+"m";});
    str=str.replace(/[\x08\x18]/gm,(a)=>{a=a.charCodeAt();return CSI+"5m";})
    console.log(str+CSI+"1;34;0m") // .replace(/\x7f/g,"\u2588")
}
ws.onmessage = (event) => {
    let d=JSON.parse(event.data);
    if(d[0]=="header"){
        if(d[1]){
            // i hope someone knows what those types of headers actually do
        } else {
            clear();
            position(0,0);
            //console.log(d[2]);
            console.log(atob(d[2]).slice(2));
        }
    }
    if(d[0]=="row"){
        position(0,d[3]+1);
        paletteLog(atob(d[4]));
        //console.log(d[4]);
    }
    //console.log(event.data);
};
ws.onopen=()=>{
    ws.send("ttx,false");
    ws.send("ttx,true");
    ws.send("pagesearch,0,1,0,16255,true,false,false");
}
setInterval(()=>{
    ws.send("keepalive");
},5000);
function questionLoop(){
    rl.question("", function(input) {
        if(["quit","exit","disconnect"].includes(input.toLowerCase())){
            clear();
            process.exit();
        } else {
            switchPage(input);
            questionLoop();
        }
    });
};
questionLoop();