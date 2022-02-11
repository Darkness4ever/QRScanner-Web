import React, { Component } from 'react'
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const Test =()=> {
    const [data, setData] = React.useState("Not Found");
  
    return (
      <div className='test'>
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) setData(result.text);
            else setData("Not Found");
          }}
        />
        <p>{data}</p>
      </div>
    );
  }

export default Test