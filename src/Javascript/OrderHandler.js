import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
    Timestamp,
    getDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { getProduct } from "./ProductHandler";
import { updateMerchantStatistic } from "./MerchantHandler";

export const getOrderList = async (merchantId, date = null) => {
    const startOfDate = new Date();
    const endOfDate = new Date();
    if (date) {
        startOfDate.setDate(date.getDate());
        endOfDate.setDate(date.getDate());
    }
    const startOfDay = Timestamp.fromMillis(startOfDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = Timestamp.fromMillis(endOfDate.setUTCHours(23, 59, 59, 0));

    const orderDB = collection(getFirestore(), "order");
    const orderSnapshots = await getDocs(
        query(orderDB, where("merchantReferenceID", "==", merchantId))
    );

    console.log("FETCHING DATA FOR " + startOfDate);

    if (!orderSnapshots.empty) {
        const result = [];
        for (const orderDoc of orderSnapshots.docs) {
            const orderData = orderDoc.data();
            if (
                orderData.createTime >= startOfDay &&
                orderData.createTime <= endOfDay
            ) {
                orderData.id = orderDoc.id;

                try {
                    const userRef = doc(
                        getFirestore(),
                        "user",
                        orderData.userReferenceID
                    );
                    const userData = await getDoc(userRef);
                    orderData.name = userData.data().name;
                } catch (e) {
                    console.log(e);
                    orderData.name = "Undefined";
                }

                orderData.orderItems = await getOrderItems(merchantId, orderData.id);
                orderData.userFCMToken = await getUserFCMToken(
                    orderData.userReferenceID
                );

                result.push(orderData);
            }
        }
        return result;
    } else {
        return null;
    }
};

export const getOrderItems = async (merchantId, orderId) => {
    const orderItemList = [];
    try {
        const orderDocRef = doc(getFirestore(), "order", orderId);
        const orderItemDB = collection(orderDocRef, "orderItems");
        const snapshots = await getDocs(orderItemDB);
        if (!snapshots.empty) {
            for (const doc of snapshots.docs) {
                const orderItemData = doc.data();
                orderItemData.id = doc.id;

                orderItemData.product = await getProduct(
                    merchantId,
                    orderItemData.productReferenceID
                );

                orderItemList.push(orderItemData);
            }
        }
        return orderItemList;
    } catch (e) {
        console.error(e);
        return orderItemList;
    }
};

export const updateOrderStatus = async (
    orderRef,
    statusIndex,
    setMerchantRef
) => {
    try {
        const orderDocRef = doc(getFirestore(), "order", orderRef.id);

        if (statusIndex === 4) {
            setMerchantRef(
                await updateMerchantStatistic(
                    orderRef.merchantReferenceID,
                    orderRef.totalPrice,
                    setMerchantRef
                )
            );
        }

        await updateDoc(orderDocRef, {
            status: statusIndex,
        });
    } catch (e) {
        console.log(e);
        return null;
    }
};

const getUserFCMToken = async (userId) => {
    try {
        const userDocRef = doc(getFirestore(), "user", userId);
        const queueData = await getDoc(userDocRef);
        const userData = queueData.data();
        return userData.FCMToken;
    } catch (e) {
        console.log(e);
        return null;
    }
};
