import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { User } from "../../../api";
import { useApi } from "../../../hooks";
import { UserContext } from "../../../utils/User";
import Deferred from "../../widgets/Deferred";
import { Pages, resolvePage } from "../Pages";

const AdminDashboard = () => {
  const { isLoading, data: isAdmin } = useApi(() => User.isAdmin(), [], "isAdmin");
  const { user } = useContext(UserContext);

  return (
    <>
      <h1>Admin UI</h1>
      <section className="module">
        <Deferred isWaiting={isLoading}>
          {!isAdmin && <Navigate to={resolvePage(Pages.Home)} />}
          <div className="module-content">
            <h2>Welcome, {user?.username}</h2>
            <Link to={resolvePage(Pages.AdminUiRegions)}>Regions List</Link>
          </div>
        </Deferred>
      </section>
    </>
  );
};

export default AdminDashboard;
