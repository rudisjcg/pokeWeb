/* eslint-disable react/prop-types */
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/reducers/userSlice";
import {
  closeLoginModal,
  closePokemonModal,
  closeSignupModal,
  openPokemonModal,
} from "../redux/reducers/modalSlice";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { Modal } from "@mui/material";
import { colorVariants } from "../constants";
import { pokeType } from "../constants";
import { fadeIn } from "../utils/motion";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
// eslint-disable-next-line react-refresh/only-export-components
function Mylist({ index }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [pokeList, setPokeList] = useState([
    {
      docuId: "",
      pokeData: {},
    },
  ]);
  const [modalPoke, setModalPoke] = useState([]);
  const isOpen = useSelector((state) => state.modals.pokemonModalOpen);

  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser);
    dispatch(closeSignupModal());
    dispatch(closeLoginModal());
    window.location.reload();
  }

  function getData() {
    const q = query(
      collection(db, "pokemonList", "pokemons", "list"),
      where("email", "==", `${user.email}`)
    );
    return onSnapshot(q, (snapshot) => {
      const pokeList = [];
      snapshot.forEach((doc) => {
        pokeList.push({
          docuId: doc.id,
          pokeData: doc.data(),
        });
      });

      setPokeList(pokeList);
    });
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getModal = (ele) => {
    let modalData = [];
    for (let i = 0; i < pokeList?.length; i++) {
      if (ele === pokeList[i].pokeData.pokemon.id) {
        modalData.push(pokeList[i]);
      }
      setModalPoke(modalData);
    }
    dispatch(openPokemonModal());
  };

  const detailsBtn = () => {
    dispatch(closePokemonModal());
  };
  const objeto = modalPoke[0];

  async function removeFromList(ele) {
    await deleteDoc(doc(db, "pokemonList", "pokemons", "list", ele));
    dispatch(closePokemonModal());
    toast(`${objeto?.pokeData?.pokemon?.name} was removed from your list!`);
  }

  return (
    <section className="mt-20 flex flex-wrap gap-10 justify-center sm:h-[100vh]">
      <Toaster />
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="border w-[200px] h-fit rounded-md pb-4"
      >
        <div className="flex flex-col items-center gap-6 mt-5">
          <picture
            className="border-2 border-gray-400 
          text-center flex justify-center items-center 
          w-[150px] h-[150px] rounded-full"
          >
            <img
              className="w-full h-full object-contain rounded-full "
              src={`${user?.photoUrl}`}
            />
          </picture>
          <h1>{user?.name}</h1>
          <br />
          <h1 className="text-left">Amount of pokemons: {pokeList?.length}</h1>
          <h1 className="text-left">#Posts: Incoming...</h1>
          <h1 className="text-left">#Followers: Incoming...</h1>
          <h1 className="text-left">#Likes: Incoming...</h1>
          <button className="btn-default remove" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </motion.div>
      <motion.div
        variants={fadeIn("left", "spring", index * 0.5, 0.75)}
        className="border w-[500px] h-[500px]"
      >
        <div className="flex flex-wrap gap-5 p-3">
          <ul className="flex flex-wrap gap-5 items-center">
            {pokeList
              .map((objeto) => objeto.pokeData.pokemon)
              .map((poke) => (
                <li key={poke?.id} className="shadow-inner">
                  <button onClick={() => getModal(poke?.id)}>
                    <picture className="w-[50px]">
                      <img
                        className="w-[50px] bg-[#333638] border-2 border-[#1E1E1E] rounded-sm p-1"
                        src={`${poke?.pictures?.other?.home?.front_default}`}
                      />
                    </picture>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </motion.div>
      <Modal
        open={isOpen}
        onClose={() => dispatch(closePokemonModal())}
        className="flex justify-center items-center"
      >
        <div
          className="bg-[#333638] rounded-md h-[400px] flex flex-col justify-around
        items-center"
        >
          <picture>
            <img
              className="w-[250px]"
              src={`${objeto?.pokeData?.pokemon?.pictures?.other?.home?.front_default}`}
            />
          </picture>
          <div className="flex justify-center items-center gap-2">
            <label>{objeto?.pokeData?.pokemon?.name}</label>
            <div className="flex gap-1">
              {objeto?.pokeData?.pokemon?.types?.map(({ type, slot }) => {
                const typeColor = pokeType.find(
                  (item) => item.name === type.name
                )?.color;

                return (
                  <h4
                    id="pokeType"
                    className={`${colorVariants[typeColor]} p-1 m-1 rounded-md text-[16px]`}
                    key={slot}
                  >
                    {type?.name}
                  </h4>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <button className="btn-default">
              <Link
                to={`/pokemon/${objeto?.pokeData?.pokemon?.name}`}
                onClick={detailsBtn}
              >
                Details
              </Link>
            </button>
            <button
              onClick={() => removeFromList(objeto?.docuId)}
              className="btn-default remove"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export default SectionWrapper(Mylist);
