import { useEffect, useState } from 'react'
import { FiHeart } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'
import Head from 'next/head'
import CryptoChartCard from '../components/CryptoChartCard'
import useDebounce from '../hooks/useDebounce'
import { createClient } from '@supabase/supabase-js'
import CryptoContext from '../context/CryptoContext'
import LoadingIcons from 'react-loading-icons'

const supabase = createClient('https://ualzjptcwxxstkbjvqcf.supabase.co', process.env.NEXT_PUBLIC_API_URL)

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cryptosArray, setCryptosArray] = useState([])
  const [selectedCoins, setSelectedCoins] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const markCoinAsFav = (coin) => {
    setSelectedCoins((prevCoins) => {
      setSearchTerm('')
      if (!prevCoins.some(c => c.id === coin.id)) {
        return [...prevCoins, coin]
      } else {
        return prevCoins
      }
    })
  }

  const searchCrypto = async (s) => {
    const { data, error } = await supabase
      .from('cryptos')
      .select('name, id')
      .like('name', `%${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)}%`)

    return data
  }

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true)
        searchCrypto(debouncedSearchTerm).then((results) => {
          setIsSearching(false)
          setCryptosArray(results)
        });
      } else {
        setCryptosArray([])
        setIsSearching(false)
      }
    },
    [debouncedSearchTerm]
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pt-20 bg-white">
      <Head>
        <title>My Cryptos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-start px-10 text-center">
        <div className="relative max-w-2xl mx-auto w-full">
          <div className="flex items-center mb-4 rounded-xl w-full p-6 bg-[#1D1E1F]">
            <div className="flex items-center justify-center px-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z">
                </path>
              </svg>
            </div>
            <input
              value={searchTerm}
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="w-full focus:outline-none text-white text-2xl bg-transparent"
              type="text"
              name="cryptos"
            />
            {isSearching && <LoadingIcons.Oval className="h-6 mr-2" />}
            <button onClick={() => setSearchTerm('')} className="p-2 text-gray-600">clear</button>
          </div>

          {cryptosArray.length > 1 && <div className="absolute z-[9999] overflow-auto rounded-xl w-full h-72 p-6 bg-[#1D1E1F]">
            {cryptosArray.map((val, key) => {
                return (
                  <button
                    onClick={() => markCoinAsFav(val)}
                    className="focus:outline-none w-full flex justify-between items-center cursor-pointer p-4 text-left text-white text-2xl hover:rounded-xl hover:bg-[#232526]"
                    key={key}
                  >
                    {val.name}
                    <span className="text-xs text-gray-600">
                      {selectedCoins.some(coin => coin.id === val.id) ?
                        <FaStar size={20} />
                        :
                        <FaRegStar size={20} />
                      }
                    </span>
                  </button>
                )
              })
            }
          </div>}
        </div>

        <CryptoContext.Provider value={
          { setSelectedCoins }
        }>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-6 px-4">
            {selectedCoins && selectedCoins.map((selectedCoin, key) =>
              <CryptoChartCard
                key={key}
                id={selectedCoin.id}
                name={selectedCoin.name.toLowerCase()}
              />
            )}
          </div>
        </CryptoContext.Provider>
      </main>

      <footer className="flex py-4 w-full items-center justify-center text-sm">
        <a
          className="flex items-center justify-center"
          href="https://carlosknopel.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="mr-2">Made with</span>
          <FiHeart size={12} />
          <span className="ml-2">
            by <b>Carlos Knopel</b>
          </span>
        </a>
      </footer>
    </div>
  )
}
