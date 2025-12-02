import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatWeight } from '@/lib/utils'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function StatsPage() {
  const session = await getServerSession(authOptions)

  // Obtener sesiones completadas
  const completedSessions = await prisma.workoutSession.findMany({
    where: {
      userId: session!.user.id,
    },
    include: {
      session: {
        include: {
          week: true,
        },
      },
    },
    orderBy: {
      completedAt: 'desc',
    },
  })

  // Obtener entradas de peso
  const weightEntries = await prisma.weightEntry.findMany({
    where: {
      userId: session!.user.id,
    },
    orderBy: {
      date: 'desc',
    },
    take: 10,
  })

  // Calcular estadísticas
  const totalWorkouts = completedSessions.length
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  const workoutsThisMonth = completedSessions.filter((session) => {
    const date = new Date(session.completedAt)
    return date >= monthStart && date <= monthEnd
  }).length

  // Calcular días del mes
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Agrupar sesiones por día
  const sessionsByDay = completedSessions.reduce((acc, session) => {
    const dateKey = format(new Date(session.completedAt), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(session)
    return acc
  }, {} as Record<string, typeof completedSessions>)

  // Calcular progreso de peso
  let weightProgress = 0
  if (weightEntries.length >= 2) {
    const latest = weightEntries[0].weight
    const oldest = weightEntries[weightEntries.length - 1].weight
    weightProgress = latest - oldest
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p className="mt-2 text-gray-600">
          Visualiza tu progreso y rendimiento
        </p>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Entrenamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalWorkouts}</div>
            <p className="text-xs text-gray-500 mt-1">Sesiones completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Este Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{workoutsThisMonth}</div>
            <p className="text-xs text-gray-500 mt-1">Entrenamientos en {format(currentMonth, 'MMMM', { locale: es })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Progreso de Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${weightProgress < 0 ? 'text-green-600' : weightProgress > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {weightProgress > 0 ? '+' : ''}{weightProgress.toFixed(1)} kg
            </div>
            <p className="text-xs text-gray-500 mt-1">Últimos {weightEntries.length} registros</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendario de sesiones */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            Calendario - {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Espacios vacíos para alinear el primer día */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const hasSessions = sessionsByDay[dateKey]
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={dateKey}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm
                    ${hasSessions ? 'bg-green-500 text-white font-bold' : 'bg-gray-100 text-gray-600'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  {format(day, 'd')}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>Entrenamiento completado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100" />
              <span>Sin entrenamientos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimas sesiones completadas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Últimas Sesiones Completadas</CardTitle>
        </CardHeader>
        <CardContent>
          {completedSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay sesiones completadas aún
            </div>
          ) : (
            <div className="space-y-3">
              {completedSessions.slice(0, 5).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{workout.session.name}</h4>
                    <p className="text-sm text-gray-600">
                      Semana {workout.session.week.weekNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatDate(workout.completedAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Estado: {workout.emotionalState}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evolución de peso */}
      {weightEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weightEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatWeight(entry.weight)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  {index < weightEntries.length - 1 && (
                    <div className={`text-sm font-medium ${
                      entry.weight < weightEntries[index + 1].weight
                        ? 'text-green-600'
                        : entry.weight > weightEntries[index + 1].weight
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {entry.weight < weightEntries[index + 1].weight && '↓ '}
                      {entry.weight > weightEntries[index + 1].weight && '↑ '}
                      {Math.abs(entry.weight - weightEntries[index + 1].weight).toFixed(1)} kg
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
