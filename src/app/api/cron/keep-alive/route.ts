import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Optional: Use Edge Runtime for faster execution and lower cost
export const runtime = 'edge';

export async function GET(request: Request) {
  // 1. Verify the request using Vercel's Cron Secret
  const authHeader = request.headers.get('authorization');
  
  // Vercel automatically sends the CRON_SECRET in the Authorization header
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Initialize Supabase with Service Role Key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Perform a system-level query (Does not require a specific table)
    // This tells the DB to return its version string, which counts as activity.
    const { error } = await supabase
    .from('enquiries') // Use any table name you have (enquiries, users, etc.)
    .select('*', { count: 'exact', head: true })
    .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Database heartbeat sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Heartbeat failed:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}