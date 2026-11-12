import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignUp";


export default function Banner() {
    return (
        <div className="flex xl:space-x-[200px] justify-center items-center fixed w-full h-[80px] bg-primary bottom-0">
            <div className="hidden xl:inline text-white">
                <h1 className="text-2xl font-bold">Create a list with ur favorites pokemons!</h1>
                <span className="text-[18px] font-normal">
                    
                </span>
            </div>

            <div className="space-x-3 ">

                <LoginModal />
                <SignupModal />
            </div>
        </div>
    );
}