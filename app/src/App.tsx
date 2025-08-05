import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import logo from "./images/logo.svg"
import "./css/App.css"
import Loading from "./components/Loading/Loading"
import Faucet from "./components/FaucetForm/Faucet"

interface CSRFInfo {
  csrfToken: string
  requestId:  string
  timestamp: number
}

const chainName:{ [key: string]: string }= {
  744: "DuskEVM",
  745: "DuskEVM"
}

function App(): JSX.Element {
  const [chainId, setChainId] = useState(745)
  const [loading, setLoading] = useState(true)
  const [enabledTokens, setEnabledTokens] = useState([])
  const [faucetLoading, setFaucetLoading] = useState(true)
  const [csrfInfo, setCSRFInfo] = useState<CSRFInfo>({csrfToken: '', requestId: '', timestamp: 0})

  const getFaucetInfo = async () => {
    return axios.get(`${process.env.REACT_APP_FAUCET_API_URL}/info`)
  }

  useEffect(() => {
    getFaucetInfo()
      .then((response) => {
        setChainId(response.data.chainId)
        setEnabledTokens(response.data.enabledTokens)

        const chain = chainName[response.data.chainId]
        document.title = `${chain} Faucet`
        document.querySelector('meta[name="description"]')?.setAttribute("content", `Faucet for ${chain} chain`)

        csrfInfo.csrfToken = response.data.csrfToken,
        csrfInfo.requestId = response.data.csrfRequestId
        csrfInfo.timestamp = response.data.csrfTimestamp
        setCSRFInfo(csrfInfo)
      })
      .catch(() => {
        toast.error("Network error")
      })
      .finally(() => {
        setFaucetLoading(false)
        setLoading(false)
      })
  }, [])

  const title = faucetLoading ? "FAUCET" : `${chainName[chainId]}`
  const subtitle = faucetLoading
    ? "Application loading..."
    : (chainId === 744 ? "Faucet" : "Testnet Faucet")
  
  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        // pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="app-container">
        <img src={logo} className="app-logo" alt="logo" />
        <div className="title">
          <h1>{title}</h1>
          <h2>{subtitle}</h2>
        </div>
        <Faucet
          chainId={chainId}
          enabledTokens={enabledTokens}
          setLoading={setLoading}
          csrfToken={csrfInfo.csrfToken}
          requestId={csrfInfo.requestId}
          timestamp={csrfInfo.timestamp}
        />
        <h3>Learn More About Dusk</h3>
        <ul>
          <li>Visit our <a href="https://dusk.network/" target="_blank" rel="noopener noreferrer">Homepage</a> for news and updates</li>
          <li>Explore the <a href="https://docs.dusk.network/" target="_blank" rel="noopener noreferrer">Documentation</a> for DuskEVM guides</li>
        </ul>
      </div>
      {loading && <Loading/>}
    </>
  )
}

export default App
