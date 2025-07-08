import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import NavbarPage from "../Navbar";
import { ToastContainer } from "react-toastify";

function Home() {
  return (
    <>
      <NavbarPage />
      <ToastContainer />
    </>
  );
}

export default Home;
