import { collection, getDocs, getFirestore, query, where, Timestamp, getDoc, doc } from 'firebase/firestore'

export const getTodayOrderList = async (merchantId) => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0)
    const startOfDay = Timestamp.fromDate(currentDate)
    
    const orderDB = collection(getFirestore(), 'order')
    const orderSnapshots = await getDocs(
        query(orderDB,
            where('merchantReferenceID', '==', merchantId)
        )
    )

    console.log("FETCHING DATA!")

    if (!orderSnapshots.empty) {
        const result = []
        for(const orderDoc of orderSnapshots.docs) {
            const orderData = orderDoc.data()
            if(orderData.createTime >= startOfDay) {
                orderData.id = orderDoc.id

                try {
                    const userRef = doc(getFirestore(), 'user', orderData.userReferenceID);
                    const userData = await getDoc(userRef);
                    orderData.name = userData.data().name;
                } catch(e) {
                    console.log(e)
                    orderData.name = "Undefined"
                }
                
                result.push(orderData)
            }
        }
        return result
    } else {
        return null
    }
}


