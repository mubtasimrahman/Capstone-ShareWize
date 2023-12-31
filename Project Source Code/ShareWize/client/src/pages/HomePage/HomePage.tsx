import { useSelector } from "react-redux";
import Introduction from "../../components/Introduction/Introduction";
import "./HomePage.css";
import { RootState } from "../../App/store/store";

function HomePage() {
  const authenticated = useSelector((state: RootState) => state.auth.authenticated);

  return (
    <>
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
