import React from 'react';

export default ({ label, input: {value: omitValue, ...inputProps }, meta: {error, touched}, omitMeta, ...props }, ) => {
  return (
    <div style={{marginBottom: '30px'}}>
      <label style={{marginRight: '20px'}}>{label}</label>
      <input className="" type='file' {...inputProps} {...props} style={{marginBottom: '5px'}} />
         <div className="red-text" style={{marginBottom: '20px'}}>
        {touched && error}
      </div>
    </div>

    

  )
}