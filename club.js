import {db} from '../firebase.js'
import {setDoc, doc, serverTimestamp, getDocs,collection,getDoc, query, where} from 'firebase/firestore'

//get all club information in priority order
export const getAllClubs = async() => {
    try {
        let clubs = []
        const clubData = await getDocs(collection(db,'club'));
        clubData.forEach(club => clubs.push(club.data()))
        return clubs;
    }catch(err) {
        console.log(err)
    }
}

//get club information
export const getClub = async(clubName) => {
    try {
        const q = query(collection(db,'club',where('clubName','==',clubName)))
        const club = await getDoc(q);
        return club.data();
    }catch(err) {
        console.log(err)
    }
}

//update club Data
export const updateClub = async(data) => {
    try {
        const {id} = data;
        await setDoc(doc(db,'club',id),{
            ...data,
        },{merge:true})
    }catch(err) {
        console.log(err)
    }
}