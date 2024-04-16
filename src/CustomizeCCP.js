import React, { useEffect, useRef,useState } from 'react';
// import 'amazon-connect-streams';
import subscribeToAgentEvents from './agentEvents';
import useContactEvents from './contactEvents';
import { useSession } from './session';
import DialPad from './DialPad';

const testPhoneBook={
    'Shirley':'+13478247453',
    'Xiaosong':'+16142645218'
}


const CCP = () => {
  const containerDiv = useRef(null);
  const subscribeToContactEvents = useContactEvents();
  const { session, setSession } = useSession();
  const [byDialPad, setByDialPad] = useState(true)



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
  }

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



  return <div ref={containerDiv} style={{height: "500px" }} id='softphone-container'>
    {console.log('status',session.contactStatus)}
    {console.log('contact',session.contact)}
   
    <div>
    <button onClick={() => setByDialPad(!byDialPad)}>
          {byDialPad ? "Switch to Phone Book" : "Switch to Dial Pad"}
        </button>
    {byDialPad?      
    <DialPad onMakeCall={makeCall}  />:

     <div className="phone-book">
        <h3>Phone Book</h3>
        <ul>
          {Object.entries(testPhoneBook).map(([name, number]) => (
            <li key={name} onClick={() => makeCall(number)}>
              {name}
            </li>
          ))}
        </ul>
      </div>}
     </div>
     {session.contactStatus? <div>{session.contactStatus}</div>:<></>}
    <button onClick={disconnectContact} >end call </button>
    <button onClick={clearContact}>clear</button>
  </div>;
};

export default CCP;
