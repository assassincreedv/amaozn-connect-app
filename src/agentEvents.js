import React from 'react';
import { useSession } from './session';


const useAgentEvents = () => {
  const { session, setSession } = useSession();


const subscribeToAgentEvents = (agent) => {
  
    // updateSessionAgent(agent)
    console.log("Subscribing to events for agent " + agent.getName());
    console.log("Agent is currently in status of " + agent.getStatus().name);
    // updateAgent(agent)
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
    // updateAgent(agent)
    // handleEndpoints(agent);

  };

  const handleAgentRoutable = (agent) => {
    console.log(
      "[agent.onRoutable] Agent is routable. Agent status is " +
      agent.getStatus().agentStateARN
    );


  };

  const handleAgentNotRoutable = (agent) => {
    console.log(
      "[agent.onNotRoutable] Agent is online, but not routable. Agent status is " +
      agent.getStatus().agentStateARN
    );


  };

  const handleAgentOffline = (agent) => {
    console.log(
      "[agent.onOffline] Agent is offline. Agent status is " +
      agent.getStatus().agentStateARN   
    );
  };


  const updateAgent = (newAgent) => {
    // 创建一个新的 session 对象，其中包含更新后的 contacts
    const updatedSession = {
      ...session, // 复制原始 session 对象的其他属性
      agent:newAgent, // 更新 contacts
    };

    // 使用 setSession 函数更新 session 对象
    setSession(updatedSession);
  };


  return subscribeToAgentEvents
}

  

  export default useAgentEvents