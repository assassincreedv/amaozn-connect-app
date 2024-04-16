import logo from './logo.svg';
import './App.css';
import SockJS from 'sockjs-client';
import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import CustomizeCCP from './CustomizeCCP';




const ConnectSoftphone = () => {
  useEffect(() => {
      // 确保这段代码在window.connect已加载后执行
      const initCCP = () => {
          const containerDiv = document.getElementById("softphone-container");
          window.connect.core.initCCP(containerDiv, {
              ccpUrl: "https://hitalentech-testing.my.connect.aws/connect/ccp-v2/", // 替换为你的CCP URL
              loginPopupAutoClose: true, // 使用登录弹窗
              softphone: {
                  allowFramedSoftphone: true
              }
          });
      };

      if (window.connect) {
          initCCP();
      } else {
          window.onload = initCCP;
      }
  }, []);

  const makeCall = () => {
   
    // eslint-disable-next-line no-undef
    var endpoint = connect.Endpoint.byPhoneNumber("+13478247453");
    // eslint-disable-next-line no-undef
    var agent = new connect.Agent();

    agent.connect(endpoint, {
    });
  }

  return <div id="softphone-container" style={{height: "500px" }} >
    <button onClick={makeCall}>make a call</button>
  </div>;
};

// const LiveCaptions = () => {
  


//   const [captions, setCaptions] = useState([]);
//   const captionsContainerRef = useRef(null);

//   useEffect(() => {
//     const client = new Client({
//       brokerURL: "ws://44.241.137.220:8082/ws", 
//       webSocketFactory: () => new SockJS("http://44.241.137.220:8082/ws"),
//       connectHeaders: {
//         login: "test",
//         passcode: "connect123",
//       },
//       debug: function (str) {
//         console.log('STOMP: ' + str);
//       },
//       onConnect: () => {
//         console.log("Connected");
//         client.subscribe('/topic/message', (message) => {
//           const body = JSON.parse(message.body);
//           console.log(body)
//           setCaptions(prevCaptions => {
//             const lastCaption = prevCaptions[prevCaptions.length - 1];
            
//             // 如果当前字幕与上一个字幕相同，则不进行更新
//             if (lastCaption && lastCaption.speaker === body.speaker && lastCaption.caption === body.caption) {
//                 return prevCaptions;
//             }
        
//             // 如果内容部分相同且当前字幕不为空，则替换原有内容
//             if (lastCaption && lastCaption.speaker === body.speaker && lastCaption.caption.length > 1 && body.caption.startsWith(lastCaption.caption.substring(0, lastCaption.caption.length - 1))) {
//                 const updatedLastCaption = { ...lastCaption, caption: body.caption };
//                 return [...prevCaptions.slice(0, -1), updatedLastCaption];
//             }
        
//             // 如果上述条件均不满足，则添加新字幕
//             return [...prevCaptions, body];
//         });
//         });
//       },
//       // 这里添加了其他配置项，如reconnectDelay
//     });

//     client.activate();

//     return () => {
//       if (client) {
//         client.deactivate();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (captionsContainerRef.current) {
//       const { scrollHeight, clientHeight } = captionsContainerRef.current;
//       captionsContainerRef.current.scrollTop = scrollHeight - clientHeight;
//     }
//   }, [captions]);

//   return (
//     <div ref={captionsContainerRef} className="captions-container">
//       {captions.map((caption, index) => (
//         <div key={index} className={`caption ${caption.speaker === 'Customer' ? 'customer' : 'agent'}`}>
//           <strong>{caption.speaker === 'Customer' ? '客户' : '服务代表'}:</strong> {caption.caption}
//         </div>
//       ))}
//     </div>
//   );

// };

function App() {
  return (
    <div className="App">
      <div style={{display:"flex", height:"600px"}}>
        <div style={{width:"45%", marginRight:"10%"}}>
          <p>test amaozn connect</p>
          {/* <ConnectSoftphone /> */}
          <CustomizeCCP />
        </div>
        <div style={{height:"600px", width:"45%"}}>
          <p>实时字幕：</p>
          {/* <LiveCaptions /> */}
        </div>
      </div>
     
     
    </div>
  );
}

export default App;
