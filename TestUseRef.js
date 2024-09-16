// src/TestUseRef.js
import React, { useRef } from 'react';

function TestUseRef() {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      console.log('Input Value:', inputRef.current.value);
    } else {
      console.error('Input reference is null.');
    }
  };

  return (
    <div>
      <input type="text" placeholder="Type something..." ref={inputRef} />
      <button onClick={handleClick}>Log Input Value</button>
    </div>
  );
}

export default TestUseRef;
