import React,{useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import './Login.css'
import $api from "../api"

export const LoginScreen = () => {

let navigate = useNavigate();


    
const [userName, setUserName] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState(false)
const [errorMessage, setErrorMessage] = useState('')
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
    // console.log('FN', sessionStorage.getItem('fName'))
    window.scroll(0,0)
    if(sessionStorage.getItem('fName') != null) {
        navigate('/home', {replace : true})
    }
},[])

const handleUsername = e => {
    setUserName(e.target.value)
}

const handlePassword = e => {
    setPassword(e.target.value)
}

const handleSubmit = (event) => {
    event.preventDefault();
    // navigate('/home', {replace : true})

    
    // console.log('Name ', userName)
    // if(userName === '') {
    //     setError(true)
    //     setErrorMessage('Please enter username')
    //     return
    // }
    // if(password === '') {
    //     setError(true)
    //     setErrorMessage('Please enter password')
    //     return
    // }
    // setError(false)
    // $api.authenticateUser({ userName, password }).then(response => console.log(response))
    setIsLoading(true)
    $api.authenticateUser({ userName, password }).then(response => {
        // if (response.data.error.key !== 0) {
        //   console.log("Error")
        //   setErrorMessage(response.data.error.value)
        //   setInvalidFlag(true);
          
        // sessionStorage.setItem("entityId", response.data.entity.entityId);
        // AsyncStorage.setItem("entityId", response.data.entity.personId);
        // AsyncStorage.setItem('fName', response.data.entity.fName);
        
        console.log('error Code : ', response.data.error.key)

        if(response.data.error.key !== 0 ) {
            setError(true)
            setErrorMessage('Invalid Credentials!')
            return
        }
        
        const personId = response.data.entity.personId;
        const fName = response.data.entity.fName
        sessionStorage.setItem('personId', personId)
        sessionStorage.setItem('fName',fName)
        console.log('fName', fName)
        // console.log('PID : ', personId)
        // alert(fName)
        // navigation.navigate('Home', {
        //     personId,
        //     fName
        // })

        navigate('/home', {replace : true})


        // return
        // setLoader(false)
        
      
    //   }
    })
      .catch(err => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
        
      })

}

  return (
    <div className='mainContainer'>
        <div className='imageContainer'>
            <img src = {require('../assets/logo1.png')} style={{height : 300, width: 300}} alt='logo'/>
        </div>
        <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', marginBottom:'10px', flexDirection : 'column'}}>
            <text style={{fontSize : '50px', marginRight : '10px', color : 'darkblue', fontWeight : 'bold'}}>EventTraQ </text>
            <text style={{fontSize : '30px', color : 'darkblue'}}> by AAFRID</text>
        </div>
        <div className='errorContainer'>
            <text style={{color :'red'}}>{errorMessage}</text>
        </div>
        <form onSubmit={handleSubmit}>
            <div className='inputContainer' style={{marginBottom:'30px'}}>
                <input type='text' placeholder='Enter username' className='textInput' onChange={handleUsername} value={userName} required/>
            </div>

            <div className='inputContainer'>
                <input type='password' placeholder='Enter password' className='textInput' onChange={handlePassword} value={password} required/>
            </div>

            <div style={{alignItems : 'center', justifyContent:'center', display:'flex'}}>
                {/* <button style={{width : '80vw', height : '40px', fontSize :'x-large', borderRadius : '20px', borderColor : 'cyan'}}>Login</button> */}
                {!isLoading && (
                <input type='submit' value='Login' style={{width : '80vw', height : '40px', fontSize :'x-large', borderRadius : '20px', backgroundColor : 'cyan'}}/>

                )}
                {isLoading && (
                <Loader type = 'spinner-circle' size = {50} />
                )}
            </div>
        </form>
    </div>
  )
}
