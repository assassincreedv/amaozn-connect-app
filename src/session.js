import React, { useState, createContext, useContext } from 'react';

// 创建 SessionContext 上下文
const SessionContext = createContext();

// 创建 SessionProvider 组件，用于提供 session 对象和更新函数
export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({
    contact: '',
    routingProfile: '',
    routingProfileFileLoaded: false,
    currentQueueDPLoaded: '',
    currentContactID: '',
    agent: '',
    contactStatus: '',
  });

  // 返回 SessionContext.Provider，将 session 对象和更新函数提供给子组件
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// 创建 useSession 自定义钩子，用于在组件中访问 session 对象和更新函数
export const useSession = () => useContext(SessionContext);