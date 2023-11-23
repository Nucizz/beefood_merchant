import { useState, useEffect } from "react";
import logo from '../Assets/BeeFood Icon.png'
import { authenticateLogin, authenticateRegisterToken, authenticateLogout } from "../Javascript/AuthenticationScript";
import { LINK } from '../Javascript/Global'
import { TextField } from './Authentication'
import { app } from '../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function AddMerchant() {
    var [user, setUser] = useState(null)
    var [authLoaded, setAuthLoaded] = useState(false);

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
            authenticateLogout('/adminaddMerchant')
        }
    } catch {
        
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center bg-pattern">

            <div className="w-screen h-screen bg-pattern-overlay absolute z-0" />

            <div className={"z-10 shadow-lg lg:px-7 md:px-6 px-4 lg:py-6 md:py-5 py-4 bg-white rounded-lg text-black xl:w-1/3 lg:w-2/5 md:w-1/2 w-full"}>

                <div className="font-bold flex flex-row items-center mb-4 w-full">

                    <img src={logo} alt="" className="lg:h-12 lg:w-12 md:h-10 md:w-10 w-9 h-9 rounded-md mr-3" />

                    <h1 className="lg:text-3xl md:text-2xl text-xl">{user ? "Add Merchant" : "Login as Admin"}</h1>

                    {user ? <button className="text-red-400 ml-auto" onClick={() => authenticateLogout('/adminaddmerchant')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lg:h-8 lg:w-8 md:h-7 md:w-7 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                        : <></>}

                </div>

                {user ? <MerchantRegisterForm /> : <AdminLoginForm setCurrentUser={setUser} /> }

            </div>

        </div>
    );
}

function AdminLoginForm({setCurrentUser}) {
    var [error, setError] = useState("")
    var [email, setEmail] = useState("")
    var [password, setPassword] = useState("")

    const onLoginValidate = async () => {
        if(email === "" || password === "") {
            setError("Please fill in the forms.")
        } else if(email === "beefood.contact@gmail.com") {
            try {
                await authenticateLogin(email, password)
                setCurrentUser(getAuth(app).currentUser)
                setError("")
            } catch(e) {
                setError("Unauthorized!")
            }
        } else {
            setError("Wrong username or password.")
        }
    }

    return(
        <form className="grid grid-cols-1 gap-3">

            {error ? <div className="mb-2 w-full md:h-9 h-8 bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:text-base text-sm">{error}</div> : <></>}
            <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onLoginValidate}>Submit</button>

        </form>
    );
}

function MerchantRegisterForm() {
    var [error, setError] = useState("")
    var [merchantName, setMerchantName] = useState("")
    var [email, setEmail] = useState("")
    var [phone, setPhone] = useState("")
    var [token, setToken] = useState("")

    const validatePhoneNumber = (input) => {
        var lastInput = input;
        var regExpPhone = /^\+62[0-9]*$/;

        if(!input.startsWith("+62")) {
            input = (input.length < 3) ? "+62" : ("+62" + input);
        } else if(!regExpPhone.test(input)) {
            input = lastInput.slice(0, -1)
        }
        return input;
    }

    const onRegisterValidate = async () => {
        var regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        var regExpPhone = /^\+62[0-9]*$/;
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

            {error ? <div className={"mb-2 w-full md:h-9 h-8 rounded-md flex flex-row items-center md:px-3 px-2 md:text-base text-sm " + (error.startsWith("TOKEN: ") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100")}>{error}</div> : <></>}
            <TextField label="Merchant Name" name="merchantName" value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
            <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Phone" name="phone" type="tel" onClick={() => {if (phone.length < 3){setPhone("+62")}}} value={phone} onChange={(e) => setPhone(validatePhoneNumber(e.target.value))} />

            <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onRegisterValidate}>Generate Token</button>
            <a className={"w-full font-medium bf-text-color hover:cursor-pointer text-center " + (token.length > 0 ? "block" : "hidden")}
            href={`mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`}>Send to {email}</a>

        </form>
    );
}