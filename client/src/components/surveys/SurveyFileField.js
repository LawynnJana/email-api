import React from 'react';

export default ({ label, input: {value: omitValue, ...inputProps }, meta: omitMeta, ...props }) => {
  return (
    <div style={{marginBottom: '30px'}}>
      <label style={{marginRight: '20px'}}>{label}</label>
      <input className="" type='file' {...inputProps} {...props} style={{marginBottom: '10px'}} />
    </div>

    

  )
}