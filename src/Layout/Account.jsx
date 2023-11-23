import Profile from '../Assets/Default Profile.webp'

export default function AccountLayout({user}) {
    return (
        <div className="w-full">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">Account</h1>
            
            <div className="w-full flex flex-col gap-4">

                <ProfileInformation user={user} />

            </div>

        </div>
    );
}

function ProfileInformation({user}) {
    return (
        <div className="w-full flex flex-row gap-4 md:gap-7 xl:gap-10">

            <img src={user.profilePicture ?? Profile} alt="" className="object-cover xl:w-52 xl:h-52 md:w-44 md:h-44 w-28 h-28 rounded-full"/>
            
            <div className="w-full flex flex-col justify-evenly">
                <span className="xl:text-6xl md:text-5xl text-2xl font-bold">{user.name}</span>
                <span className="xl:text-3xl md:text-2xl text-md font-bold">{(user.campus) + ", " + (user.location)}</span>
                <span className="xl:text-2xl md:text-xl text-sm text-gray-500">{user.email}</span>
                <span className="xl:text-2xl md:text-xl text-sm text-gray-500">{user.phone}</span>
            </div>

        </div>
    )
}