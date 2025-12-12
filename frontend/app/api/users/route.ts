// TODO: Implement users API routes
export const dynamic = "force-static"
export const revalidate = false

export async function GET() {
  return Response.json({ message: 'Not implemented' }, { status: 501 })
}
