import logo from "../Assets/BeeFood Icon.png";
import "../App.css";
import { useState } from "react";
import {
    authenticateRegister,
    authenticateLogin,
    validateToken,
} from "../Javascript/MerchantHandler";
import { TextField, DropdownField, ChangePhoto } from "../Class/Component";
import { validatePhoneNumber, CAMPUS_LOCATION } from "../Javascript/Global";

export default function Aunthentication({ type }) {
    return (
        <div className="w-screen min-h-screen bg-black flex items-center justify-center bg-pattern relative">
            <div className="inset-0 h-auto bg-pattern-overlay absolute -z-1" />

            <div className="my-16 z-0 shadow-lg xl:w-1/3 lg:w-2/5 md:w-1/2 w-full md:mx-0 mx-8 lg:px-7 md:px-6 px-4 lg:py-6 md:py-5 py-4 bg-white dark:bg-slate-800 rounded-lg text-black dark:text-white">
                <div className="font-bold flex flex-row items-center mb-4">
                    <img
                        src={logo}
                        alt=""
                        className="lg:h-12 lg:w-12 md:h-10 md:w-10 w-9 h-9 rounded-md mr-3"
                    />

                    <h1 className="lg:text-3xl md:text-2xl text-xl">{type}</h1>
                </div>

                {type === "Login" ? <LoginForm /> : <RegisterForm />}

                <div className="w-full text-center md:text-sm text-xs mt-5">
                    {type === "Login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    {type === "Login" ? (
                        <a className="bf-text-color font-semibold" href="/register">
                            Register
                        </a>
                    ) : (
                        <a className="bf-text-color font-semibold" href="/login">
                            Login
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function LoginForm() {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLoginValidate = async () => {
        if (email === "" || password === "") {
            setError("Please fill in the forms.");
        } else {
            try {
                await authenticateLogin(email, password);
                window.location.href = "/dashboard";
            } catch (e) {
                console.log(e);
                setError("Wrong email or password.");
            }
        }
    };

    return (
        <form className="grid grid-cols-1 gap-3">
            {error ? (
                <div className="mb-2 w-full bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:py-2 py-1 md:text-base text-sm">
                    {error}
                </div>
            ) : null}
            <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5"
                type="button"
                onClick={onLoginValidate}
            >
                Submit
            </button>
        </form>
    );
}

function RegisterForm() {
    const [error, setError] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [name, setName] = useState("");
    const [token, setToken] = useState("");
    const [campus, setCampus] = useState(CAMPUS_LOCATION[0].campus);
    const [location, setLocation] = useState(CAMPUS_LOCATION[0].location[0]);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [conpword, setConpword] = useState("");

    const onCampusChange = (campusName) => {
        setCampus(campusName);
        for (const campusInfo of CAMPUS_LOCATION) {
            if (campusInfo.campus === campusName) {
                setLocation(campusInfo.location[0]);
                break;
            }
        }
    };

    const onRegisterValidate = async () => {
        var regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const regExpPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=<>?])[A-Za-z\d!@#$%^&*()-_+=<>?]{8,32}$/;
        if (
            password === "" ||
            conpword === "" ||
            phone === "" ||
            email === "" ||
            location === "" ||
            campus === "" ||
            name === "" ||
            !profilePicture
        ) {
            setError("Please fill in the forms.");
        } else if (!profilePicture) {
            setError("Please upload your logo.");
        } else if (!regExpEmail.test(email)) {
            setError("Invalid email address.");
        } else if (!regExpPassword.test(password)) {
            setError("Password must be 8-32 with symbols, alphabets, and numbers.");
        } else if (password !== conpword) {
            setError("Password doesn't match.");
        } else {
            const res = await authenticateRegister(
                name,
                email,
                phone,
                password,
                token,
                campus,
                location,
                profilePicture
            );
            if (res === "0") {
                window.location.href = "/dashboard";
            } else {
                setError(res);
            }
        }
    };

    if (token.length < 1) {
        return (
            <TokenForm
                nameRef={setName}
                emailRef={setEmail}
                phoneRef={setPhone}
                tokenRef={setToken}
            />
        );
    }

    return (
        <form className="grid grid-cols-1 gap-3">
            {error ? (
                <div className="mb-2 w-full bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:py-2 py-1 md:text-base text-sm">
                    {error}
                </div>
            ) : null}
            <div className="w-full flex items-center justify-center">
                <ChangePhoto
                    photoRef={profilePicture ? URL.createObjectURL(profilePicture) : null}
                    setPhotoRef={setProfilePicture}
                    type="add"
                    classSize={"xl:w-32 xl:h-32 md:w-24 md:h-24 w-16 h-16"}
                />
            </div>
            <TextField
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
            />
            <TextField
                label="Phone"
                name="phone"
                type="tel"
                onClick={() => {
                    if (phone.length < 3) {
                        setPhone("+62");
                    }
                }}
                value={phone}
                onChange={(e) => setPhone(validatePhoneNumber(e.target.value))}
                disabled={true}
                disable
            />
            <DropdownField
                label="Campus"
                name="campus"
                value={campus}
                onChange={(e) => {
                    onCampusChange(e.target.value);
                }}
                options={CAMPUS_LOCATION.map((campusInfo) => (
                    <option key={campusInfo.campus} value={campusInfo.campus}>
                        {campusInfo.campus}
                    </option>
                ))}
            />
            <DropdownField
                label="Location"
                name="location"
                value={location}
                onChange={(e) => {
                    setLocation(e.target.value);
                }}
                options={
                    campus
                        ? CAMPUS_LOCATION.find(
                            (campusInfo) => campusInfo.campus === campus
                        )?.location.map((location) => (
                            <option
                                key={location}
                                value={location}
                                className="cursor-pointer"
                            >
                                {location}
                            </option>
                        ))
                        : null
                }
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="Confirm Password"
                name="confirmpassword"
                type="password"
                value={conpword}
                onChange={(e) => setConpword(e.target.value)}
            />

            <button
                className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5"
                type="button"
                onClick={onRegisterValidate}
            >
                Submit
            </button>
        </form>
    );
}

function TokenForm({ nameRef, emailRef, phoneRef, tokenRef }) {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    const onTokenValidate = async () => {
        const res = await validateToken(token, email, nameRef, phoneRef);
        if (res === "0") {
            emailRef(email);
            tokenRef(token);
        } else {
            setError(res);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-3">
            {error ? (
                <div className="mb-2 w-full md:py-2 py-1 bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:text-base text-sm">
                    {error}
                </div>
            ) : null}
            <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Token"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />

            <button
                className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5"
                type="button"
                onClick={onTokenValidate}
            >
                Continue
            </button>
        </form>
    );
}
