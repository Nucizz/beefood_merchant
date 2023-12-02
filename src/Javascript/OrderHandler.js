import { collection, getDocs, getFirestore, query, where, Timestamp } from 'firebase/firestore'
import { onMessage, getMessaging } from 'firebase/messaging'
import { app } from '../firebase-config'

export const getTodayOrderList = async (merchantId) => {
    const currentDate = new Date()
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0)
    
    const orderDB = collection(getFirestore(), 'order')
    const snapshots = await getDocs(
        query(orderDB, 
            where('merchantId', '==', merchantId),
            where('timestamp', '>=', Timestamp.fromDate(startOfDay))
        )
    )

    if (!snapshots.empty) {
        return snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } else {
        return null
    }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(getMessaging(app), (payload) => {
        console.log("payload", payload)
        resolve(payload)
    })
})
