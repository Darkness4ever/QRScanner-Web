import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import $api from "../api"
import './Home.css'

const HomeScreen = () => {
    const [hasPermissions, setHasPermissions] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet Scanned');
    const [showScanner, setShowScanner] = useState(false);
    const [personName, setPersonName] = useState(sessionStorage.getItem('fName') || '')
    const [eventID, setEventID] = useState(null);
    const [readPointId, setReadPointId] = useState(null);
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('')
    const [isResultVisible, setIsResultVisible] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();

    
    useEffect(() => {
        if(sessionStorage.getItem('fName') === null) {
            navigate('/')
        }

        $api.getDetails(sessionStorage.getItem('personId')).then(resp => {
            setEventID(resp.data.entity[0].eventId)
            setReadPointId(resp.data.entity[0].readPoints[0].readPointId)
        })
    },[])

  return (

    <div className='mainContainer'>
        <div className='headerContainer'>
            <text style={{fontSize : '60px', fontWeight:'bold',color:'white'}}>{`Hello ${personName} !!`}</text>
        </div>

        <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'50px'}}>
            <button className='scanButton' onClick = {() => setShowScanner(true)}>Scan QR</button>
        </div>

        {showScanner && (
            <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'50px'}}>
                <BarcodeScannerComponent
                width={'60%'}
                height={'60%'}
                onUpdate={(err, result) => {
                    if (result) {
                        setName('')
                        setTitle('')
                        setCompany('')
                        setScanned(true);
                        setIsLoading(true)
                        setIsResultVisible('true')
                        setText(result);
                        const payload = {
                          itemId : eventID,
                          portalId : 2,
                          readpointId: readPointId,
                          entityId : null,
                          tagNumber : result.text,
                          IsOverride: false,
                          itemInstanceId : null,
                          transactionType : 'TRTP002',
                          isDuplicateTransactionAllowed : false,
                          points : 0,
                          isverify : true
                        }
                        console.log('p : ', payload)
                        $api.addTagTransaction(payload).then(resp => {
                          let errorCode = resp.data.error.key
                          if(errorCode == 0 || errorCode == 34) {
                            console.log('temp : ', resp.data.entity)
                            setIsError(false)
                            let Name = resp.data.entity.fName + ' ' +  resp.data.entity.lName
                            setName(Name)
                            resp.data.entity.personAttributes.forEach(entry => {
                              if(entry.attributeName === 'Company')
                              setCompany(entry.attributeValue)
                              if(entry.attributeName === 'Title')
                              setTitle(entry.attributeValue)
                            })
                          }
                          else {
                            setIsError(true)
                            alert('User Not registered')
                            console.log('User is not registered')
                          }
                        })
                        setShowScanner(false)
                        setIsLoading(false)
                        // setShowScanner(false)
                    }
                   
                }}
                />
        
        </div>
        )}

        {/* <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'150px'}}>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>
                    User is not registered
                </text>
        </div> */}
    </div>
  )
}

export default HomeScreen