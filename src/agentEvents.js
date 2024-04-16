import React from 'react';



const subscribeToAgentEvents = (agent) => {
  
    // updateSessionAgent(agent)
    console.log("Subscribing to events for agent " + agent.getName());
    console.log("Agent is currently in status of " + agent.getStatus().name);
  
    agent.onRefresh(handleAgentRefresh);
    agent.onStateChange(handleAgentRefresh);
    agent.onRoutable(handleAgentRoutable);
    agent.onNotRoutable(handleAgentNotRoutable);
    agent.onOffline(handleAgentOffline);
  };

  

  const handleAgentRefresh = (agent) => {
    console.log(
      "[agent.onRefresh] Agent data refreshed. Agent status is " +
      agent.getStatus().agentStateARN
    );
    handleEndpoints(agent);

  };

  const handleAgentRoutable = (agent) => {
    console.log(
      "[agent.onRoutable] Agent is routable. Agent status is " +
      agent.getStatus().agentStateARN
    );
    handleEndpoints(agent);


  };

  const handleAgentNotRoutable = (agent) => {
    console.log(
      "[agent.onNotRoutable] Agent is online, but not routable. Agent status is " +
      agent.getStatus().agentStateARN
    );
    handleEndpoints(agent);


  };

  const handleAgentOffline = (agent) => {
    console.log(
      "[agent.onOffline] Agent is offline. Agent status is " +
      agent.getStatus().agentStateARN   
    );
    handleEndpoints(agent);
  };


  const handleEndpoints = (agent) => {
    var queuesARNs = agent.getAllQueueARNs();
   agent.getEndpoints(
   queuesARNs,
   {
      success: function(data) {
         var endpoints = data.endpoints; // or data.addresses
         console.log(data)
      },
      failure: function(err) {
      }
   }
);
  }
  

  export default subscribeToAgentEvents