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

const host = "localhost"

const host1 = "44.241.137.220"

const LiveCaptions = () => {

  const [captions, setCaptions] = useState([]);
  const [summary, setSummary] = useState('');
  const captionsContainerRef = useRef(null);
  const websocketUrl = "ws:/" + host + ":8082/ws";

  const clearCaptions = () => {
    setCaptions([]); 
    setSummary(''); 
  };

  const buttonStyle = {
    backgroundColor: '#2185d0', 
    width: '20%',
    color: '#FFFFFF',
    border: 'none', 
    borderRadius: '5px', 
    padding: '10px 20px', 
    fontSize: '16px', 
    cursor: 'pointer', 
    margin: '10px 0'
  };

  const fetchSummary = async (contactId) => {
    try {
      const response = await fetch(`/api/v1/connect/live-transcription/summary` + contactId, { method: 'GET'});
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: websocketUrl, 
      webSocketFactory: () => new SockJS("http://" + host + ":8082/ws"),
      connectHeaders: {
        login: "test",
        passcode: "connect123",
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        console.log("Connected");
        client.subscribe('/topic/message', (message) => {
          const body = JSON.parse(message.body);
          console.log(body)
          if (body.type === "LARK") {
            setCaptions(prevCaptions => {
                  // 查找同一个speaker且streamId相同的最后一条消息
                  const lastCaptionOfSameSpeakerAndStream = prevCaptions.slice().reverse().find(caption => caption.speaker === body.speaker && caption.streamId === body.streamId);
            
                  // 如果找到了相同speaker和streamId的消息，则更新这条消息的内容
                  if (lastCaptionOfSameSpeakerAndStream) {
                      const updatedCaptions = prevCaptions.map(caption => {
                          if (caption === lastCaptionOfSameSpeakerAndStream) {
                              return { ...caption, caption: body.caption };
                          }
                          return caption;
                      });
                      return updatedCaptions;
                  }
            
                  // 如果上述条件不满足，则添加新字幕
                  return [...prevCaptions, body];
            });
          }
          else {
            setCaptions(prevCaptions => {
              const lastCaption = prevCaptions[prevCaptions.length - 1];
              
              // 如果当前字幕与上一个字幕相同，则不进行更新
              if (lastCaption && lastCaption.speaker === body.speaker && lastCaption.caption === body.caption) {
                  return prevCaptions;
              }
          
              // 如果内容部分相同且当前字幕不为空，则替换原有内容
              if (lastCaption && lastCaption.speaker === body.speaker && lastCaption.caption.length > 1 && body.caption.startsWith(lastCaption.caption.substring(0, lastCaption.caption.length - 1))) {
                  const updatedLastCaption = { ...lastCaption, caption: body.caption };
                  return [...prevCaptions.slice(0, -1), updatedLastCaption];
              }
          
              // 如果上述条件均不满足，则添加新字幕
              return [...prevCaptions, body];
          });
          }
        });
      },
      // 这里添加了其他配置项，如reconnectDelay
    });

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    if (captionsContainerRef.current) {
      const { scrollHeight, clientHeight } = captionsContainerRef.current;
      captionsContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [captions]);

  return (
    <div>
      <button onClick={clearCaptions} style={buttonStyle}>清除字幕</button>
        <div ref={captionsContainerRef} className="captions-container">
        {captions.map((caption, index) => (
          <div key={index} className={`caption ${caption.speaker === 'Customer' ? 'customer' : 'agent'}`}>
            <strong>{caption.speaker === 'Customer' ? '客户' : '服务代表'}:</strong> {caption.caption}
          </div>
        ))}
      </div>
    </div>
  );

};


const testPhoneBook={
  'Shirley':'+13478247453',
  'Xiaosong':'+16142645218'
}


function App() {

  const[popWindow,setPopWindow] =useState(false)
  const[number,setNumber] = useState()

  const handleListItemClick = (clickedNumber) => {
    setNumber(clickedNumber); // 更新 number
    setPopWindow(true); // 设置 popWindow 为 true
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popWindow && !e.target.closest('.popWindow')) {
        setPopWindow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popWindow]);


  return (
    <div className="App">
      <div>
      <h3>Phone Book</h3>
        <ul>
          {Object.entries(testPhoneBook).map(([name, number]) => (
            <li key={name} onClick={() => handleListItemClick(number)}>
              {name}
            </li>
          ))}
        </ul>
      </div>

    
      <div className='phoneCall'>
         <CustomizeCCP phoneNumber={number} popUp={popWindow}/>
          <LiveCaptions />
      </div>
      

    
      {/* <div style={{display:"flex", height:"600px"}}>
        <div style={{width:"45%", marginRight:"10%"}}>
          <p>test amaozn connect</p>
           <ConnectSoftphone /> 
          <CustomizeCCP phoneNumber={number}/>
          <LiveCaptions /> 
        </div>
        <div style={{height:"600px", width:"45%"}}>
          <p>实时字幕：</p>
        </div>
      </div> */}
     
     
     
    </div>
  );
}

export default App;
