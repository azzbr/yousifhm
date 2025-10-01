'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Loader2 } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface RevenueChartProps {
  period: string
}

interface ChartData {
  labels: string[]
  revenue: number[]
  bookings: number[]
  totalRevenue: string
  totalBookings: number
  averageRevenue: string
  growthRate: string
}

export default function RevenueChart({ period }: RevenueChartProps) {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/analytics/revenue-trends?period=${period}`)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
          setError(null)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError('Failed to load chart data')
        console.error('Chart data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading revenue data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue (BHD)',
        data: data.revenue,
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Bookings',
        data: data.bookings,
        borderColor: 'rgb(16, 185, 129)', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y1',
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `Revenue & Bookings Trends (${period.replace('months', ' Months').replace('1year', '1 Year')})`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              // Revenue
              label += `BD ${context.parsed.y.toFixed(2)}`;
            } else {
              // Bookings
              label += `${context.parsed.y} bookings`;
            }

            // Add growth info for latest month if available
            if (context.dataIndex === data.labels.length - 1 && data) {
              if (context.datasetIndex === 0 && data.growthRate) {
                const growth = parseFloat(data.growthRate)
                label += ` (${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% MoM)`;
              }
            }

            return label;
          }
        }
      },
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (BHD)'
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Bookings Count'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{data.totalRevenue} BD</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{data.totalBookings}</p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{data.averageRevenue} BD</p>
          <p className="text-sm text-gray-600">Avg Revenue</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center">
            <p className={`text-2xl font-bold ${parseFloat(data.growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(data.growthRate) >= 0 ? '+' : ''}{data.growthRate}%
            </p>
          </div>
          <p className="text-sm text-gray-600">MoM Growth</p>
        </div>
      </div>

      {/* Period info */}
      <div className="text-center text-sm text-gray-500">
        Showing data for the last {period.replace('months', ' months').replace('1year', ' year')}
      </div>
    </div>
  )
}
