import React, { useRef, useEffect, useState } from 'react';

import utilStyles from './input.module.css';

const Input = ({type, value, onChange, minWidth}) => {
  const inputRef = useRef(null); // Ref для основного инпута
  const tempSpanRef = useRef(null); // Ref для временного span
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    // Устанавливаем шрифт, как у инпута
    context.font = `${getComputedStyle(inputRef.current).fontSize} ${getComputedStyle(inputRef.current).fontFamily}`;
  
    const minWidthLocal = 45; // Минимальная ширина
    const maxWidth = 270; // Максимальная ширина
    const textWidth = context.measureText(value || '').width;
  
    const newWidth = Math.min(maxWidth, Math.max(minWidth || minWidthLocal, textWidth + 20)); // +20 для padding
    if (newWidth >= maxWidth) {
      inputRef.current.style.width = `${maxWidth}px`;
    } else {
      inputRef.current.style.width = `${newWidth}px`;
    }
  
    inputRef.current.style.width = `${newWidth}px`;
  }, [value]);

  return (
    <input 
      ref={inputRef} // Привязываем ref к инпуту
      className={utilStyles.input}     
      type='text'
      inputmode="numeric" // Цифровая клавиатура на мобильных устройствах
      value={value}
      onChange={onChange}
      // pattern="\d*"//number only
    />
      
  );
};

export default Input;
