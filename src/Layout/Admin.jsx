import { useState, useEffect } from "react"
import logo from '../Assets/BeeFood Icon.png'
import { authenticateLogin, authenticateLogout } from "../Javascript/MerchantHandler"
import { app } from '../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { TextField } from '../Class/Component'

export default function AdminLayout() {
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
    } catch(e) {
        console.log(e)
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center bg-pattern">

            <div className="w-screen h-screen bg-pattern-overlay absolute z-0" />

            <div className={"z-10 shadow-lg lg:px-7 md:px-6 px-4 lg:py-6 md:py-5 py-4 bg-white dark:bg-slate-800 rounded-lg text-black dark:text-white xl:w-1/3 lg:w-2/5 md:w-1/2 w-full"}>

                <div className="font-bold flex flex-row items-center mb-4 w-full">

                    <img src={logo} alt="" className="lg:h-12 lg:w-12 md:h-10 md:w-10 w-9 h-9 rounded-md mr-3" />

                    <h1 className="lg:text-3xl md:text-2xl text-xl">{user ? "Launchpad" : "Login as Admin"}</h1>

                    {user ? <button className="text-red-400 ml-auto" onClick={() => authenticateLogout('/admin')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lg:h-8 lg:w-8 md:h-7 md:w-7 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                        : <></>}

                </div>

                {user ? <AdminLaunchpad /> : <AdminLoginForm setUserRef={setUser} /> }

            </div>

        </div>
    );
}

function AdminLoginForm({setUserRef}) {
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onLoginValidate = async () => {
        if(email === "" || password === "") {
            setError("Please fill in the forms.")
        } else if(email === "beefood.contact@gmail.com") {
            try {
                await authenticateLogin(email, password)
                setUserRef(getAuth(app).currentUser)
                setError("")
            } catch(e) {
                setError("Unauthorized!")
            }
        } else {
            setError("Wrong merchantname or password.")
        }
    }

    return(
        <form className="grid grid-cols-1 gap-3">

            {error ? <div className="mb-2 w-full md:py-2 py-1 bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:text-base text-sm">{error}</div> : <></>}
            <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onLoginValidate}>Submit</button>

        </form>
    )
}

function AdminLaunchpad() {
    return (
        <div className="grid grid-cols-1 gap-3">

            <button onClick={() => window.location.href = "/admin/addmerchant"} className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button">Add Merchant</button>
            <button onClick={() => window.location.href = "/admin/verifyhalal"} className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button">Verify Halal</button>
            <button onClick={() => window.location.href = "/admin/feedback"} className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button">Feedback Form</button>

        </div>
    )
}