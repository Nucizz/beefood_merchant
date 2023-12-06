import { collection, getFirestore, doc, addDoc, getDocs, updateDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const addProduct = async (merchantRef, name, description, price, image) => {
    try {
        const merchantDocRef = doc(getFirestore(), 'merchant', merchantRef.id)
        const productDB = collection(merchantDocRef, "product")
        const thumbnailPicturePath = 'product/' + merchantRef.email + '/' + name + '.jpg'
        const thumbnailPictureRef = ref(getStorage(), thumbnailPicturePath)
        await uploadBytes(thumbnailPictureRef, image)

        await addDoc(productDB, {
            name: name,
            description: description,
            price: price,
            thumbnailPicture: thumbnailPicturePath,
            totalSale: 0,
            available: true
        })

        return "0"
    } catch(e) {
        console.log(e)
        return "Something went wrong."
    }   
}

export const getProduct = async (merchantId) => {
    const productList = []
    try {
        const merchantDocRef = doc(getFirestore(), 'merchant', merchantId)
        const productDB = collection(merchantDocRef, "product")
        const snapshots = await getDocs(productDB);
        if (!snapshots.empty) {
            for (const doc of snapshots.docs) {
                const productData = doc.data();
                productData.id = doc.id;
        
                if (productData.thumbnailPicture) {
                    const thumbnailRef = ref(getStorage(), productData.thumbnailPicture);
                    try {
                        productData.thumbnailPicture = await getDownloadURL(thumbnailRef);
                    } catch (e) {
                        console.e(e);
                        productData.thumbnailPicture = null;
                    }
                }
        
                productList.push(productData);
            }
        }
        return productList
    } catch (e) {
        console.error(e)
        return productList
    }
}

export const changeProductAvailbility = async (merchantId, productId) => {
    try {
        const merchantDocRef = doc(getFirestore(), 'merchant', merchantId)
        const productRef = doc(merchantDocRef, "product", productId)

        const queueData = await getDoc(productRef);
        const productData = queueData.data()

        await updateDoc(productRef, { available: !productData.available })
        return !productData.available ? "Available" : "Unavailable"
    } catch (e) {
        console.error(e)
        return null
    }
}

export const updateProduct = async (merchantId, productId, name, description, price, image, path) => {
    try {
        const merchantDocRef = doc(getFirestore(), 'merchant', merchantId)
        const productRef = doc(merchantDocRef, "product", productId)

        if(image !== null) {
            const thumbnailPictureRef = ref(getStorage(), path)
            await uploadBytes(thumbnailPictureRef, image)
        }

        await updateDoc(productRef, { 
            name: name,
            description: description,
            price: price,
        })
        return "0"
    } catch (e) {
        console.error(e)
        return "Something went wrong."
    }
}

export const deleteProduct = async (merchantId, productId) => {
    try {
        const merchantDocRef = doc(getFirestore(), 'merchant', merchantId)
        const productRef = doc(merchantDocRef, "product", productId)

        await deleteDoc(productRef)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}
