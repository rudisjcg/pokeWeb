import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Circle from "./Circle";

const CirclePoke = ({ url }) => {
  const [linkEvo, setLinkEvo] = useState([]);
  const [pokeEvoArray, setPokeEvoArray] = useState([]);

  async function getLinkTree() {
    await axios
      .get(url)
      .then(({ data }) => setLinkEvo(data?.chain))
      .catch((error) => console.error(error));
  }
  useEffect(() => {
    getLinkTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    const pokeEvoElements = document.querySelectorAll(".pokeEvo");
    const contentArray = Array.from(pokeEvoElements).map((element) => ({
      name: element.textContent.trim(),
    }));
    const nonEmptyContentArray = contentArray.filter(
      (item) => item.name !== ""
    );
    setPokeEvoArray(nonEmptyContentArray);
  }, [linkEvo]);

  return (
    <div className="flex flex-col gap-1 mt-10">
      <div className="flex flex-wrap justify-center items-center gap-1">
        <h1 className="pokeEvo">{linkEvo?.species?.name}</h1>
        <h1 className="pokeEvo">{linkEvo?.evolves_to?.[0]?.species?.name}</h1>
        <h1 className="pokeEvo">
          {linkEvo?.evolves_to?.[0]?.evolves_to?.[0]?.species?.name}
        </h1>

        {pokeEvoArray?.map((ele) => (
          <Circle key={ele.id} url={ele?.name} />
        ))}
      </div>
    </div>
  );
};

CirclePoke.propTypes = {
  url: PropTypes.string.isRequired,
};

export default CirclePoke;
