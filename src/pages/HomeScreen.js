import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
import QrScan from 'react-qr-reader'
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import Dialog from '@mui/material/Dialog';

import 'font-awesome/css/font-awesome.min.css';
import Loader from "react-js-loader";
import $api from "../api"
import './Home.css'
import { DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

// const demoEventNames =[
//     {
//         id : 1,
//         name : 'Test1'
//     },
//     {
//         id : 2,
//         name : 'Test2'
//     },
//     {
//         id : 3,
//         name : 'Test3'
//     },
//     {
//         id : 4,
//         name : 'Test4'
//     },
//     {
//         id : 5,
//         name : 'Test5'
//     },
//     {
//         id : 6,
//         name : 'Test6'
//     },
//    {
//         id : 7,
//         name : 'Test7'
//     },
//    {
//         id : 8,
//         name : 'Test8'
//     },
// ]

const HomeScreen = () => {
    // const [hasPermissions, setHasPermissions] = useState(null);
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
    const [eventName, setEventName] = useState('')
    const [showEventList, setShowEventList] = useState(false)
    const [eventData, setEvenData] = useState([])

    let navigate = useNavigate();

    
    useEffect(() => {
        window.scroll(0,0)
        if(sessionStorage.getItem('fName') === null) {
            navigate('/')
        }


        //setting up the event name.
        $api.getDetails(sessionStorage.getItem('personId')).then(resp => {
            console.log('new data', resp.data)
            if(resp.data.entity.length == 1) {
                setEventName(resp.data.entity[0].eventName)
                setEventID(resp.data.entity[0].eventId)
                setReadPointId(resp.data.entity[0].readPoints[0].readPointId)
            } else {
                setEvenData(resp.data.entity)
                setShowEventList(true)
            }    
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


   const handleEventChange = () => {
    if(eventData.length > 0) {
        setShowEventList(true)
    }
   }

   const handleEventName = eventName => {
    console.log(eventName)
    console.log('data', eventData)
    setShowScanner(false)
    setButtonText('Scan QR')
    setIsResultVisible(false)
    setName('')
    setCompany('')
    setTitle('')
    const eventIndex  =  eventData.findIndex(event => event.eventName === eventName)
    console.log(eventData[eventIndex])
    console.log('eventIndex', eventIndex)
        setEventName(eventName)
        setEventID(eventData[eventIndex].eventId)
        setReadPointId(eventData[eventIndex].readPoints[0].readPointId)
        setShowEventList(false)
   }

  return (
    
    <div className='mainContainer'>
        <div className='headerContainer'>
            <div className='headerContainerFirstRow'>
                <div onClick={handleEventChange} style={{display :'flex', alignItems : 'center', justifyContent: 'center',margin : '11px 10px 10px 10px'}}  >
                    <div>
                        <EventIcon fontSize='large'  />
                    </div>
                    <div style={{paddingLeft : '5px', color:'white', fontWeight : 'bold', fontSize : '20px'}}> {eventName} </div>
                </div>
                <div onClick = {() => handleLogout()} style = {{ margin : '10px 10px 10px 0px', }}>
                    <LogoutIcon fontSize='large' />
                
                </div>
                
            </div>
            <text style={{fontSize : '40px', fontWeight:'bold',color:'white', alignSelf : 'center', flex : "1", }}>{`Hello ${personName} !`}</text>
        </div>

        {!showEventList && (
            <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'50px'}}>
                <button className='scanButton' onClick = {() => {
                    handleScanButton(!isCloseScan)
                }
                    }>{buttonText}
                </button>
            </div>
        )}

        {showEventList && (
            <div>
                <Dialog 
                open = {showEventList} 
                PaperProps={{
                    style: {
                      backgroundColor: '#484848',
                      borderRadius : 30 
                    }
                  }}
                >
                    <DialogTitle>
                        <Typography color='white' variant='h5' style={{fontWeight : 'bold'}}>
                            {`Event List`}  
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <List 
                            sx = {{
                                width : '100%',
                                maxWidth : 360,
                                bgcolor : '#484848',
                                maxHeight : 200,
                                overflow: 'auto',	
                            }}
                        >
                            {eventData.map(event => (
                                <ListItem  onClick = {() => handleEventName(event.eventName)}>
                                    <ListItemButton>
                                        <ListItemText  primary = {event.eventName} style = {{color : 'white'}}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                </Dialog>
            </div>
        )}

        {showScanner && !showEventList &&(
            <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop : '10%',position : 'relative', width:'300px', height :'300px'}}>
                <QrScan
                width={'60%'}
                height={'60%'}
                onScan={(result) => {
                    if (result) {
                        console.log(result)
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
                          tagNumber : result,
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

        {isError && !showScanner && !isLoading && !isResultVisible && !showEventList &&(
            <div style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'150px'}}>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>
                    {errorMessage}
                </text>
            </div>
        )}
        {!showScanner && !showEventList && isResultVisible && !isError && !isLoading && (
            <div  style={{alignItems : 'center', justifyContent:'center', display:'flex', marginTop:'150px', flexDirection : 'column'}}>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{isError ? '' : `${welcomeMessage}`}</text>
                <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{name}</text>
                {title === '' ? 
                        <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{company}</text>  :(
                        <>
                        <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{`${title}`}</text>
                        <text style={{fontSize : '30px', fontWeight : 'bold', color : 'ghostwhite'}}>{`${company}`}</text>
                        </>
                        )
                        
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