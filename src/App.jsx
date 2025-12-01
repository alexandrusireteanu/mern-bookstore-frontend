import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookCatalog from './components/BookCatalog';
// import PublicBooks from "./components/PublicBooks";
import PaymentSuccess from './components/PaymentSuccess';
// import './App.css';
import AdminLogin from './components/admin/AdminLogin';
import ProductAdministration from './components/admin/ProductAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookCatalog />} />
        {/* <Route path="/publicbooks" element={<PublicBooks />} /> */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
         {/* Rute admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/products" element={<ProductAdministration />} />
      </Routes>
    </Router>
  );
};

export default App;




// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
