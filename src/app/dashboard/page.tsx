import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Plan Nutricional',
    description: 'Visualiza tu plan de alimentación',
    href: '/dashboard/nutrition',
    icon: '🥗',
    color: 'from-green-400 to-green-600',
  },
  {
    title: 'Plan de Entrenamiento',
    description: 'Accede a tus sesiones de entrenamiento',
    href: '/dashboard/training',
    icon: '💪',
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: 'Báscula',
    description: 'Registra y visualiza tu peso',
    href: '/dashboard/weight',
    icon: '⚖️',
    color: 'from-purple-400 to-purple-600',
  },
  {
    title: 'Archivos y Fotos',
    description: 'Gestiona tus fotos de progreso',
    href: '/dashboard/files',
    icon: '📁',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    title: 'Estadísticas',
    description: 'Visualiza tu progreso',
    href: '/dashboard/stats',
    icon: '📊',
    color: 'from-red-400 to-red-600',
  },
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {session?.user.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Selecciona una opción para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-4`}>
                  {item.icon}
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
