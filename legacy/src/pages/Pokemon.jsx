import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { styles } from "../constants";
import LinesChart from "../components/LinesChart";
import { Tilt } from "react-tilt";
import SectionWrapper from "../hoc/SectionWrapper";
import PokeEvolve from "../components/PokeEvolve";
import { pokemonTypes } from "../constants/pokemonTypes";
import { addDoc } from "firebase/firestore";
import { pokemonListRef } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "../redux/reducers/modalSlice";
import { Toaster, toast } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
function Pokemon() {
  const { id } = useParams();
  const [poke, setPoke] = useState({});
  const [pokestats, setPokestats] = useState([]);
  const [species, setSpecies] = useState("");
  const [pokeType, setPokeType] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  async function getPokeData() {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    setPoke(data);
    setSpecies(data?.species?.url);
  }
  function compareTypes(types) {
    const newTypeObjs = types.map((type) => {
      const typeObj = pokemonTypes[type];
      return { ...typeObj, id: type };
    });
    setPokeType(newTypeObjs);
  }

  useEffect(() => {
    async function fetchData() {
      await getPokeData();
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    // Cuando cambia 'poke', actualizamos 'pokestats' con las estadísticas
    setPokestats(poke?.stats || []);
  }, [poke]);
  useEffect(() => {
    if (poke?.types) {
      const types = poke.types.map((type) => type.type.name);
      compareTypes(types);
    }
  }, [poke]);

  async function addPokeList() {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    await addDoc(pokemonListRef, {
      uid: poke?.id,
      pokemon: {
        id: poke?.id,
        name: poke?.name,
        pictures: poke?.sprites,
        types: poke?.types,
      },
      email: user.email,
    });
    toast(`${poke?.name} was added to your list!`);
  }

  return (
    <section className="relative w-full h-auto mx-auto">
      <motion.div className="mt-10">
        <Toaster />
        <div
          className={`${styles.padding} bg-tertiary w-full relative h-fit rounded-lg`}
        >
          <div className="flex justify-center items-center gap-10">
            <div className="flex items-center gap-2">
              <h1 className="w-fit text-center text-[24px] uppercase">
                {poke?.name}{" "}
              </h1>
              <span className="text-[16px] text-gray-400">#{poke?.id}</span>
            </div>
            <button onClick={addPokeList} className="border p-2 rounded-lg">
              Add
            </button>
          </div>
          <div className="w-[100%] flex flex-col gap-5">
            <div className="w-full flex flex-wrap justify-center items-end">
              <div className="md:w-[50%]">
                <Tilt>
                  <img
                    src={poke?.sprites?.other?.home?.front_default}
                    alt={poke?.name}
                    className="w-[350px]"
                  />
                </Tilt>
              </div>

              <div className="md:w-[50%]">
                <div className={` max-h-[300px] p-2 ${styles.padding}`}>
                  <h1 className={`${styles.sectionSubText}`}>Stats</h1>
                  <LinesChart pokestats={pokestats} pokemon={poke?.name} />
                </div>
              </div>
            </div>
            <div className="w-full h-fit mt-10">
              <h2 className={`${styles.sectionSubText} text-center`}>
                Details
              </h2>
              <PokeEvolve id={species} />
              <div className="flex flex-wrap justify-center items-center gap-5 mb-10 mt-20">
                <div
                  className={`${styles.padding} flex gap-2  bg-primary w-fit p-1 rounded-lg `}
                >
                  <div className="w-fit">
                    <p>Height: {poke?.height}</p>
                    <p>Weight: {poke?.weight}</p>
                    <p>Base experience: {poke?.base_experience}</p>
                    <p>
                      Abilities:{" "}
                      {poke?.abilities?.map((abil, slot) => (
                        <p key={slot}> {abil?.ability.name}</p>
                      ))}{" "}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-5">
                  {pokeType.map((ele) => (
                    <div key={ele.id}>
                      <picture className="flex sm:justify-start justify-center items-center gap-1">
                        <img
                          className="w-[50px]"
                          src={ele.image}
                          slot={ele.id}
                        />
                        <label htmlFor="">{ele.id}</label>
                      </picture>
                      <ul>
                        <li>Resistence: {ele.resistance.join(", ")}</li>
                        <li>Strength: {ele.strength.join(", ")} </li>
                        <li>Vulnerable: {ele.vulnerable.join(", ")}</li>
                        <li>Weakness: {ele.weakness.join(", ")}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default SectionWrapper(Pokemon, "");
