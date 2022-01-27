import { useState, createContext } from 'react'
import Head from 'next/head'
// import axios from 'axios'
import CryptoChartCard from '../components/CryptoChartCard'
import coinsList from '../data/cryptos.json'
import CryptoContext from '../context/CryptoContext'

const cryptos = JSON.stringify(coinsList)
const cryptosList = JSON.parse(cryptos)
const cryptosArray = Object.values(cryptosList)

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoins, setSelectedCoins] = useState([])

  // const getCoinData = () => {
  //   axios.get('https://api.coingecko.com/api/v3/coins/${selectedCoin}')
  //   .then((res) => console.log({res}))
  //   .catch((e) => console.log(e))
  // }

  const markCoinAsFav = (coin) => {
    setSelectedCoins((prevCoins) => {
      setSearchTerm('')
      if (!prevCoins.includes(coin)) {
        return [...prevCoins, coin]
      } else {
        return prevCoins
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-20 bg-white">
      <Head>
        <title>My Cryptos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-start px-20 text-center">
        <div className="relative max-w-2xl mx-auto w-full">
          <div className="flex items-center mb-4 rounded-xl w-full p-6 bg-[#1D1E1F]">
            <div className="flex items-center justify-center px-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z">
                </path>
              </svg>
            </div>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} className="w-full focus:outline-none text-white text-2xl bg-transparent" type="text" name="cryptos" />
            <button onClick={() => setSearchTerm('')} className="p-2 text-gray-600">clear</button>
          </div>
          {searchTerm.length > 1 && <div className="absolute z-[9999] rounded-xl w-full p-6 bg-[#1D1E1F]">
            {cryptosArray.filter(c => c.toLowerCase().includes(searchTerm))
              .slice(0, 10)
              .map((val, key) => {
                return (
                  <button onClick={() => markCoinAsFav(val)} className="focus:outline-none w-full flex justify-between items-center cursor-pointer p-4 text-left text-white text-2xl hover:rounded-xl hover:bg-[#232526]" key={key}>
                    {val}
                    <span className="text-xs text-gray-600">Click to add</span>
                  </button>
                )
              })
            }
          </div>}
        </div>

        <CryptoContext.Provider value={
          { setSelectedCoins }
        }>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto w-full py-6 px-4">
            {selectedCoins && selectedCoins.map((selectedCoin, key) => {
              return <CryptoChartCard key={key} name={selectedCoin} />
            })}
          </div>
        </CryptoContext.Provider>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="ml-2 h-4" />
        </a>
      </footer>
    </div>
  )
}
