import axios from "axios";
import { useEffect, useState } from "react";
import { styles } from "../constants";
// eslint-disable-next-line react/prop-types
const Card = ({ url }) => {
    const [pokemon, setPokemon] = useState(null);
  
    const getPokemon = async () => {
      await axios
        .get(url)
        .then(({ data }) => setPokemon(data))
        .catch((error) => console.error(error));
    };
  
    useEffect(() => {
      getPokemon();
    }, []);
  
    return (
      <div className="card">
        <img src={pokemon?.sprites?.other.home.front_default} alt={pokemon?.name} />
        <div className="data">
          <p className={`${styles.sectionSubText}`}>{pokemon?.name}</p>
          
        </div>
      </div>
    );
  };

  export default Card