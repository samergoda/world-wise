import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/FakeAuthContext";


function ProtectedRoute({ children }) {
  const { isAuthen } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthen) navigate("/");
    },
    [isAuthen, navigate]
  );

  return isAuthen ? children : null;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
