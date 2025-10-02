import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    // Get customer profile first (should exist from when user was created)
    let clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    })

    // If client profile doesn't exist, create one
    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
        data: { userId }
      })
    }

    // Get all addresses for the customer
    const addresses = await prisma.address.findMany({
      where: { clientId: clientProfile.id },
      orderBy: [
        { isDefault: 'desc' } // Default addresses first
      ]
    })

    // Transform data for frontend
    const transformedAddresses = addresses.map(address => ({
      id: address.id,
      type: address.type,
      area: address.area,
      block: address.block,
      road: address.road,
      building: address.building,
      flat: address.flat,
      additionalInfo: address.additionalInfo,
      isDefault: address.isDefault
    }))

    return NextResponse.json({
      success: true,
      addresses: transformedAddresses
    })

  } catch (error) {
    console.error('Customer addresses API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    let clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    })

    // If client profile doesn't exist, create one
    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
        data: { userId }
      })
    }

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { clientId: clientProfile.id },
        data: { isDefault: false }
      })
    }

    // Create new address
    const newAddress = await prisma.address.create({
      data: {
        clientId: clientProfile.id,
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
      message: 'Address created successfully',
      address: {
        id: newAddress.id,
        type: newAddress.type,
        area: newAddress.area,
        block: newAddress.block,
        road: newAddress.road,
        building: newAddress.building,
        flat: newAddress.flat,
        additionalInfo: newAddress.additionalInfo,
        isDefault: newAddress.isDefault
      }
    })

  } catch (error) {
    console.error('Create address API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create address' },
      { status: 500 }
    )
  }
}
