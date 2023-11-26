import { ChangePhoto, Accordion, TextField, DropdownField } from '../Class/Component'
import { authenticateLogout, updateUserData } from '../Javascript/UserHandler';
import { useState } from 'react';
import { validatePhoneNumber, CAMPUS_LOCATION } from '../Javascript/Global'

export default function AccountLayout({user, setUserRef}) {
    return (
        <div className="w-full">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">Account</h1>
            
            <div className="w-full flex flex-col lg:gap-16 gap-8">

                <ProfileInformation user={user} />

                <SettingsList user={user} setUserRef={setUserRef} />

            </div>

        </div>
    );
}

function ProfileInformation({user}) {
    const [logoutConfirmation, setLogoutConfirmation] = useState(false);

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-10 lg:items-start items-center xl:h-52 lg:h-36">

            <ChangePhoto photoRef={user.profilePicture} classSize={"xl:w-52 xl:h-52 w-36 h-36"} disabled={true} />
            
            <div className="flex flex-col justify-evenly lg:items-start items-center h-full w-fit">
                <span className="xl:text-6xl md:text-4xl text-2xl font-bold text-center md:text-left">{user.name}</span>
                <span className="xl:text-3xl md:text-xl text-md font-bold text-center md:text-left">{(user.campus) + ", " + (user.location)}</span>
                <span className="xl:text-2xl md:text-lg text-md text-gray-500 text-center md:text-left">{user.email}</span>
                <span className="xl:text-2xl md:text-lg text-md text-gray-500 text-center md:text-left">{user.phone}</span>
            </div>

            <button onClick={() => setLogoutConfirmation(true)} className="px-4 transition-all duration-300 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white flex flex-row gap-2 items-center md:ml-auto">
                <svg className="lg:h-8 lg:w-8 md:w-6 md:h-6 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout
            </button>

            {logoutConfirmation && (
                <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="md:ml-64 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2">
                        <p className="md:text-xl text-md font-semibold">Are you sure you want to logout?</p>
                        <div className="flex flex-row justify-end gap-2">
                            <button onClick={() => authenticateLogout()} className="px-4 transition-all duration-300 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white">Confirm</button>
                            <button onClick={() => setLogoutConfirmation(false)} className="px-4 transition-all duration-300 bg-gray-400 hover:bg-gray-500 md:h-9 h-8 rounded-md font-medium text-white">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

function SettingsList({user, setUserRef}) {
    const [openAccordion, setOpenAccordion] = useState(null);

    return (
        <div className="w-full flex flex-col gap-4">
    
            <Accordion setAccordionRef={setOpenAccordion} index={openAccordion}
            Icon={
                <svg className='md:w-6 md:h-6 w-4 h-4' fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Account Settings</title><path d="M9.6,3.32a3.86,3.86,0,1,0,3.86,3.85A3.85,3.85,0,0,0,9.6,3.32M16.35,11a.26.26,0,0,0-.25.21l-.18,1.27a4.63,4.63,0,0,0-.82.45l-1.2-.48a.3.3,0,0,0-.3.13l-1,1.66a.24.24,0,0,0,.06.31l1,.79a3.94,3.94,0,0,0,0,1l-1,.79a.23.23,0,0,0-.06.3l1,1.67c.06.13.19.13.3.13l1.2-.49a3.85,3.85,0,0,0,.82.46l.18,1.27a.24.24,0,0,0,.25.2h1.93a.24.24,0,0,0,.23-.2l.18-1.27a5,5,0,0,0,.81-.46l1.19.49c.12,0,.25,0,.32-.13l1-1.67a.23.23,0,0,0-.06-.3l-1-.79a4,4,0,0,0,0-.49,2.67,2.67,0,0,0,0-.48l1-.79a.25.25,0,0,0,.06-.31l-1-1.66c-.06-.13-.19-.13-.31-.13L19.5,13a4.07,4.07,0,0,0-.82-.45l-.18-1.27a.23.23,0,0,0-.22-.21H16.46M9.71,13C5.45,13,2,14.7,2,16.83v1.92h9.33a6.65,6.65,0,0,1,0-5.69A13.56,13.56,0,0,0,9.71,13m7.6,1.43a1.45,1.45,0,1,1,0,2.89,1.45,1.45,0,0,1,0-2.89Z"></path></g></svg>
            }
            Children={
                <AccountSettings user={user} setUserRef={setUserRef} />
            }
            />
    
        </div>
    );
}

function AccountSettings({user, setUserRef}) {
    const [error, setError] = useState("")
    const [editable, setEditable] = useState(false)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [phone, setPhone] = useState(user.phone)
    const [campus, setCampus] = useState(user.campus)
    const [location, setLocation] = useState(user.location)
    const [profilePicture, setProfilePicture] = useState(user.profilePicture)

    const updateData = async () => {
        const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(phone === "" || email === "" || location === "" || campus === "" || name === "") {
            setError("Please fill in the forms.")
        } else if(!profilePicture) {
            setError("Please upload your logo.")
        } else if(!regExpEmail.test(email)) {
            setError("Invalid email address.")
        } else {
            const newProfilePicture = profilePicture !== user.profilePicture ? profilePicture : null
            const res = await updateUserData(name, email, phone, campus, location, newProfilePicture)
            if(res) {
                setUserRef(res)
                setEditable(false)
            } else {
                setError("Something went wrong.")
            }
        }
    }

    return(
        <div className='grid grid-cols-1 gap-3'>

            <div className='w-full flex md:flex-row flex-col items-center justify-evenly mb-5 md:gap-0 gap-5'> 
                <ChangePhoto setPhotoRef={setProfilePicture} photoRef={profilePicture !== user.profilePicture ? URL.createObjectURL(profilePicture) : profilePicture} classSize={"xl:w-32 xl:h-32 md:w-24 md:h-24 w-28 h-28"} disabled={!editable} />
                <p className="rounded-md bg-green-200 text-green-500 py-1 px-2 md:py-2 md:px-3 md:w-2/3 w-full h-fit lg:text-base text-sm">
                    <b>Note!</b> to change your contact information such as email and phone please contact BeeFood admin.   
                </p>
            </div>
            {error ? <div className={"mb-2 w-full md:h-9 h-8 rounded-md flex flex-row items-center md:px-3 px-2 md:text-base text-sm " + (error.startsWith("TOKEN: ") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100")}>{error}</div> : <></>}
            <TextField label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editable} />
            <TextField label="Email" name="email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} disabled={true} />
            <TextField label="Phone" name="phone" type="tel" onClick={() => {if (phone.length < 3){setPhone("+62")}}} value={phone} onChange={(e) => setPhone(validatePhoneNumber(e.target.value))} disabled={true} />
            <TextField label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editable} />
            <DropdownField label="Campus" name="campus" onChange={(e) => {setCampus(e.target.value)}} options={CAMPUS_LOCATION.map((campusInfo) => (
                    <option key={campusInfo.campus} value={campusInfo.campus}>
                        {campusInfo.campus}
                    </option>
                ))} disabled={!editable} />
            <DropdownField label="Location" name="location" onChange={(e) => {setLocation(e.target.value)}} options={campus
        ? CAMPUS_LOCATION.find((campusInfo) => campusInfo.campus === campus)?.location.map((location) => (
              <option key={location} value={location} className="cursor-pointer">
                  {location} 
              </option>
                ))
            : null} disabled={!editable} />

            {!editable ? 
            <button className="ml-auto px-8 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={() => setEditable(true)}>Edit</button>
            : <div className="flex flex-row justify-end mt-5 gap-2">
                <button className="px-8 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={() => setEditable(false)}>Cancel</button>
                <button className="px-8 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={updateData}>Save</button>
            </div>}

        </div>
    )
}