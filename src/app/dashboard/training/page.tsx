import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, isCurrentWeek, isFutureWeek } from '@/lib/utils'
import Link from 'next/link'

export default async function TrainingPage() {
  const session = await getServerSession(authOptions)

  const trainingPlans = await prisma.trainingPlan.findMany({
    where: {
      userId: session!.user.id,
      isActive: true,
    },
    include: {
      weeks: {
        include: {
          sessions: {
            include: {
              _count: {
                select: {
                  workoutSessions: true,
                },
              },
            },
          },
        },
        orderBy: {
          weekNumber: 'asc',
        },
      },
    },
  })

  const activePlan = trainingPlans[0]

  if (!activePlan) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plan de Entrenamiento</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-semibold mb-2">
              No tienes un plan de entrenamiento activo
            </h3>
            <p className="text-gray-600">
              Contacta con tu entrenador para obtener tu plan personalizado
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{activePlan.title}</h1>
        {activePlan.description && (
          <p className="mt-2 text-gray-600">{activePlan.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {activePlan.weeks.map((week) => {
          const current = isCurrentWeek(week.startDate, week.endDate)
          const future = isFutureWeek(week.startDate)
          const completedSessions = week.sessions.filter(
            (s) => s._count.workoutSessions > 0
          ).length

          return (
            <Card
              key={week.id}
              className={`${future ? 'opacity-50' : ''} ${current ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Semana {week.weekNumber}
                      {current && (
                        <span className="ml-2 text-sm font-normal text-blue-600">
                          • Semana Actual
                        </span>
                      )}
                      {future && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          • Bloqueada
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(week.startDate)} - {formatDate(week.endDate)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {completedSessions}/{week.sessions.length}
                    </div>
                    <div className="text-sm text-gray-500">completadas</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {week.sessions.map((session) => {
                    const isCompleted = session._count.workoutSessions > 0

                    return (
                      <Link
                        key={session.id}
                        href={future ? '#' : `/dashboard/training/session/${session.id}`}
                        className={`${future ? 'pointer-events-none' : ''}`}
                      >
                        <div
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isCompleted
                              ? 'bg-green-50 border-green-500'
                              : future
                              ? 'bg-gray-50 border-gray-300'
                              : 'bg-white border-gray-200 hover:border-blue-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Día {session.dayNumber}</span>
                            {isCompleted && <span className="text-green-600">✓</span>}
                            {future && <span className="text-gray-400">🔒</span>}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {session.name}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
