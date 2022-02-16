import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import LogoutIcon from '@mui/icons-material/Logout';
import 'font-awesome/css/font-awesome.min.css';
import Loader from "react-js-loader";
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
    const [company, setCompany] = useState('Marvel');
    const [title, setTitle] = useState('Spiderman')
    const [isResultVisible, setIsResultVisible] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState('Scan QR')
    const [isCloseScan, setIsCloseScan] = useState(false)
    const [welcomeMessage, setWelcomeMessage] = useState('')

    let navigate = useNavigate();

    
    useEffect(() => {
        window.scroll(0,0)
        if(sessionStorage.getItem('fName') === null) {
            navigate('/')
        }

        $api.getDetails(sessionStorage.getItem('personId')).then(resp => {
            setEventID(resp.data.entity[0].eventId)
            setReadPointId(resp.data.entity[0].readPoints[0].readPointId)
        })
    },[])

    const handleScanButton = (val) => {
        
        if(val){
        setShowScanner(true)
        setErrorMessage('')
        setButtonText('Close Scan')
        }else {
            setShowScanner(false)
            setErrorMessage('')
            setButtonText('Scan QR')
        }
        setName('')
        setCompany('')
        setTitle('')
        setIsCloseScan(!isCloseScan)
        setWelcomeMessage('')
        console.log('val : ', isCloseScan)
    }

   const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
   } 

  return (

    <div className='mainContainer'>
        <div className='headerContainer'>
            <div onClick = {() => handleLogout()} style = {{flex : '0.5', alignSelf : 'flex-end', margin : '10px 10px 10px 0px', }}>
                <LogoutIcon fontSize='large' />
                
            </div>
            <text style={{fontSize : '60px', fontWeight:'bold',color:'white', alignSelf : 'center', flex : "1", }}>{`Hello ${personName} !`}</text>
        </div>

        <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'50px'}}>
            <button className='scanButton' onClick = {() => {
                handleScanButton(!isCloseScan)
            }
                }>{buttonText}</button>
        </div>

        {showScanner && (
            <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'50px'}}>
                <BarcodeScannerComponent
                width={'60%'}
                height={'60%'}
                onUpdate={(err, result) => {
                    if (result) {
                        setErrorMessage('')
                        setName('')
                        setTitle('')
                        setCompany('')
                        setScanned(true);
                        setIsLoading(true)
                        setIsResultVisible('true')
                        handleScanButton(!isCloseScan)
                        
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
                          points : 5,
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
                              setWelcomeMessage('Welcome')
                            })
                          }
                          else {
                            setIsError(true)
                            setErrorMessage('User is not registered')
                            setIsResultVisible(false)
                            setName('')
                            setTitle('')
                            setCompany('')
                            setWelcomeMessage('Welcome')
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

        {isError && !showScanner && !isLoading && !isResultVisible &&(
            <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'150px'}}>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>
                    {errorMessage}
                </text>
            </div>
        )}
        {!showScanner && isResultVisible && !isError && !isLoading && (
            <div  style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'150px', flexDirection : 'column'}}>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{isError ? '' : `${welcomeMessage}`}</text>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{name}</text>
                {title === '' ? 
                        <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{company}</text>  :
                        
                            <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{`${title}, ${company}`}</text>
                        
                }
        </div>
        )}

        {isLoading && (
            <div>
                <Loader type = 'spinner-circle' size = {70} />
            </div>
        )}

        {/* <div  style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'150px', flexDirection : 'column'}}>
            <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>Welcome</text>
            <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>Tom Holland</text>
            {title === '' ? 
                      <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{company}</text>  :
                      
                        <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{`${title}, ${company}`}</text>
                      
            }
        </div> */}
    </div>
  )
}

export default HomeScreen