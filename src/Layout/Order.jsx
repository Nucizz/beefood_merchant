import {
    timeConverter,
    moneyConverter,
    statusConverter,
} from "../Javascript/Global";
import { JustifiedInfo } from "../Class/Component";
import { useState } from "react";
import "../App.css";
import { sendFCMMessage } from "../firebase-config";
import { getOrderList, updateOrderStatus } from "../Javascript/OrderHandler";

export function OrderDetails({ orderRef, setOrderRef, setOrderListRef, setMerchantRef = null }) {
    const [sortBy, setSortBy] = useState("productReferenceID");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleSort = (criteria) => {
        if (criteria === sortBy) {
            setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(criteria);
            setSortOrder("asc");
        }
    };

    const sortedOrderRef = orderRef.orderItems
        ? [...orderRef.orderItems].sort((a, b) => {
            const orderA = sortBy === "price" ? parseFloat(a[sortBy]) : a[sortBy];
            const orderB = sortBy === "price" ? parseFloat(b[sortBy]) : b[sortBy];

            if (sortOrder === "asc") {
                return orderA < orderB ? -1 : orderA > orderB ? 1 : 0;
            } else {
                return orderA > orderB ? -1 : orderA < orderB ? 1 : 0;
            }
        })
        : [];

    const handleStatusChange = async (status) => {
        if(orderRef.userFCMToken && orderRef.userFCMToken !== "") {
            switch (status) {
                case -1:
                    await sendFCMMessage(orderRef.userFCMToken, "Your order is cancelled!", "The merchant didn't confirm your order.")
                    break;
                case 2:
                    await sendFCMMessage(orderRef.userFCMToken, "Your order is on process!", "We got you, our best chef is now preparing your order.")
                    break;
                case 3:
                    await sendFCMMessage(orderRef.userFCMToken, "Your order is ready for pickup!", "Food's getting cold, go pick it up now.")
                    break;
                case 4:
                    await sendFCMMessage(orderRef.userFCMToken, "Your order is finished!", "How's your food? Tell us about your experience.")
                    break;
                default:
                    break;
            }
        }

        await updateOrderStatus(orderRef, status, setMerchantRef);
        setOrderListRef(await getOrderList(orderRef.merchantReferenceID));
        setOrderRef(null);
    }

    const setStatusButton = (status) => {
        const buttonStyle =
            "px-4 transition-all duration-300 md:h-9 h-8 rounded-md font-medium text-white";
        switch (status) {
            case 1:
                return (
                    <div className="w-full flex flex-row gap-5 items-center justify-between">
                        <button onClick={async () => await handleStatusChange(-1)} className={"w-1/2 bg-red-500 hover:bg-red-600 " + buttonStyle}>
                            Reject Order
                        </button>
                        <button onClick={async () => await handleStatusChange(2)} className={"w-1/2 bf-bg-color " + buttonStyle}>
                            Confirm Order
                        </button>
                    </div>
                );
            case 2:
                return (
                    <button onClick={async () => await handleStatusChange(3)} className={"w-full bf-bg-color " + buttonStyle}>
                        Ready to Pickup
                    </button>
                );
            case 3:
                return (
                    <button onClick={async () => await handleStatusChange(4)} className={"w-full bf-bg-color " + buttonStyle}>
                        Finish Order
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="md:ml-64 bg-white dark:bg-slate-800 md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2 md:w-1/2 w-4/5">
                <div className="w-full flex flex-row justify-between items-center">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
                        Order Details
                    </h2>
                    <button
                        class="mb-auto transition-all duration-300 text-lg text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-600 font-bold"
                        onClick={() => setOrderRef(null)}
                    >
                        &#x2716;
                    </button>
                </div>

                <div className="flex flex-col lg:text-lg xl:text-xl">
                    <JustifiedInfo title={"ID"} content={orderRef.id} />
                    <JustifiedInfo title={"Name"} content={orderRef.name} />
                    <JustifiedInfo
                        title={"Status"}
                        content={statusConverter(orderRef.status)}
                    />
                    <JustifiedInfo
                        title={"Price"}
                        content={moneyConverter(orderRef.totalPrice)}
                    />
                    <JustifiedInfo title={"Payment"} content={orderRef.payment} />
                    <JustifiedInfo
                        title={"Time"}
                        content={timeConverter(orderRef.createTime)}
                    />
                    <JustifiedInfo
                        title={"Pickup"}
                        content={timeConverter(orderRef.pickupTime)}
                    />
                </div>

                <table className="w-full table-auto rounded-lg overflow-hidden xl:text-lg lg:text-base text-sm">
                    <thead className="bg-white dark:bg-slate-800 border-b ">
                        <tr>
                            <th
                                className="p-2 lg:pl-4 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500"
                                onClick={() => handleSort("productReferenceID")}
                            >
                                Product Name{" "}
                                <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">
                                    {sortBy === "productReferenceID" &&
                                        (sortOrder === "asc" ? "▲" : "▼")}
                                </span>
                            </th>
                            <th
                                className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500"
                                onClick={() => handleSort("quantity")}
                            >
                                Quantity{" "}
                                <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">
                                    {sortBy === "quantity" && (sortOrder === "asc" ? "▲" : "▼")}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrderRef.length > 0 ? (
                            sortedOrderRef.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition-all duration-200 hover:bg-gray-300 hover:text-white bg-white dark:bg-slate-800 dark:hover:bg-slate-700 "
                                >
                                    <td className="p-2 cursor-pointer lg:pl-4 text-left text-black dark:text-white">
                                        {item.product.name}
                                    </td>
                                    <td className="p-2 cursor-pointer text-left text-black dark:text-white">
                                        {item.quantity}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-2 text-center bg-white dark:bg-slate-800 text-black dark:text-white"
                                >
                                    No items available in this order.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {setOrderListRef ? setStatusButton(orderRef.status) : null}
            </div>
        </div>
    );
}
