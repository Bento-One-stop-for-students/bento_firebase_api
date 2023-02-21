import {signInWithPopup} from 'firebase/auth'
import {auth,db,provider} from '../firebase.js'
import {setDoc, doc, serverTimestamp, getDocs,collection} from 'firebase/firestore'


//signUp call
export const handleSignUp = async(e) => {
    e.preventDefault();
    try {
        //Signup call from google and get user information
        const {user} = await signInWithPopup(auth,provider)
        const {uid,displayName, photoURL,email} = user
        
        //get branch code
        const splitEmail = email.split('.')
        const branchCode = splitEmail[1];

        //Setting the new user in firestore
        await setDoc(doc(db,'users',uid),{
            'name': displayName,
            'email': email,
            'img': photoURL,
            'branch': branchCode,
            'club': {
                'head': false,
                'name': ''
            },
            'timestamp': serverTimestamp()
        },{merge:true})

        //handle dispatch and payload
    }catch(err) {
        console.log(err)
    }
}

//updateUser
export const userInfo = async(data,uid) => { 
    try {
        //information from user form
        const {hostel,room_no,roll_no,mobile_no,gender} = data;
        await setDoc(doc(db,'users',uid),{
            'gender': gender,
            'hostel': hostel,
            'room_no':room_no,
            'roll_no':roll_no,
            'mobile_no':mobile_no
        },{merge:true})
    }catch(err) {
        console.log(err)
    }
}

//get All users
export const getAllUsers = async() => {
    try {
        const users = await getDocs(collection(db,'users'))
        users.forEach(user => user.data())
    }catch(err) {
        console.log(err)
    }
}


