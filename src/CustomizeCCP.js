import React, { useEffect, useRef,useState } from 'react';
// import 'amazon-connect-streams';
import useAgentEvents from './agentEvents';
import useContactEvents from './contactEvents';
import { useSession } from './session';
import DialPad from './DialPad';
import './cpp.css'

const testPhoneBook={
    'Shirley':'+13478247453',
    'Xiaosong':'+16142645218'
}


const CCP = ({phoneNumber,popUp}) => {
  const containerDiv = useRef(null);
  const subscribeToContactEvents = useContactEvents();
  const subscribeToAgentEvents = useAgentEvents();
  const { session, setSession } = useSession();
  const [byDialPad, setByDialPad] = useState(true)
  const [agent, setAgent] = useState()
  const [isMuted, setIsMuted] = useState(false);

 



  useEffect(() => {
    const initCCP = () => {
        // eslint-disable-next-line no-undef
      window.connect.core.initCCP(containerDiv.current, {
        ccpUrl: 'https://hitalentech-testing.my.connect.aws/connect/ccp-v2/',
        loginPopupAutoClose: true, 
        // loginOptions: {
        //   autoClose: true,
        //   height: 600,
        //   width: 400,
        //   top: 0,
        //   left: 0
        // },
        softphone: {
          allowFramedSoftphone: true
        },
      });


    //   window.connect.core.onSoftphoneSessionInit(function({ connectionId }) {
    //     let softphoneManager = window.connect.core.getSoftphoneManager();
    //     if(softphoneManager){
    //       // access session
    //       let softphoneSession = softphoneManager.getSession(connectionId);
    //       console.log("session", softphoneSession);
    //       setSoftphoneSession(softphoneSession)
    //       // YOu can use this rtc session for stats analysis 
    //     }
    // });
  
    // eslint-disable-next-line no-undef
    window.connect.contact(subscribeToContactEvents);
    // eslint-disable-next-line no-undef
     window.connect.agent(subscribeToAgentEvents);
    //  updateSessionAgent(window.connect.agent)
    };

  
  

    window.onload = (event) => {
        console.log("window.onload")
    
        try {
            initCCP('container-div');
        } catch (error) {
            console.error('CCP initialization error', error);
        }
    
    };
    return () => {
      // Clean-up code here if needed
    };
  }, []);



  const makeCall = (number) => {
    console.log("makeCall",number);
   
    // eslint-disable-next-line no-undef
    var endpoint = connect.Endpoint.byPhoneNumber(number);
    // eslint-disable-next-line no-undef
    var agent = new connect.Agent();
    agent.connect(endpoint, {
    });
    setAgent(agent);
  }

  const mute =()=>{
    if(agent){
      agent.mute();
    }
  }

  const unmute =()=>{
    if(agent){
      agent.unmute();
    }
  }

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  const handleMuteClick = () => {
    // 切换 mute 状态
    toggleMute();
    // 调用 mute 或 unmute 函数
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  const acceptContact= ()=> {
    session.contact.accept({
        success: function () {
            console.log("Accepted contact via Streams");
        },
        failure: function () {
            console.log("Failed to accept contact via Streams");
        }
    });
}


const disconnectContact=()=> {
    
    session.contact.getAgentConnection().destroy({
        success: function () {
           console.log("Disconnected contact via Streams");
        },
        failure: function () {
            console.log("Failed to disconnect contact via Streams");
        }
    });
}



const clearContact=()=> {
    session.contact.clear({
        success: function () {
            console.log("Cleared contact via Streams");
        },
        failure: function () {
            console.log("Failed to clear contact via Streams");
        }
    });
}

const endContact = () => {
  disconnectContact();
  setTimeout(() => {
    clearContact();
  }, 2000); 
};




  return <div ref={containerDiv} style={{height: "500px" }} id='softphone-container'>
   {popUp &&
   <div className='popWindow'>
      <div class="phonecontainer">
        <div class="left">{phoneNumber}</div>
        {console.log('status',session.contactStatus)}
        
        <div className='right'>
        {(session.contactStatus !== 'connecting' && session.contactStatus !== 'connected') &&
        <div  onClick={() => makeCall(phoneNumber)} id="call"> <i className="fa fa-phone" aria-hidden="true"></i></div>
        } 

        {session.contactStatus == 'connecting' &&
        <div className='callingcontainer'>
        <div>Calling</div>
        <div onClick={endContact} id="call2"><i className="fa fa-phone" aria-hidden="true"></i></div>
        </div>
        }
        
        {session.contactStatus == 'connected' &&
        <div className='callingcontainer'>
          <div onClick={handleMuteClick}>{isMuted ? 'Unmute' : 'Mute'}</div>
        <div onClick={endContact} id="call2"><i className="fa fa-phone" aria-hidden="true"></i></div>
        </div>
        }
        </div>
       
      </div>
      </div>
}
   
{/*    
     {session.contactStatus? <div>{session.contactStatus}</div>:<></>}
    <button onClick={disconnectContact} >end call </button>
    <button onClick={clearContact}>clear</button>
    <button onClick={endContact}>end all</button>
    <button onClick={mute}>mute</button> */}
  </div>;
};

export default CCP;
