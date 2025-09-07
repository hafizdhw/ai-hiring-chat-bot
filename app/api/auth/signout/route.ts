import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { error } = await signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Successfully signed out'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
