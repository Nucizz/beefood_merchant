import { useState, useEffect } from "react";
import logo from '../Assets/BeeFood Icon.png'
import { authenticateRegisterToken, authenticateLogout, getMerchantData, updateMerhcantHalal } from "../Javascript/MerchantHandler";
import { LINK, validatePhoneNumber } from '../Javascript/Global'
import { app } from '../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { JustifiedInfo, TextField } from '../Class/Component'

export function AdminMerchant({page}) {
    const [user, setUser] = useState(null)
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            setUser(user)
            setAuthLoaded(true)
        })

        return () => unsubscribe();
    }, [])

    if (!authLoaded) {
        return <></>
    }

    try {
        if(user && user.email !== "beefood.contact@gmail.com") {
            authenticateLogout('/admin')
        }
    } catch {
        
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center bg-pattern">

            <div className="w-screen h-screen bg-pattern-overlay absolute z-0" />

            <div className={"z-10 shadow-lg lg:px-7 md:px-6 px-4 lg:py-6 md:py-5 py-4 bg-white rounded-lg text-black xl:w-1/3 lg:w-2/5 md:w-1/2 w-full"}>

                <div className="font-bold flex flex-row items-center mb-4 w-full">

                    <img src={logo} alt="" className="lg:h-12 lg:w-12 md:h-10 md:w-10 w-9 h-9 rounded-md mr-3" />

                    <h1 className="lg:text-3xl md:text-2xl text-xl">{page}</h1>

                    <button className="text-red-400 ml-auto" onClick={() => authenticateLogout('/admin')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lg:h-8 lg:w-8 md:h-7 md:w-7 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>

                </div>

                { page === "Add Merhant" ? <MerchantRegisterForm /> : <VerifyHalal />}

            </div>

        </div>
    );
}

function MerchantRegisterForm() {
    const [error, setError] = useState("")
    const [merchantName, setMerchantName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [token, setToken] = useState("")

    const onRegisterValidate = async () => {
        const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const regExpPhone = /^\+62[0-9]*$/;
        if(merchantName === "" || email === "" || phone === "") {
            setError("Please fill in the forms.")
        } else if(merchantName.length < 2 || merchantName.length > 16) {
            setError("Merchant name must be 2 - 16 characters.")
        } else if(!regExpEmail.test(email)) {
            setError("Invalid email address.")
        } else if(!regExpPhone.test(phone)) {
            setError("Invalid phone number (ID only).")
        } else {
            const token = await authenticateRegisterToken(merchantName, email, phone)
            if(token === '0') {
                setError("Merchant is already registered.")
            } else {
                setError("TOKEN: " + token + " (Valid for 3 days).");
                setToken(token)
            }
        }
    }

    const EMAIL_SUBJECT = "BeeFood Merchant Registration"
    const EMAIL_BODY = ("Hello, " + merchantName + "! \r\n\r\n" + 
                        "Congratulations, your request to be a part of BeeFood has been accepted! \r\n Please proceed to the registration form at " + LINK + "register and use this token " + 
                        token + " with the same email as well. \r\n\r\n" +
                        "Thank You. \r\n -BeeFood Support Team")

    return(
        <form className="grid grid-cols-1 gap-3">

            {error ? <div className={"mb-2 w-full md:py-2 py-1 rounded-md flex flex-row items-center md:px-3 px-2 md:text-base text-sm " + (error.startsWith("TOKEN: ") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100")}>{error}</div> : <></>}
            <TextField label="Merchant Name" name="merchantName" value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
            <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Phone" name="phone" type="tel" onClick={() => {if (phone.length < 3){setPhone("+62")}}} value={phone} onChange={(e) => setPhone(validatePhoneNumber(e.target.value))} />

            <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onRegisterValidate}>Generate Token</button>
            <a className={"w-full font-medium bf-text-color hover:cursor-pointer text-center " + (token.length > 0 ? "block" : "hidden")}
            href={`mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`}>Send to {email}</a>

        </form>
    )
}

function VerifyHalal() {
    const [merchant, setMerchant] = useState(null)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")

    const onFindMerchant = async () => {
        const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(email === "") {
            setError("Please fill in the forms.")
        }else if(!regExpEmail.test(email)) {
            setError("Invalid email address.")
        } else {
            try {
                setMerchant(await getMerchantData(email))
            } catch {
                setError("No such user found.")
            }
        }
    }

    const onVerifyHalal = async () => {
        const res = await updateMerhcantHalal(merchant.id)
        if(res === "0") {
            setError("Updated merhant as " + (!merchant.halal ? "halal." : "not halal."))
            setMerchant(await getMerchantData(email))
        } else {
            setError(res)
        }
    }

    return(
        <form className="grid grid-cols-1 gap-3">

{error ? <div className={"mb-2 w-full md:py-2 py-1 rounded-md flex flex-row items-center md:px-3 px-2 md:text-base text-sm " + (error.startsWith("Updated ") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100")}>{error}</div> : <></>}
            { !merchant ? <>
                <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onFindMerchant}>Find Merchant</button>
            </> : <>
                <JustifiedInfo title={"ID"} content={merchant.id} />
                <JustifiedInfo title={"Name"} content={merchant.name} />
                <JustifiedInfo title={"Email"} content={merchant.email} />
                <JustifiedInfo title={"Phone"} content={merchant.phone} />
                <JustifiedInfo title={"Campus"} content={merchant.campus} />
                <JustifiedInfo title={"Location"} content={merchant.location} />
                <JustifiedInfo title={"Halal Verification"} content={merchant.halal ? "YES" : "NO"} />
                <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onVerifyHalal}>{merchant.halal ? "Revoke Halal Verification" : "Give Halal Verification"}</button>
                <a className="w-full font-medium bf-text-color hover:cursor-pointer text-center" onClick={() => {setMerchant(null);setError("")}}>Verify Other Merchant</a>
            </> }

        </form>
    )
}