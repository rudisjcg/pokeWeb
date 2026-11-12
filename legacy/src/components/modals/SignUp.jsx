import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  closeSignupModal,
  openSignupModal,
} from "../../redux/reducers/modalSlice";
import { auth } from "../../../firebase";
import { setUser } from "../../redux/reducers/userSlice";
import { pfp } from "../../assets";

export default function SignupModal() {
  const isOpen = useSelector((state) => state.modals.signupModalOpen);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState();
  const [password, setPassword] = useState("");
  const [imgRandom, setImgRandom] = useState(null);
  const user = useSelector((state) => state.user);

  function getImg() {
    const propiedades = Object.keys(pfp[0]);
    const propsRandom =
      propiedades[Math.floor(Math.random() * propiedades.length)];
    setImgRandom(pfp[0][propsRandom]);
  }
  useEffect(() => {
    getImg();
  }, []);

  async function handleSignUp() {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ); 

    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: imgRandom,
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      dispatch(
        setUser({
          username: currentUser.email.split("@")[0],
          name: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
          photoUrl: currentUser.photoURL,
        })
      );

      //handle redux actions
    });


    return unsubscribe;
  }, []);

  return (
    <>
      <button
        className="bg-white text-black
        w-[160px] rounded-full h-[40px] hover:bg-[#cbd2d7] transition-all
        "
        onClick={() => dispatch(openSignupModal())}
      >
        Sign Up
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeSignupModal())}
        className="flex justify-center items-center"
      >
        <div
          className="w-[90%] h-[450px] bg-black 
                text-white md:w-[560px] md:h-[450px]
        border border-gray-700 rounded-lg
        flex justify-center"
        >
          <div className="w-[90%] mt-8 flex flex-col">
            <h1
              className="mt-4 font-bold text-4xl
                "
            >
              Create your Account
            </h1>
            <input
              placeholder="Full Name"
              className="h-10 mt-8 rounded-md bg-transparent border
                        border-gray-700 p-6"
              type={"text"}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              className="h-10 mt-8 rounded-md bg-transparent border
                        border-gray-700 p-6"
              type={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              className="h-10 mt-8 rounded-md bg-transparent border
                        border-gray-700 p-6"
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-white text-black w-full
                font-bold text-lg p-2 mt-8 rounded-md"
              onClick={handleSignUp}
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
