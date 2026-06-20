import Navbar from "./Navbar";
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;