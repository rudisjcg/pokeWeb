/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { pokeType, colorVariants } from "../constants";
import logo from "../assets/025.png";
import SkeletonCard from "./UI/SkeletonCard";

function Cardv2({ url, totalItem }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const getPokemon = async () => {
    await axios
      .get(url)
      .then(({ data }) => setPokemon(data))
      .catch((error) => console.error(error));
    setLoading(false);
  };
  useEffect(() => {
    getPokemon();
  }, []);

  return (
    <Link to={`/pokemon/${pokemon?.name || totalItem?.name}`}>
      {url && (
        <div className="CardPoke border border-gray-800 rounded-tl-lg">
          <img
            src={pokemon?.sprites?.other.home.front_default || logo}
            alt={pokemon?.name}
          />

          <h3 className={`text-gray-400 text-[12px] ml-1`}>#{pokemon?.id}</h3>
          <span className="m-1">{pokemon?.name}</span>
          <span className="text-[10px] flex gap-2 ">
            {pokemon?.types.map(({ type, slot }) => {
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
          </span>
        </div>
      )}

      {totalItem && (
        <div className="CardPoke border rounded-tl-lg">
          <img
            src={totalItem?.sprites?.other.home.front_default}
            alt={totalItem?.name}
          />
          <h3 className={`text-gray-400 text-[12px]`}>#{totalItem?.id}</h3>
          <span>{totalItem?.name}</span>
          <span className="text-[10px] flex gap-2">
            {totalItem?.types.map(({ type, slot }) => {
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
          </span>
        </div>
      )}
      {loading && <SkeletonCard />}
    </Link>
  );
}

export default Cardv2;
