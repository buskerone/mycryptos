import { useContext } from 'react'
import { FiX } from 'react-icons/fi'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import CryptoContext from '../../context/CryptoContext'

const CryptoChartCard = ({ name }) => {
  const options = {
    title: {
      text: name,
      style: {
        color: 'white'
      }
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
      data: [1, 2, 3]
    }],
    chart: {
      width: 150,
      height: 150,
      backgroundColor: 'transparent'
    }
  }

  const { setSelectedCoins } = useContext(CryptoContext)

  return (
    <div className="group relative max-w-4xl mx-auto antialiased">
      <button
        onClick={() => setSelectedCoins((prevCoins) => {
          return prevCoins.filter(c => c !== name)
        })}
        className="group-hover:opacity-100 transition ease-in-out opacity-0 hover:bg-gray-200 rounded-full h-6 w-6 bg-gray-100 shadow-xl flex justify-center items-center text-black absolute top-4 right-1">
        <FiX size={12} />
      </button>
      <div className="flex items-center justify-center">
        <div className="flex max-w-sm w-full sm:w-full lg:w-full py-6 px-3">
          <div className="px-4 py-4 text-white bg-[#1D1E1F] text-left shadow-lg shadow-[#040807] rounded-lg overflow-hidden">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoChartCard
