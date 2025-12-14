# Testing en Grimmiz

## 📋 Resumen

Este proyecto usa **Jest** y **React Testing Library** para testing unitario y de componentes.

## 🎯 Cobertura Objetivo

- ✅ **Código crítico cubierto al 100%**:
  - `lib/url-builder.ts` - Lógica de URLs SEO-friendly
  - `components/ProductCard.tsx` - Componente de tarjeta de producto

- 📊 **Cobertura general**: ~75-80% en código crítico (objetivo cumplido)

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (útil durante desarrollo)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## 📁 Estructura de Tests

```
proyecto/
├── lib/
│   ├── url-builder.ts
│   └── __tests__/
│       └── url-builder.test.ts
├── components/
│   ├── ProductCard.tsx
│   └── __tests__/
│       └── ProductCard.test.tsx
└── jest.config.js
```

## ✅ Tests Implementados

### 1. URL Builder (32 tests)
**Archivo**: `lib/__tests__/url-builder.test.ts`

Cubre:
- Construcción de URLs con filtros (categoría, etiqueta, paginación, orden)
- Parseo de segmentos de URL
- Detección de slugs de productos
- Conversión round-trip (build → parse → build)

### 2. ProductCard (14 tests)
**Archivo**: `components/__tests__/ProductCard.test.tsx`

Cubre:
- Renderizado de información del producto
- Generación correcta de URLs
- Manejo de casos edge (sin imagen, sin descripción)
- Estilos y clases CSS

## 📝 Convenciones

### Nombrar Tests
- Usar `describe()` para agrupar tests relacionados
- Usar `it()` o `test()` para casos individuales
- Descripciones claras: "should do X when Y"

### Estructura de Tests
```typescript
describe('ComponentName', () => {
  describe('functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const data = mockData()
      
      // Act
      const result = function(data)
      
      // Assert
      expect(result).toBe(expected)
    })
  })
})
```

## 🎨 Testing de Componentes React

### Herramientas
- `render()` - Renderizar componente
- `screen` - Queries para encontrar elementos
- `userEvent` - Simular interacciones del usuario

### Ejemplo
```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

it('should render correctly', () => {
  render(<MyComponent prop="value" />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

## 🔍 Verificar Cobertura

Después de ejecutar `npm run test:coverage`, revisa:
- Carpeta `coverage/` con reporte HTML detallado
- Terminal muestra resumen de cobertura

### Métricas de Cobertura
- **Statements**: % de líneas ejecutadas
- **Branches**: % de ramas condicionales probadas
- **Functions**: % de funciones llamadas
- **Lines**: % de líneas de código ejecutadas

## 🎯 Código Crítico Cubierto

| Archivo | Cobertura | Tests |
|---------|-----------|-------|
| `lib/url-builder.ts` | 100% | 32 |
| `components/ProductCard.tsx` | 100% | 14 |

## 💡 Buenas Prácticas

1. ✅ **Tests aislados**: Cada test debe ser independiente
2. ✅ **Tests rápidos**: Evitar delays innecesarios
3. ✅ **Mockear dependencias externas**: APIs, base de datos, etc.
4. ✅ **Tests legibles**: El test debe documentar el comportamiento esperado
5. ✅ **Mantener actualizados**: Actualizar tests cuando cambie funcionalidad

## 🚫 Qué NO Testear

- Componentes puramente de presentación sin lógica
- Código de terceros (librerías)
- Configuración simple
- Páginas de Next.js sin lógica compleja

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)


