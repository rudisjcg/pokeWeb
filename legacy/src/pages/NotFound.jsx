import { useRouteError } from "react-router";
import { Link } from "react-router-dom";

const NotFound = () => {
  const error = useRouteError();
  return (
    <div>
      <h1>404</h1>
      <h1>Page Not Found</h1>
      <p>{error.statusText}</p>
      <Link to="/">Volver al Home</Link>
    </div>
  );
};

export default NotFound;
