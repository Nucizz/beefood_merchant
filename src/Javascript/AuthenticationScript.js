import { app } from '../firebase-config';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getDoc, getDocs, deleteDoc, doc, getFirestore, query, where, or, updateDoc, limit } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
        } catch {
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
    const newMerchantRequestDB = collection(getFirestore(), 'newMerchantRequest')
    const userDB = collection(getFirestore(), 'user')
    const storage = getStorage();
    const docRef = doc(newMerchantRequestDB, token);
    try {
        const userRef = await createUserWithEmailAndPassword(
            getAuth(app),
            email,
            password
        )

        updateDoc(docRef, {'used': true})

        const userPictureRef = ref(storage, ('userprofile/' + userRef.user.email + '.jpg'))
        await uploadBytes(userPictureRef, profilePicture)

        await addDoc(userDB, {
            ref: userRef.providerId,
            name: name,
            email: email,
            phone: phone,
            campus: campus,
            location: location,
            profilePicture: userPictureRef.name
        })

        await deleteDoc(docRef);
        
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
    } catch {
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

export const authenticateLogout = async (redirect = '/login') => {
    signOut(getAuth()).then(() => {
        window.location.href = redirect
    }).catch((e) => {
        window.alert("SERVER ERROR!")
    });
}

export const getUserData = async (email) => {
    const userDB = collection(getFirestore(), 'user')
    const snapshots = await getDocs(query(userDB, where('email', '==', email), limit(1)))

    if (!snapshots.empty) {
        const userData = snapshots.docs[0].data();
        const profilePictureRef = ref(getStorage(), userData.profilePicture)
        userData.profilePicture = await getDownloadURL(profilePictureRef)
        return userData;
    } else {
        return null;
    }
}