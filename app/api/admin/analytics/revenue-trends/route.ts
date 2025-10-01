import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.role || ((session.user as any)?.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '6months' // 3months, 6months, 1year

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    }

    // Get monthly revenue data
    const monthlyData = await prisma.booking.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'COMPLETED'
      },
      _sum: {
        finalPrice: true
      },
      _count: true,
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by month for chart data
    const monthlyRevenue: Record<string, number> = {}
    const monthlyBookings: Record<string, number> = {}

    monthlyData.forEach(item => {
      const date = new Date(item.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0
        monthlyBookings[monthKey] = 0
      }

      // Convert from cents to BHD (if using payment amounts)
      monthlyRevenue[monthKey] += (item._sum.finalPrice || 0) / 100
      monthlyBookings[monthKey] += item._count
    })

    // Convert to chart-ready format
    const labels: string[] = []
    const revenueData: number[] = []
    const bookingData: number[] = []

    // Generate all months in range to ensure all months are included
    let currentDate = new Date(startDate)
    while (currentDate <= now) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
      labels.push(currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))

      revenueData.push(monthlyRevenue[monthKey] || 0)
      bookingData.push(monthlyBookings[monthKey] || 0)

      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Calculate growth metrics
    const totalRevenue = revenueData.reduce((sum, val) => sum + val, 0)
    const totalBookings = bookingData.reduce((sum, val) => sum + val, 0)
    const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    // calculate month-over-month growth
    const growthRate = revenueData.length >= 2 ?
      ((revenueData[revenueData.length - 1] - revenueData[revenueData.length - 2]) /
       Math.max(revenueData[revenueData.length - 2], 1)) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        labels,
        revenue: revenueData,
        bookings: bookingData,
        totalRevenue: totalRevenue.toFixed(2),
        totalBookings,
        averageRevenue: averageRevenue.toFixed(2),
        growthRate: growthRate.toFixed(1),
        period
      },
      message: 'Revenue trends retrieved successfully'
    })

  } catch (error) {
    console.error('Revenue trends error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue trends' },
      { status: 500 }
    )
  }
}
