import { app, getFCMToken } from '../firebase-config';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail  } from 'firebase/auth'
import { addDoc, collection, getDoc, getDocs, deleteDoc, doc, getFirestore, query, where, or, updateDoc, limit } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getProduct } from './ProductHandler';

export const authenticateRegisterToken = async (name, email, phone) => {
    const newMerchantRequestDB = collection(getFirestore(), 'newMerchantRequest')
    const currentDate = new Date()

    const existingSnapshot = await getDocs(query(newMerchantRequestDB,
        or(
            where('email', '==', email),
            where('phone', '==', phone),
            where('name', '==', name)
        )
    ))

    for (const doc of existingSnapshot.docs) {
        if(doc.data().used === true) {
            return '0'
        }
        try {
            await deleteDoc(doc.ref);
        } catch(e) {
            console.log(e)
            return '0'
        }
    }

    const expirationDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000) // + 3 Days
    const ref = await addDoc(newMerchantRequestDB, {
            name : name,
            email : email,
            phone : phone,
            expirationDate: expirationDate,
            used: false
        })
    return ref.id
}

export const authenticateRegister = async (name, email, phone, password, token, campus, location, profilePicture) => {
    const merchantDB = collection(getFirestore(), 'merchant')
    const docRef = doc(getFirestore(), 'newMerchantRequest', token);
    try {
        const merchantRef = await createUserWithEmailAndPassword(
            getAuth(app),
            email,
            password
        )

        updateDoc(docRef, {'used': true})

        const profilePicturePath = 'userprofile/' + merchantRef.user.email + '.jpg'
        const merchantPictureRef = ref(getStorage(), profilePicturePath)
        await uploadBytes(merchantPictureRef, profilePicture)

        await addDoc(merchantDB, {
            name: name,
            email: merchantRef.user.email,
            phone: phone,
            description: "This is a new merchant.",
            campus: campus,
            location: location,
            profilePicture: profilePicturePath,
            openTime: "09:00:00",
            closeTime: "17:30:00",
            halal: false,
            rating: -1,
            queueTime: -1,
        })
        
        return "0"
    } catch(e) {
        console.log(e)
        return "Something went wrong."
    }
}

export const validateToken = async (token, email, nameRef, phoneRef) => {
    const newMerchantRequestDB = collection(getFirestore(), 'newMerchantRequest')
    const docRef = doc(newMerchantRequestDB, token);
    try {
        const queueData = await getDoc(docRef);
        const data = queueData.data()
        const currentDate = new Date().getTime();
        
        if(data.expirationDate.toMillis() < currentDate) {
            return "Token expired!"
        } else if (data.used === true) {
            return "You've already registered."
        } else if (data.email !== email) {
            return "a Different email was used!"
        } else {
            nameRef(data.name)
            phoneRef(data.phone)
            return "0"
        }
    } catch(e) {
        console.log(e)
        window.location.href = '/register/unlisted'
    }
}

export const authenticateLogin = async (email, password) => {
    await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
    )
}

export const authenticateLogout = async (id, redirect = '/login') => {
    await setMerchantFCMToken(id, null)
    signOut(getAuth()).then(() => {
        window.location.href = redirect
    }).catch((e) => {
        window.alert("SERVER ERROR!")
    })
}

export const getMerchantData = async (email) => {
    const merchantDB = collection(getFirestore(), 'merchant')
    const snapshots = await getDocs(query(merchantDB, where('email', '==', email), limit(1)))
    const FCMToken = await getFCMToken()

    if (!snapshots.empty) {
        const merchantData = snapshots.docs[0].data()
        merchantData.id = snapshots.docs[0].id
        await setMerchantFCMToken(merchantData.id, FCMToken)
        merchantData.product = await getProduct(merchantData.id)
        const profilePictureRef = ref(getStorage(), merchantData.profilePicture)
        try {
            merchantData.profilePicture = await getDownloadURL(profilePictureRef)
        } catch{
            merchantData.profilePicture = null
        }
        return merchantData
    } else {
        return null
    }
}

export const updateMerchantData = async (id, name, description, campus, location, profilePicture, openTime, closeTime) => {
    const docRef = doc(getFirestore(), 'merchant', id)

    try {
        const queueData = await getDoc(docRef);
        const merchantData = queueData.data()
        
        if(profilePicture) {
            const merchantPictureRef = ref(getStorage(), ('userprofile/' + merchantData.email + '.jpg'))
            await uploadBytes(merchantPictureRef, profilePicture)
        }

        await updateDoc(docRef, {
            name: name || merchantData.name,
            campus: campus || merchantData.campus,
            location: location || merchantData.location,
            description: description || merchantData.description,
            openTime: openTime || merchantData.openTime,
            closeTime: closeTime || merchantData.closeTime
        })

        return await getMerchantData(merchantData.email)
    } catch(e) {
        console.log(e)
        return null
    }
}

export const sendPasswordResetMail = async (email) => {
    await sendPasswordResetEmail(getAuth(), email);
}

export const updateMerhcantHalal = async (id) => {
    const docRef = doc(getFirestore(), 'merchant', id)

    try {
        const queueData = await getDoc(docRef);
        const merchantData = queueData.data()

        await updateDoc(docRef, {
            halal: !merchantData.halal,
        })

        return "0"
    } catch(e) {
        console.log(e)
        return "Something went wrong."
    }
}

export const setMerchantFCMToken = async (id, token) => {
    const docRef = doc(getFirestore(), 'merchant', id)
    try {
        await updateDoc(docRef, {
            FCMToken: token
        })
    } catch(e) {
        console.log(e)
    }
}