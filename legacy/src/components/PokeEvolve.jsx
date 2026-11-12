import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CirclePoke from "./UI/CirclePoke";

const PokeEvolve = ({ id }) => {
  const [evolveTree, setEvolveTree] = useState({});
  async function getEvolveTree() {
    const { data } = await axios.get(id);
    setEvolveTree(data);
  }
  useEffect(() => {
    getEvolveTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <CirclePoke url={evolveTree?.evolution_chain?.url} />
    </div>
  );
};

PokeEvolve.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PokeEvolve;
