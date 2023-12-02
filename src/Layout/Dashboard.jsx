import { useState, useEffect } from "react";
import { getTodayOrderList } from "../Javascript/OrderHandler";
import { ChangePhoto } from "../Class/Component";

export default function DashboardLayout({merchant}) {
    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodayOrderList = async () => {
            try {
                const todayOrderList = await getTodayOrderList(merchant.id);
                setOrder(todayOrderList);
            } catch (e) {

            } finally {
                setIsLoading(false);
            }
        }
        fetchTodayOrderList();
    }, [merchant.id])
  
    if (isLoading) {
      return <></>
    }

    return (
        <div className="w-full gap-4 flex flex-col">
            <h1 className="text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">Dashboard</h1>
            
            <GeneralInformation merchant={merchant} />

            <ToDoLayout orderRef={order} />

        </div>
    )
}

function GeneralInformation({merchant}) {
    return (
        <div className="w-full rounded-lg py-4 bg-gray-200 lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2 flex lg:flex-row flex-col lg:items-start items-center lg:gap-8 gap-4">

            <ChangePhoto photoRef={merchant.profilePicture} classSize={"w-36 h-36"} disabled={true} />

            <div className="flex flex-col lg:items-start items-center">
                <span className="xl:text-6xl md:text-4xl text-2xl font-bold text-center md:text-left">{merchant.name}</span>
                <p className="xl:text-2xl lg:text-xl md:text-lg text-md text-gray-500 text-center md:text-left">{merchant.description}</p>
            </div>

        </div>
    )
}

function ToDoLayout({orderRef}) {
    var needConfirmation = 0
    var needProcessing = 0
    var onProcess = 0
    var waitingPickup = 0
    var finished = 0

    useEffect(() => {
        if(orderRef) {
            for(const order of orderRef) {
                switch (order.status) {
                    case "NEED_CONFIRMATION":
                        needConfirmation++
                        break
                    case "NEED_PROCESSING":
                        needProcessing++
                        break
                    case "ON_PROCESS":
                        onProcess++
                        break
                    case "WAITING_PICKUP":
                        waitingPickup++
                        break
                    case "FINISHED":
                        finished++
                        break
                    default:
                        break
                }
            }
        }
    }, [orderRef, needConfirmation, needProcessing, onProcess, waitingPickup, finished])


    return (
        <div className="w-full flex flex-col xl:gap-4 md:gap-3 gap-2">
            <h2 className="w-full text-lg md:text-xl lg:text-2xl font-bold">Your to-do List</h2>
            <ol className="w-full grid grid-cols-2 gap-y-5 lg:grid-cols-3 xl:grid-cols-5 rounded-lg py-4 bg-gray-200">
                <li className="flex flex-col justify-center items-center w-full border-r-2 border-gray-400">
                    <span className="text-xl font-bold text-amber-500">{needConfirmation}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center">Need Confirmation</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full lg:border-r-2 border-gray-400">
                    <span className="text-xl font-bold text-amber-500">{needProcessing}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center">Need Processing</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full border-r-2 lg:border-r-0 xl:border-r-2 border-gray-400">
                    <span className="text-xl font-bold text-amber-500">{onProcess}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center">On Process</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full lg:border-r-2 border-gray-400">
                    <span className="text-xl font-bold text-amber-500">{waitingPickup}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center">Waiting Pickup</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full col-span-2 lg:col-span-1">
                    <span className="text-xl font-bold text-amber-500">{finished}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center">Order Finished</span>
                </li>
            </ol>
        </div>
    )
}