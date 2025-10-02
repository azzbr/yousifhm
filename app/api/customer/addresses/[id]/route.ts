import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any)?.role !== 'CLIENT') {
      return NextResponse.json(
        { success: false, message: 'Customer access required' },
        { status: 403 }
      )
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID not found' },
        { status: 400 }
      )
    }

    const { type, area, block, road, building, flat, additionalInfo, isDefault } = await request.json()

    // Validate required fields
    if (!type || !area || !block || !road || !building) {
      return NextResponse.json(
        { success: false, message: 'Type, area, block, road, and building are required' },
        { status: 400 }
      )
    }

    // Valid type values
    const validTypes = ['HOME', 'OFFICE', 'OTHER']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid address type' },
        { status: 400 }
      )
    }

    // Get customer profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    })

    if (!clientProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      )
    }

    // Verify address ownership
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        clientId: clientProfile.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      )
    }

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { clientId: clientProfile.id },
        data: { isDefault: false }
      })
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: {
        type: type as 'HOME' | 'OFFICE' | 'OTHER',
        area,
        block,
        road,
        building,
        flat,
        additionalInfo,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: {
        id: updatedAddress.id,
        type: updatedAddress.type,
        area: updatedAddress.area,
        block: updatedAddress.block,
        road: updatedAddress.road,
        building: updatedAddress.building,
        flat: updatedAddress.flat,
        additionalInfo: updatedAddress.additionalInfo,
        isDefault: updatedAddress.isDefault
      }
    })

  } catch (error) {
    console.error('Update address API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any)?.role !== 'CLIENT') {
      return NextResponse.json(
        { success: false, message: 'Customer access required' },
        { status: 403 }
      )
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID not found' },
        { status: 400 }
      )
    }

    const { isDefault } = await request.json()

    // Get customer profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    })

    if (!clientProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      )
    }

    // Verify address ownership
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        clientId: clientProfile.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      )
    }

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { clientId: clientProfile.id },
        data: { isDefault: false }
      })
    }

    // Update default status
    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: { isDefault }
    })

    return NextResponse.json({
      success: true,
      message: `Address ${isDefault ? 'set as' : 'removed from'} default`,
      address: {
        id: updatedAddress.id,
        type: updatedAddress.type,
        area: updatedAddress.area,
        block: updatedAddress.block,
        road: updatedAddress.road,
        building: updatedAddress.building,
        flat: updatedAddress.flat,
        additionalInfo: updatedAddress.additionalInfo,
        isDefault: updatedAddress.isDefault
      }
    })

  } catch (error) {
    console.error('Patch address API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any)?.role !== 'CLIENT') {
      return NextResponse.json(
        { success: false, message: 'Customer access required' },
        { status: 403 }
      )
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID not found' },
        { status: 400 }
      )
    }

    // Get customer profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    })

    if (!clientProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      )
    }

    // Verify address ownership and check if it's used in bookings
    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        clientId: clientProfile.id
      },
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS']
            }
          }
        }
      }
    })

    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      )
    }

    // Check if address is being used in upcoming bookings
    if (address.bookings.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete address that is being used in upcoming bookings' },
        { status: 400 }
      )
    }

    // Delete address
    await prisma.address.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Delete address API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
