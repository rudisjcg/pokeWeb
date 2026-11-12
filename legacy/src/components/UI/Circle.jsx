import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { pokemonRoute } from "../../constants";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function Circle({ url }) {
  const [evoTree, setEvoTree] = useState([]);
  const circleSize = "border-gray-500";
  const isActive = `border-white bg-gray-500`;
  const { id } = useParams();
  const getPokemon = async () => {
    const { data } = await axios.get(`${pokemonRoute}/${url}`);
    setEvoTree(data);
  };

  useEffect(() => {
    getPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <Link to={`/pokemon/${evoTree.name}`}>
      <div
        className={`${
          id === evoTree.name ? isActive : circleSize
        } border-4 bg-gray-900 rounded-full flex items-center justify-center transition-all
        `}
      >
        <img
          src={evoTree?.sprites?.other.home.front_default}
          className="sm:w-[200px] w-[80px] p-2"
        />
      </div>
    </Link>
  );
}

Circle.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Circle;
