import icon from '../Assets/BeeFood Icon.png'
import logo from '../Assets/BeeFood Text Black.png'
import '../App.css'
import { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { TextField, LongTextField } from '../Class/Component'

async function addFeedback(name, email, instagram, positiveFB, negativeFB, tipsFB) {
    try {
        const feedbackDB = collection(getFirestore(), 'feedback');
        const currentTime = new Date();

        const existingSnapshot = await getDocs(query(feedbackDB, where('email', '==', email)));

        if (!existingSnapshot.empty) {
            throw new Error("Can't send feedback twice.");
        }

        await addDoc(feedbackDB, {
            time: currentTime,
            name: name,
            email: email,
            instagram: instagram,
            positiveFeedback: positiveFB,
            negativeFeedback: negativeFB,
            tipsFeedback: tipsFB,
        });
        return "SUCCESS";
    } catch (error) {
        return "Something went wrong."
    }
}

export default function FeedbackLayout() {
    const [view, setView] = useState("MENU")

    const viewSelector = () => {
        switch (view) {
            case "MENU":
                return (<FeedbackMainMenu viewRef={setView} />)
            case "FORM":
                return (<FeedbackForm viewRef={setView} />)
            case "THANK":
                return (<FeedbackThankYou viewRef={setView} />)
            default:
                break;
        }
    }

    return (
        <div className="w-screen h-screen bg-black flex flex-row items-center justify-evenly bg-pattern">

            <div className="w-screen h-screen bg-pattern-overlay absolute z-0" />

            <div className="z-10 shadow-lg xl:w-1/3 lg:w-1/2 w-full lg:mx-0 mx-8 lg:px-7 md:px-6 px-4 lg:py-6 md:py-5 py-4 bg-white dark:bg-slate-800 rounded-lg text-black dark:text-white">
                {viewSelector()}
            </div>

            <div className='z-10 shadow-lg bg-white dark:bg-slate-800 rounded-lg text-black dark:text-white xl:block hidden'>
                <iframe title='figma' className='rounded-lg xl:block hidden' width="405" height="720" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Ff7Qdwi4NWhPXFah4XNYXr2%2FMobile-Multimedia-Solution-HiFi-2%3Fpage-id%3D0%253A1%26type%3Ddesign%26node-id%3D1-10%26viewport%3D86%252C-362%252C0.74%26t%3DaKBl8raeaNfi6NQp-1%26scaling%3Dscale-down%26starting-point-node-id%3D1%253A10%26mode%3Ddesign" allowfullscreen></iframe>
            </div>

        </div>
    )
}

function FeedbackMainMenu({viewRef}) {
    return(
        <div className='w-full flex flex-col md:items-start items-center'>

            <img src={logo} alt="" className="w-3/5" />

            <div className='flex md:flex-row flex-col items-center gap-5 mt-5'>

                <p className='w-full text-gray-500 dark:text-gray-300 font-base lg:text-md md:text-lg text-base text-justify'>
                    <span className='font-semibold'>BeeFood</span> adalah sebuah aplikasi layanan pemesanan makanan digital di area <span className='font-semibold'>BINUS</span> yang dibuat untuk <span className='font-semibold'>Mahasiswa</span>, <span className='font-semibold'>Dosen</span>, <span className='font-semibold'>Staff</span> serta <span className='font-semibold'>Tenant</span> yang berada di area kampus <span className='font-semibold'>BINUS</span>.
                    <ol className='font-semibold'>
                        <li>• Pesan makan tanpa mengantri</li>
                        <li>• Menghemat waktu Anda</li>
                        <li>• Tarif lebih terjangkau</li>
                    </ol>
                </p>

            </div>

            <div className='w-full mt-2 text-gray-500 dark:text-gray-300 font-semibold lg:text-2xl md:text-xl text-lg text-center'>Follow our Instagram <a href='https://instagram.com/beefood_binus' className='bf-text-color cursor-pointer'>@beefood_binus</a></div>

            <button className="mt-5 w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={() => {viewRef("FORM")}}>Give Feedback</button>

        </div>
    )
}

function FeedbackForm({viewRef}) {
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [instagram, setInstagram] = useState("")
    const [positiveFB, setPositiveFB] = useState("")
    const [negativeFB, setNegativeFB] = useState("")
    const [tipsFB, setTipsFB] = useState("")

    const validateInstagram = (input) => {
        var lastInput = input;
        const specialCharacters = [
            '!', '"', '#', '$', '%', '&', "'", '(', ')', '*',
            '+', ',', '-', '/', ':', ';', '<', '=', '>', '?',
            '@', '[', '\\', ']', '^', '`', '{', '|', '}', '~'
        ];
        if(!input.startsWith("@")) {
            input = (input.length < 1) ? "@" : ("@" + input);
        } else if(specialCharacters.some(char => input.slice(1).includes(char))) {
            input = lastInput.slice(0, -1)
        }
        return input;
    }

    const onFeedbackValidate = async () => {
        const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(name === "" || email === "" || instagram === "") {
            setError("Please fill in the forms.")
        } else if(!regExpEmail.test(email)) {
            setError("Invalid email address.")
        } else if(!instagram.startsWith("@")) {
            setError("Invalid intagram username.")
        } else {
            const response = await addFeedback(name, email, instagram, positiveFB, negativeFB, tipsFB)
            if(response !== "SUCCESS") {
                setError(response)
            } else {
                setError("")
                setName("")
                setEmail("")
                setInstagram("")
                setPositiveFB("")
                setNegativeFB("")
                setTipsFB("")
                viewRef("THANK")
            }
        }
    }

    return(
        <>
            <div className="font-bold flex flex-row items-center justify-center mb-4">
                <img src={icon} alt="" className="lg:h-12 lg:w-12 md:h-10 md:w-10 w-9 h-9 rounded-md mr-3" />
                <h1 className="lg:text-3xl md:text-2xl text-xl">Feedback</h1>
                <button className="text-gray-500 dark:text-gray-300 ml-auto" onClick={() => {viewRef("MENU")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </button>
            </div>

            <form className="grid grid-cols-1 gap-3">
                {error ? <div className="mb-2 w-full md:h-9 h-8 bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:text-base text-sm">{error}</div> : null}
                <TextField label="Nama" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Instagram" name="instagram" type="text" value={instagram} onChange={(e) => setInstagram(validateInstagram(e.target.value))} />
                <LongTextField label="Apa yang menarik dari aplikasi BeeFood?" name="positive" type="text" value={positiveFB} onChange={(e) => setPositiveFB(e.target.value)} />
                <LongTextField label="Apa yang kurang menarik dari aplikasi BeeFood?" name="negative" type="text" value={negativeFB} onChange={(e) => setNegativeFB(e.target.value)} />
                <LongTextField label="Apa ada saran untuk BeeFood?" name="tips" type="text" value={tipsFB} onChange={(e) => setTipsFB(e.target.value)} />
                <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onFeedbackValidate}>Send Feedback</button>
            </form>
        </>
    )
}

function FeedbackThankYou({viewRef}) {
    const giphyLink = [
        "https://giphy.com/embed/sjkl9MJD57BWersvzJ",
        "https://giphy.com/embed/KvAKXViNfpU8fSDiF0",
        "https://giphy.com/embed/BYoRqTmcgzHcL9TCy1",
        "https://giphy.com/embed/R6gvnAxj2ISzJdbA63"
    ];

    const randomGiphy = giphyLink[Math.floor(Math.random() * giphyLink.length)]

    useEffect(() => {
        const delay = 6000;

        const redirectTimeout = setTimeout(() => {
            viewRef("MENU")
        }, delay);
        return () => clearTimeout(redirectTimeout);
    }, [viewRef]);

    return (
        <div className='flex flex-col justify-center items-center gap-5'>
            <span className='text-4xl font-bold'>Thank You for your Feedback!</span>
            <iframe title="ThankyouGIF" className='rounded-lg' src={randomGiphy} width="480" height="360" class="giphy-embed" allowFullScreen></iframe>
            <p className='text-xl text-gray-500 dark:text-gray-300'>Please take some freebies as a part of our appreciation.</p>
        </div>
    );
}