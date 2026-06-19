import { BrowserRouter, Routes, Route } from "react-router-dom";
import HoisstLanding from "./HoisstLanding";
import HoisstScheduling from "./components/HoisstScheduling";
import Thankyoupage from "./components/Thankyoupage";

export default function App() {
  return (
    <BrowserRouter basename="/discoverycall/">
      <Routes>
        <Route path="/" element={<HoisstLanding />} />
        <Route path="/schedule" element={<HoisstScheduling />} />
        <Route path="/thankyou" element={<Thankyoupage />} />
      </Routes>
    </BrowserRouter>
  );
}