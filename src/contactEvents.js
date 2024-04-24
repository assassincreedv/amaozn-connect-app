import { useEffect,useState } from 'react';
import { useSession } from './session';


const useContactEvents = () => {
  const { session, setSession } = useSession();

  const handleContactIncoming = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactIncoming');
  };

  const handleContactAccepted = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactAccepted - Contact accepted by agent');
    // Add your custom code here
  };

  const handleContactConnecting = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactConnecting() - Contact connecting to agent');
    // Add your custom code here
    console.log(contact.getState().type)
  };

  const handleContactConnected = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactConnected() - Contact connected to agent');
    console.log(contact.getState().type)
    updateContacts(contact);
  };

  const handleContactEnded = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactEnded() - Contact has ended successfully');
    console.log(contact.getState())
    updateContacts(contact);

    // Add your custom code here
  };

  const handleContactDestroyed = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactDestroyed() - Contact will be destroyed');
    console.log(contact.getState())

    // Add your custom code here
  };

  const handleContactMissed = (contact) => {
    console.log('CDEBUG >> ContactEvents.handleContactMissed() - Contact was missed');
  };

  const updateContacts = (newContacts) => {
    // 创建一个新的 session 对象，其中包含更新后的 contacts
    const updatedSession = {
      ...session, // 复制原始 session 对象的其他属性
      contact: newContacts, // 更新 contacts
      contactStatus: newContacts.getState().type, // 更新 contacts
    };

    // 使用 setSession 函数更新 session 对象
    setSession(updatedSession);
  };

 

  const subscribeToContactEvents = (contact) => {
    console.log('contact',contact);
    console.log("ContactEvents - New Contact contactId: " + contact.contactId);
    console.log("ContactEvents - New Contact InitialContactId(): " + contact.getInitialContactId());
    updateContacts(contact);
    // Route to the respective handler
    contact.onIncoming(handleContactIncoming);
    contact.onAccepted(handleContactAccepted);
    contact.onConnecting(handleContactConnecting);
    contact.onConnected(handleContactConnected);
    contact.onEnded(handleContactEnded);
    contact.onDestroy(handleContactDestroyed);
    contact.onMissed(handleContactMissed);

  };

  

  return subscribeToContactEvents;
};

export default useContactEvents;