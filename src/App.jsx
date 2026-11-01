import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Players from "./pages/Players";
import Prediction from "./pages/Prediction";
import MatchCenter from "./pages/MatchCenter";
import PlayerMarketValues from "./pages/PlayerMarketValues";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/matches" element={<MatchCenter />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/players" element={<Players />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/market-values" element={<PlayerMarketValues />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;