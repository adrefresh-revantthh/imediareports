// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
    
//   </StrictMode>,
// )

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeSettings/ThemeContext.jsx";// ✅ Import ThemeProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>   {/* ✅ Wrap your entire app in ThemeProvider */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
