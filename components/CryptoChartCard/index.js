import { useContext, useLayoutEffect, useState } from 'react'
import axios from 'axios'
import { FiX } from 'react-icons/fi'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import LoadingIcons from 'react-loading-icons'
import CryptoContext from '../../context/CryptoContext'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const CryptoChartCard = ({ id, name }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [coinData, setCoinData] = useState()
  const [options, setOptions] = useState({
    title: {
      text: ''
    },
    labels: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      labels: {
        enabled: false
      },
      type: 'datetime',
      gridLineColor: 'transparent',
      lineWidth: 0,
      tickWidth: 0
    },
    yAxis: {
      labels: {
        enabled: true
      },
      title: false
    },
    series: [{
      data: []
    }],
    tooltip: {
      xDateFormat: '%d %H:%M',
      shared: true
    },
    plotOptions: {
      series: {
          color: '#00F607'
      }
    },
    chart: {
      width: 230,
      height: 150,
      backgroundColor: 'transparent'
    }
  })
  const { setSelectedCoins } = useContext(CryptoContext)

  const getCoinData = () => {
    setIsLoading(true)

    const marketData = axios.get(`https://api.coingecko.com/api/v3/coins/${name}`)
    const chartData = axios.get(`https://api.coingecko.com/api/v3/coins/${name}/market_chart?vs_currency=usd&days=1`)

    axios.all([marketData, chartData]).then(axios.spread((marketDataResponse, chartDataResponse) => {
      setCoinData(marketDataResponse.data.market_data)
      setOptions((prevOptions) => {
        return { ...prevOptions, series: [{ data: chartDataResponse.data.prices }] }
      })
      setIsLoading(false)
    })).catch(e => {
      setIsLoading(false)
      console.log(e)
    })
  }

  useLayoutEffect(() => {
    getCoinData()
  }, [id])

  return (
    <div className="group relative max-w-4xl mx-auto antialiased">
      <button
        onClick={() => setSelectedCoins((prevCoins) => {
          return prevCoins.filter(c => c.id !== id)
        })}
        className="group-hover:opacity-100 transition ease-in-out opacity-0 hover:bg-gray-200 rounded-full h-6 w-6 bg-gray-100 shadow-xl flex justify-center items-center text-black absolute top-4 right-1">
        <FiX size={12} />
      </button>
      <div className="flex items-center justify-center">
        <div className="flex max-w-sm w-full sm:w-full lg:w-full py-6 px-3">
          <div className="h-72 w-72 px-6 py-6 text-white bg-[#1D1E1F] text-left shadow-lg shadow-[#040807] rounded-lg overflow-hidden">
            {isLoading ?
              <div className="flex justify-center items-center w-full h-full">
                <LoadingIcons.Oval className="h-16" />
              </div>
              :
              <h2 className="ml-2 text-2xl font-semibold capitalize">{name}</h2>
            }
            {coinData ? (
              <>
                <h3 className="text-lg ml-2 mb-2 font-semibold">{formatter.format(coinData.current_price.usd)}</h3>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options} />
              </>
            ) : (
                <div className="flex flex-col justify-center items-center w-full h-2/3 p-6">
                  <span className="text-center text-xs text-gray-500">
                    There is currently no data for this coin, try to search for famous coins like Bitcoin, Ethereum, Monero, etc...
                  </span>
                  <span className="text-xs mt-2 text-gray-400">
                    We use <a href="https://www.coingecko.com/en/api/documentation" target="_blank" rel="noopener noreferrer">Coingecko API</a>
                  </span>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoChartCard
