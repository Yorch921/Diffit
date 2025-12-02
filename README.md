# Diffit - Gestión de Entrenamiento y Nutrición

Aplicación completa para gestionar entrenamiento y nutrición de clientes, diseñada para entrenadores personales y sus clientes.

## 🎯 Características

### Para Clientes:
- 📋 **Plan Nutricional**: Visualización de PDF con el plan vigente
- 💪 **Plan de Entrenamiento**: Gestión semanal de sesiones y ejercicios
  - Identificación automática de la semana actual
  - Registro de ejercicios con repeticiones, carga y RIR
  - Historial de entrenamientos previos
  - Formularios de seguimiento post-entrenamiento
- ⚖️ **Control de Peso**: Registro y gráficos de evolución con media semanal
- 📁 **Archivos y Fotos**: Almacenamiento de fotos de progreso y documentos
- 📊 **Estadísticas**:
  - Calendario de sesiones completadas
  - Evolución del peso
  - Resumen de progreso mensual

### Para Entrenadores:
- 👥 **Panel de Administración**: Vista general de todos los clientes
- 📝 **Gestión de Planes**: Creación y asignación de dietas y entrenamientos
- 📈 **Seguimiento**: Monitoreo del progreso de clientes

## 🚀 Stack Tecnológico

- **Next.js 14** (App Router) - Framework React full-stack
- **TypeScript** - Type safety
- **Prisma + PostgreSQL** - ORM y base de datos
- **NextAuth.js** - Autenticación
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos y visualizaciones
- **date-fns** - Manejo de fechas

## 📦 Instalación

### Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Diffit
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/diffit"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-seguro-aqui"
NODE_ENV="development"
```

4. **Configurar base de datos**
```bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# (Opcional) Poblar base de datos con datos de prueba
npm run db:seed
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Credenciales de Prueba (después del seed)

- **Entrenador**: `trainer@diffit.com` / `password123`
- **Cliente**: `cliente@diffit.com` / `password123`

## 📁 Estructura del Proyecto

```
Diffit/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts           # Script de datos iniciales
├── public/
│   └── uploads/          # Archivos subidos (PDFs, imágenes, videos)
├── src/
│   ├── app/
│   │   ├── api/          # API Routes
│   │   │   ├── auth/     # Autenticación
│   │   │   ├── training/ # Endpoints de entrenamiento
│   │   │   ├── weight/   # Endpoints de peso
│   │   │   └── files/    # Endpoints de archivos
│   │   ├── dashboard/    # Panel del cliente
│   │   │   ├── nutrition/
│   │   │   ├── training/
│   │   │   ├── weight/
│   │   │   ├── files/
│   │   │   └── stats/
│   │   ├── admin/        # Panel del entrenador
│   │   ├── login/        # Página de login
│   │   └── layout.tsx    # Layout principal
│   ├── components/
│   │   ├── ui/           # Componentes de UI reutilizables
│   │   └── dashboard-nav.tsx
│   ├── lib/
│   │   ├── auth.ts       # Configuración de NextAuth
│   │   ├── prisma.ts     # Cliente de Prisma
│   │   └── utils.ts      # Utilidades
│   └── types/
│       └── next-auth.d.ts # Tipos de NextAuth
└── package.json
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build           # Compilar para producción
npm start               # Iniciar en producción

# Base de Datos
npm run db:generate     # Generar cliente de Prisma
npm run db:migrate      # Ejecutar migraciones
npm run db:seed         # Poblar con datos de prueba
npm run db:studio       # Abrir Prisma Studio (GUI)

# Calidad de Código
npm run lint            # Ejecutar ESLint
```

## 🗄️ Modelos de Base de Datos

### Principales Entidades

- **User**: Usuarios (clientes y entrenadores)
- **NutritionPlan**: Planes nutricionales con PDF
- **TrainingPlan**: Planes de entrenamiento
- **TrainingWeek**: Semanas de entrenamiento
- **TrainingSession**: Sesiones individuales
- **Exercise**: Ejercicios con descripción y video
- **WorkoutSession**: Sesiones completadas con datos
- **ExerciseData**: Datos de ejercicios (reps, peso, RIR)
- **WeightEntry**: Registro de peso
- **File**: Archivos y fotos subidos
- **Notification**: Sistema de notificaciones

## 🔐 Autenticación y Roles

La aplicación tiene 3 roles:
- **CLIENT**: Acceso al dashboard del cliente
- **TRAINER**: Acceso al panel de administración
- **ADMIN**: Acceso completo (para futuras funcionalidades)

## 📝 Funcionalidades Implementadas

### ✅ Completadas

- [x] Sistema de autenticación con NextAuth
- [x] Dashboard de cliente con menú principal
- [x] Visualización de plan nutricional (PDF)
- [x] Plan de entrenamiento con semanas y sesiones
- [x] Identificación automática de semana actual
- [x] Bloqueo de semanas futuras
- [x] Registro de ejercicios con datos históricos
- [x] Formulario post-entrenamiento (estado, fatiga, agua)
- [x] Control de peso con calendario
- [x] Gráfico de evolución de peso
- [x] Subida y gestión de archivos/fotos
- [x] Estadísticas con calendario de sesiones
- [x] Panel básico de administración
- [x] Sistema de almacenamiento de archivos

### 🔄 En Desarrollo

- [ ] Panel completo de administración para entrenadores
- [ ] Creación de planes de entrenamiento desde admin
- [ ] Subida de planes nutricionales desde admin
- [ ] Sistema de notificaciones push
- [ ] Integración con Google Drive
- [ ] Recordatorios automáticos
- [ ] Modo responsive optimizado para móvil

## 🚧 Próximas Funcionalidades

1. **Panel de Administración Completo**
   - Crear/editar planes de entrenamiento
   - Subir planes nutricionales
   - Asignar planes a clientes
   - Ver progreso detallado de clientes

2. **Sistema de Notificaciones**
   - Recordatorios de entrenamiento
   - Solicitud de fotos cada 4 semanas
   - Notificaciones de nuevos planes

3. **Mejoras de UX**
   - Aplicación web progresiva (PWA)
   - Modo offline
   - Optimización móvil

## 🐛 Solución de Problemas

### Error al instalar dependencias

Si hay problemas con Prisma durante la instalación:
```bash
# Instalar sin hooks
npm install --ignore-scripts

# Generar Prisma manualmente
npm run db:generate
```

### Error de conexión a base de datos

1. Verificar que PostgreSQL esté corriendo
2. Confirmar credenciales en `.env`
3. Crear base de datos si no existe:
```bash
createdb diffit
```

### Archivos no se suben

Verificar que el directorio `public/uploads` tenga permisos de escritura:
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👨‍💻 Autor

Desarrollado para gestión de entrenamiento personal y nutrición

## 📞 Soporte

Para reportar bugs o solicitar funcionalidades, por favor abre un issue en el repositorio.
