import Introduction from "../../components/Introduction/Introduction";
import "./HomePage.css";
import { Link} from "react-router-dom"

function HomePage() {
  return (
    <>
      <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/expenses">Expenses</Link>
            </li>
            <li>
              <Link to="/groups">Groups</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      <div className="container-fluid">
        <div className="row intro">
          <div className="col">
            <Introduction></Introduction>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
