import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || ((session?.user as any)?.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const serviceAreas = searchParams.getAll('serviceArea')
    const specialties = searchParams.getAll('specialty')

    // Build where clause based on filters
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (serviceAreas.length > 0) {
      where.serviceAreas = {
        hasSome: serviceAreas
      }
    }
    if (specialties.length > 0) {
      // For specialties, we need to check if technician has the service in their specialties relation
      where.specialties = {
        some: {
          category: {
            in: specialties
          }
        }
      }
    }

    // Fetch technicians with related data
    const technicians = await prisma.technicianProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true
          }
        },
        specialties: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        bookings: {
          select: {
            id: true,
            status: true,
            scheduledDate: true,
            service: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { status: 'desc' }, // Active first
        { createdAt: 'desc' }
      ]
    })

    // Get technician statistics
    const stats = {
      total: technicians.length,
      active: technicians.filter(t => (t as any).status === 'ACTIVE').length,
      inactive: technicians.filter(t => (t as any).status === 'INACTIVE').length,
      suspended: technicians.filter(t => (t as any).status === 'SUSPENDED').length,
      underReview: technicians.filter(t => (t as any).status === 'UNDER_REVIEW').length,
      averageRating: technicians.length > 0
        ? technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length
        : 0,
      totalCompletedJobs: technicians.reduce((sum, t) => sum + t.completedJobs, 0)
    }

    return NextResponse.json({
      success: true,
      technicians,
      stats,
      message: 'Technicians retrieved successfully'
    })

  } catch (error) {
    console.error('Admin technicians fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch technicians' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || ((session.user as any)?.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { technicianId, action, data } = await request.json()

    if (!technicianId) {
      return NextResponse.json(
        { success: false, message: 'Technician ID is required' },
        { status: 400 }
      )
    }

    const technician = await prisma.technicianProfile.findUnique({
      where: { id: technicianId },
      include: { user: true }
    })

    if (!technician) {
      return NextResponse.json(
        { success: false, message: 'Technician not found' },
        { status: 404 }
      )
    }

    let result

    // Handle different admin actions
    switch (action) {
      case 'approve':
        result = await prisma.technicianProfile.update({
          where: { id: technicianId },
          data: {
            status: 'ACTIVE',
            verified: true
          }
        })
        break

      case 'suspend':
        result = await prisma.technicianProfile.update({
          where: { id: technicianId },
          data: {
            status: 'SUSPENDED',
            internalNotes: data?.reason || 'Suspended by admin'
          }
        })
        break

      case 'activate':
        result = await prisma.technicianProfile.update({
          where: { id: technicianId },
          data: { status: 'ACTIVE' }
        })
        break

      case 'rate':
        result = await prisma.technicianProfile.update({
          where: { id: technicianId },
          data: { adminRating: data?.rating }
        })
        break

      case 'update':
        // Update technician profile data
        const updateData: any = {}
        if (data?.commissionRate !== undefined) updateData.commissionRate = data.commissionRate
        if (data?.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate
        if (data?.maxJobsPerDay !== undefined) updateData.maxJobsPerDay = data.maxJobsPerDay
        if (data?.internalNotes !== undefined) updateData.internalNotes = data.internalNotes

        result = await prisma.technicianProfile.update({
          where: { id: technicianId },
          data: updateData
        })
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      technician: result,
      message: `Technician ${action}d successfully`
    })

  } catch (error) {
    console.error('Admin technician action error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to perform technician action' },
      { status: 500 }
    )
  }
}

// PATCH endpoint for bulk operations (optional)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { action, techniciansIds } = await request.json()

    if (!Array.isArray(techniciansIds) || techniciansIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid technician IDs array required' },
        { status: 400 }
      )
    }

    let bulkResult

    switch (action) {
      case 'bulkActivate':
        bulkResult = await prisma.technicianProfile.updateMany({
          where: { id: { in: techniciansIds } },
          data: { status: 'ACTIVE' }
        })
        break

      case 'bulkSuspend':
        bulkResult = await prisma.technicianProfile.updateMany({
          where: { id: { in: techniciansIds } },
          data: { status: 'SUSPENDED' }
        })
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid bulk action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      count: bulkResult.count,
      message: `${bulkResult.count} technicians ${action === 'bulkActivate' ? 'activated' : 'suspended'} successfully`
    })

  } catch (error) {
    console.error('Admin technician bulk action error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
