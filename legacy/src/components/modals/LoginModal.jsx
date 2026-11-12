import { Modal } from "@mui/material"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { auth } from "../../../firebase"
import { closeLoginModal, openLoginModal } from "../../redux/reducers/modalSlice"

export default function LoginModal() {
    const isOpen = useSelector(state => state.modals.loginModalOpen);
    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSignIn() {
        await signInWithEmailAndPassword(auth, email, password)
    }


    return (
        <>

            <button
                className="bg-transparent border border-white text-white
        w-[160px] rounded-full h-[40px] hover:bg-[#cbd2d7] transition-all
        "
                onClick={() => dispatch(openLoginModal())}
            >
                Log In
            </button>

            <Modal
                open={isOpen}
                onClose={() => dispatch(closeLoginModal())}
                className="flex justify-center items-center"
            >
                <div className="w-[90%] h-[400px] bg-black text-white md:w-[560px]
        border border-gray-700 rounded-lg
        flex justify-center">
                    <div className="w-[90%] mt-8 flex flex-col">

                        <h1 className="mt-4 font-bold text-4xl
                ">Sign in to your Account</h1>
                        <input
                            placeholder="Email"
                            onChange={e => setEmail(e.target.value)}
                            className="h-10 mt-8 rounded-md bg-transparent border
                        border-gray-700 p-6" type={"email"} />
                        <input
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            className="h-10 mt-8 rounded-md bg-transparent border
                        border-gray-700 p-6" type={"password"} />

                        <button
                            onClick={handleSignIn}
                            className="bg-white text-black w-full
                font-bold text-lg p-2 mt-8 rounded-md">Sign In</button>
                    
                    </div>
                </div>
            </Modal>

            
        </>


    )
}