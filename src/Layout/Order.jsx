import { timeConverter } from "../Javascript/Global"
import '../App.css';

export function OrderDetails({orderRef, setOrderRef}) {
    return (
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="md:ml-64 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2 md:w-1/2 w-4/5">
                <h2 className="w-full text-lg md:text-xl lg:text-2xl font-bold" >Order Details</h2>

                <div className="flex flex-col lg:text-lg xl:text-xl">
                    <OrderDetailsList title={"ID"} content={orderRef.id} />
                    <OrderDetailsList title={"Name"} content={orderRef.name} />
                    <OrderDetailsList title={"Status"} content={orderRef.status} />
                    <OrderDetailsList title={"Price"} content={`Rp${orderRef.price}`} />
                    <OrderDetailsList title={"Time"} content={timeConverter(orderRef.time)} />
                </div>

                <button onClick={() => setOrderRef(null)} className="px-4 transition-all duration-300 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white">Close</button>

            </div>
        </div>
    )
}

function OrderDetailsList({title, content}) {
    return (
        <div className="flex flex-row">
            <div className="w-1/4 flex flex-row justify-between font-semibold">
                <span>{title}</span>
                <span>:&nbsp;</span>
            </div>
            <p className="w-3/4">
                {content}
            </p>
        </div>
    )
}