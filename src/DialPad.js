import React, { useState } from 'react';
import './DialPad.css';

const DialPad = ({ onNumberPress, onMakeCall, onEndCall }) => {
  const [phoneNumber, setPhoneNumber] = useState('+');

  // 处理点击数字按钮事件
  const handleNumberPress = (number) => {
    if (phoneNumber.length < 12) { // 控制输入长度
      setPhoneNumber((prevPhoneNumber) => prevPhoneNumber + number);
    }
  };

  // 处理点击拨号按钮事件
  const handleMakeCallClick = () => {
    onMakeCall(phoneNumber);
  };

  // 处理点击删除按钮事件
  const handleDeleteClick = () => {
    setPhoneNumber((prevPhoneNumber) => prevPhoneNumber.slice(0, -1));
  };

  return (
    <div className="dial-pad">
      <div id="output">{phoneNumber}</div>
      <div className="row">
        <div className="digit" onClick={() => handleNumberPress('1')}>1</div>
        <div className="digit" onClick={() => handleNumberPress('2')}>2<div className="sub">ABC</div></div>
        <div className="digit" onClick={() => handleNumberPress('3')}>3<div className="sub">DEF</div></div>
      </div>
      <div className="row">
        <div className="digit" onClick={() => handleNumberPress('4')}>4<div className="sub">GHI</div></div>
        <div className="digit" onClick={() => handleNumberPress('5')}>5<div className="sub">JKL</div></div>
        <div className="digit" onClick={() => handleNumberPress('6')}>6<div className="sub">MNO</div></div>
      </div>
      <div className="row">
        <div className="digit" onClick={() => handleNumberPress('7')}>7<div className="sub">PQRS</div></div>
        <div className="digit" onClick={() => handleNumberPress('8')}>8<div className="sub">TUV</div></div>
        <div className="digit" onClick={() => handleNumberPress('9')}>9<div className="sub">WXYZ</div></div>
      </div>
      <div className="row">
        <div className="digit">*</div>
        <div className="digit" onClick={() => handleNumberPress('0')}>0</div>
        <div className="digit">#</div>
      </div>
      <div className="botrow">
      <i className="fa fa-long-arrow-left dig" aria-hidden="true" onClick={handleDeleteClick}></i>
        <div id="call" onClick={handleMakeCallClick}><i className="fa fa-phone" aria-hidden="true"></i></div>
        <i className="fa fa-star-o dig" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default DialPad;
