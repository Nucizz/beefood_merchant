import { timeConverter, moneyConverter, statusConverter } from "../Javascript/Global"
import { JustifiedInfo  } from "../Class/Component";
import '../App.css';
import { sendFCMMessage } from "../firebase-config";

export function OrderDetails({orderRef, setOrderRef}) {
    return (
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="md:ml-64 bg-white dark:bg-slate-800 md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2 md:w-1/2 w-4/5">
                <h2 className="w-full text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white" >Order Details</h2>

                <div className="flex flex-col lg:text-lg xl:text-xl">
                    <JustifiedInfo title={"ID"} content={orderRef.id} />
                    <JustifiedInfo title={"Name"} content={orderRef.name} />
                    <JustifiedInfo title={"Status"} content={statusConverter(orderRef.status)} />
                    <JustifiedInfo title={"Price"} content={moneyConverter(orderRef.totalPrice)} />
                    <JustifiedInfo title={"Time"} content={timeConverter(orderRef.createTime)} />
                </div>

                <button onClick={() => sendFCMMessage("c6x6qsESftYXFQRshWShbo:APA91bFl-oRBGrJw2snweZzDrzIyJa5dWlNEcI-bovF_-4DCWJn0xJfXpPneMfAPBogLdCEc0jprCZaxNgW720c3yV1FGRRhlALG3HNJLZ1svq9UzJd_IB0N9qbTGar9k8E5zgISea2T",
                "New Order Received", "Hello World")} className="px-4 transition-all duration-300 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white">Test</button>
                <button onClick={() => setOrderRef(null)} className="px-4 transition-all duration-300 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white">Close</button>

            </div>
        </div>
    )
}