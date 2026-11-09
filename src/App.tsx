import { GlobalStyle } from "./global"

// import { ToastContainer } from 'react-toastify'
// import Modal from 'react-modal'
// import 'react-toastify/dist/ReactToastify.css'

import { AppRoutes } from "./routes"

// Modal.setAppElement('#root')

export default function App() {
  return (
    <>
      {/* <ToastContainer /> */}
      <GlobalStyle />
      <AppRoutes />
    </>
  )
}