let isAtBottom=!0,scoreList=[];var canvas,ctx,flag=!1,prevX=0,currX=0,prevY=0,currY=0,dot_flag=!1;let gamer,drawing=!1,queueOfEvents=[],processingEvent=!1,processingEraseEvent=!1;var x="black",y=5;canvas=document.getElementById("can"),ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;let listeners={mousemove:"move",mousedown:"down",mouseup:"up",mouseout:"out"};for(const e in listeners)canvas.addEventListener(e,function(t){findxy(listeners[e],t)},!1);function selectToolOrColor(e){switch(e){case"small-brush":y=5;break;case"medium-brush":y=10;break;case"big-brush":y=20;break;case"clean-tool":drawing&&erase();break;default:x=e}}function draw(e,t,n,r,a,s){ctx.beginPath(),ctx.moveTo(e,t),ctx.strokeStyle=a,ctx.lineWidth=s,ctx.lineJoin="round",ctx.lineTo(n,r),ctx.closePath(),ctx.stroke()}function erase(){if(processingEraseEvent=!0,!drawing&&processingEvent)return void setTimeout(erase,1e3);setTimeout(()=>{let e=0;for(let t=0;t<51;t++)setTimeout(()=>{ctx.clearRect(t,0,10*t,h)},e),e=.99*(e+15)},200),setTimeout(()=>{processingEraseEvent=!1},595),drawing&&sendEraseEventToServer()}function findxy(e,t){drawing&&!processingEraseEvent?("down"==e&&(prevX=currX,prevY=currY,currX=t.offsetX,currY=t.clientY+canvas.height/2-canvas.offsetParent.offsetParent.offsetTop,console.log(currX,currY),flag=!0,(dot_flag=!0)&&(ctx.beginPath(),ctx.fillStyle=x,ctx.fillRect(currX,currY,2,2),ctx.closePath(),dot_flag=!1)),"up"!=e&&"out"!=e||(flag=!1,taskDrawing()),"move"==e&&flag&&(prevX=currX,prevY=currY,currX=t.offsetX,currY=t.clientY+canvas.height/2-canvas.offsetParent.offsetParent.offsetTop,queueOfEvents.push({prevX:prevX,prevY:prevY,currX:currX,currY:currY,x:x,y:y}),draw(prevX,prevY,currX,currY,x,y))):flag=!1}const backendUrl="coronadraw.herokuapp.com",sendPathsToServer=e=>{socket.send(JSON.stringify({eventType:"path",event:e}))},sendEraseEventToServer=()=>{socket.send(JSON.stringify({eventType:"erase"}))},sendMessageToServer=e=>{socket.send(JSON.stringify({eventType:"chat",event:e}))},addMessageToChat=e=>{let t=document.querySelector(".chat-output"),n=document.createElement("div");if(n.classList.add("chat-text__line"),"chat-user__join"==e.from){n.classList.add("chat-user__join-left");let t={name:e.username,points:0};addRanking(t,!0),scoreList.push(t),currentGamers++,playersInRoomText.innerText=`Players: ${currentGamers} / ${maxGamers}`}else if("chat-user__left"==e.from)n.classList.add("chat-user__join-left"),removeFromRanking(e.username),currentGamers--,playersInRoomText.innerText=`Players: ${currentGamers} / ${maxGamers}`;else if("chat-user__guessedword"==e.from)n.classList.add("chat-correctword");else if("chat-user__won"==e.from)n.classList.add("chat-user__won");else{let t=document.createElement("span");t.classList.add("chat-user"),t.appendChild(document.createTextNode(e.from+": ")),n.appendChild(t)}n.appendChild(document.createTextNode(e.text)),t.appendChild(n),scrollChatOutput()};let interval,seconds,round;const timer=document.querySelector(".game-board__timer").children[0],startStopWatch=e=>{round=!0,seconds=e,interval=setInterval(()=>{seconds--,timer.innerHTML=seconds,(seconds<1||0==round)&&clearInterval(interval)},1e3)},finishRound=()=>{flag=!1,round=!1,clearInterval(interval),0==seconds&&(timer.innerHTML="")},roomNameText=document.querySelector(".l-panel-room__name"),currentRoundText=document.querySelector(".l-panel-round__title"),playersInRoomText=document.querySelector(".l-panel-playersinroom");let maxGamers,maxRounds,currentGamers;const displayRoom=e=>{let{roomName:t,currentRound:n,rounds:r,maxPlayers:a,time:s,hint:o,numOfGamers:c,ranking:i}=e;roomNameText.innerHTML=t,maxRounds=r,maxGamers=a,currentGamers=c,currentRoundText.innerText=`Round ${n} of ${r}`,playersInRoomText.innerText=`Players: ${c} / ${a}`,round=!0,0!==n&&(startStopWatch(s),startRankings(scoreList=i))},processEvent=e=>{const{eventType:t,event:n}=e;switch(t){case"erase":erase();break;case"chat":addMessageToChat(n);break;case"connection":gamer.id=n.id,displayRoom(n);break;case"ranking":updateRankings(n);break;case"new-round":startStopWatch(n.seconds),inputMessage.disabled=!1,drawing=!1,processingEvent=!1,wordToDrawPanel.style.display="none",wordToDrawPanel.children[0].innerHTML="",currentRoundText.innerText=`Round ${n.currentRound} of ${maxRounds}`;break;case"round-finished":flag=!1,round=!1,clearInterval(interval),0==seconds&&(timer.innerHTML="");break;case"game-finished":cleanRankings(),addMessageToChat({from:"chat-user__won",text:`${n.name} won the game with ${n.points} points`});break;case"you-draw":drawing=!0,inputMessage.disabled=!0,wordToDrawPanel.style.display="block",wordToDrawPanel.innerHTML="You have to draw: <span>"+n.word+"</span>",currentRoundText.innerText=`Round ${n.currentRound} of ${maxRounds}`,startStopWatch(n.time);break;case"hint":wordToDrawPanel.style.display="block",wordToDrawPanel.innerHTML="Word Hint: <span>"+n+"</span>";break;case"path":processingEvent=!0;let e=0;n.forEach(t=>{e+=20;const{prevX:n,prevY:r,currX:a,currY:s,x:o,y:c}=t;setTimeout(()=>{draw(n,r,a,s,o,c)},e)}),setTimeout(()=>processingEvent=!1,20*n.length);break;case"path-at-first":processingEvent=!0,n.forEach(e=>{const{prevX:t,prevY:n,currX:r,currY:a,x:s,y:o}=e;draw(t,n,r,a,s,o)}),processingEvent=!1;break;default:return}},rankingTable=document.querySelector(".l-panel-score__table > tbody"),cleanRankings=()=>{scoreList.forEach(e=>{e.points=0}),rankingTable.innerHTML="",scoreList.forEach(e=>addRanking({name:e.name,points:e.points}),!0)},updateRankings=e=>{scoreList.forEach(t=>{for(i=0;i<e.length;i++)t.name==e[i].name&&(t.points=e[i].points)}),scoreList.sort((e,t)=>t.points-e.points),rankingTable.innerHTML="",scoreList.forEach(t=>addRanking({name:t.name,points:t.points},t.name==e[0].name||t.name==e[1].name))},startRankings=e=>{e.sort((e,t)=>t.points-e.points),rankingTable.innerHTML="",e.forEach(e=>addRanking({name:e.name,points:e.points}))},addRanking=(e,t)=>{const n=document.createElement("tr");t&&n.classList.add("score-updated"),n.classList.add("score-board__row"),n.innerHTML=`\n      <td class="l-panel-score__user">${e.name}</td>\n      <td class="l-panel-score__user-score">${e.points}</td>\n     `,t&&setTimeout(()=>{n.classList.remove("score-updated")},200),rankingTable.append(n)},removeFromRanking=e=>{let t;for(scoreList=scoreList.filter(t=>t.name!=e),t=0;t<rankingTable.rows.length&&rankingTable.rows[t].cells[0].innerText!=e;t++);rankingTable.deleteRow(t)};document.querySelector(".icons").addEventListener("click",e=>selectToolOrColor(e.target.closest("div").id));const toggle=document.getElementById("toggle");let socket;toggle.addEventListener("click",()=>{toggle.value=drawing?"Mirar":"Dibujar";const e=document.querySelector(".icons"),t=document.querySelector(".game-board__guessing"),n=document.querySelectorAll(".game-board__word");for(const e of n)e.classList.toggle("hide");t.classList.toggle("hide"),e.classList.toggle("hide")});let playing=!1;const navigationButtons=e=>{e.preventDefault();const t=document.querySelector(".intro-panel"),n=document.getElementById("container"),r=document.getElementById("input-name"),a=document.getElementById("roomSelect");""!==r.value.trim()&&(gamer={name:r.value,room:a.options[a.selectedIndex].value},t.classList.toggle("hide"),n.classList.toggle("hide"),(playing=!playing)?((socket=new WebSocket("ws://"+backendUrl)).addEventListener("open",function(e){socket.send(JSON.stringify({event:{name:gamer.name,room_id:gamer.room},eventType:"connect"}))}),socket.addEventListener("message",function(e){var t=JSON.parse(e.data);if("path"==t.eventType&&(processingEvent||processingEraseEvent||superEvent.event[0])){superEvent.event=superEvent.event.concat(t.event);let e=setInterval(()=>{processingEvent||processingEraseEvent||(superEvent.event[0]&&(processEvent(superEvent),superEvent.event=[]),clearInterval(e))},500)}else processEvent(t)})):socket.close())};document.getElementById("play-btn").addEventListener("click",navigationButtons),document.getElementById("goback-btn").addEventListener("click",navigationButtons);const taskDrawing=function(){var e;drawing&&queueOfEvents[0]&&(e=queueOfEvents,socket.send(JSON.stringify({eventType:"path",event:e})),queueOfEvents=[])};setInterval(taskDrawing,5e3);const inputMessage=document.querySelector(".input-text");document.getElementById("chat-input").addEventListener("submit",e=>{if(e.preventDefault(),""===e.target.elements[0].value.trim())return e.target.elements[0].classList.add("invalid-input"),void setTimeout(()=>e.target.elements[0].classList.remove("invalid-input"),1500);e.target.elements[0].classList.remove("invalid-input"),sendMessageToServer({message:e.target.elements[0].value}),inputMessage.value=""});let oldValue="";document.querySelector(".input-text").addEventListener("input",e=>{e.preventDefault(),e.target.value.length>100?e.target.value=oldValue:oldValue=e.target.value});let superEvent={eventType:"path",event:[]};function scrollChatOutput(){const e=document.querySelector(".chat-output");isAtBottom&&(e.scrollTop=e.scrollHeight)}const chatOut=document.querySelector(".chat-output");chatOut.addEventListener("scroll",function(){isAtBottom=!(this.scrollTop+this.clientHeight<this.scrollHeight-100)});const wordToDrawPanel=document.querySelector(".game-board__word");
