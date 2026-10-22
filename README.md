# ☕ Sistema de Gestión de Cafetería & Barista AI Agent

Plataforma integral de gestión transaccional para cafeterías desarrollada sobre arquitectura **MVC** con **Node.js**, **Express** y **PostgreSQL (vía Supabase)**, complementada con un agente inteligente autónomo orquestado en **n8n** y potenciado por modelos de lenguaje (LLM).

---

## 🛠️ Stack Tecnológico

* **Runtime & Servidor:** Node.js, Express.js.
* **Persistencia & Base de Datos:** PostgreSQL en Supabase.
* **Control de Transacciones:** Conexión nativa con sentencias `BEGIN`, `COMMIT` y `ROLLBACK`.
* **Testing & Validación de API:** Postman (Collection v2.1).
* **Orquestación de IA & Flujos:** n8n (AI Agent, LangChain Nodes, Window Buffer Memory, Tools HTTP).
* **Modelo LLM:** DeepSeek / OpenAI.

---

## 🏗️ Arquitectura del Sistema (MVC)

El backend implementa una separación estricta de responsabilidades:

```text
backend/
├── src/
│   ├── controllers/        # Controladores (insumos, productos, pedidos)
│   ├── middlewares/        # Validación y manejo global de errores
│   ├── migrations/         # Scripts e inicialización de esquemas SQL
│   ├── models/             # Lógica de acceso a datos y sentencias SQL
│   ├── routes/             # Enrutamiento modular de la API
│   ├── services/           # Lógica de negocio y transacciones
│   ├── db.js               # Pool de conexión a PostgreSQL (Supabase)
│   └── server.js           # Inicialización del servidor Express y middlewares
├── Cafeteria_API.postman_collection.json  # Colección exportada de pruebas
├── workflow_cafeteria_agent.json          # Workflow exportado de n8n
├── .env.example            # Variables de entorno requeridas (plantilla)
├── .gitignore              # Exclusiones de Git (node_modules, .env)
├── package.json
└── README.md
```

---

## 📋 Reglas de Negocio & Consistencia Transaccional

* **Gestión de Insumos por Receta:** Cada producto del menú está vinculado a una o más recetas compuestas por insumos específicos (ej. café en grano, leche, vasos, jarabes).
* **Cálculo Impositivo:** Se aplica automáticamente el 13% de impuesto sobre el valor agregado (IVA) sobre el subtotal calculado a partir de los precios unitarios vigentes.

### Atomicidad de Inventario (ACID)

* El registro de un pedido se procesa dentro de una transacción de base de datos (`BEGIN`).
* Se comprueba la disponibilidad de stock en tiempo real mediante un bloqueo preventivo.
* Si todos los insumos requeridos tienen existencias suficientes, se actualizan las existencias y se confirma la orden (`COMMIT`).
* Si cualquier insumo presenta stock insuficiente, se cancela la operación por completo (`ROLLBACK`) retornando un estado `409 Conflict`, evitando inconsistencias o descuentos parciales.

---

## 🔌 Endpoints de la API REST

**Base URL:** `http://localhost:3000/api`

### 1. Insumos

* **`GET /insumos`**
  * **Descripción:** Lista el inventario de insumos registrados, unidades de medida y niveles de stock actual.
  * **Respuesta Exitosa:** `200 OK`

### 2. Productos

* **`GET /productos`**
  * **Descripción:** Retorna el catálogo completo de productos disponibles, categorías y precios unitarios.
  * **Respuesta Exitosa:** `200 OK`

* **`GET /productos/:id`**
  * **Descripción:** Retorna el detalle de un producto específico junto a su arreglo anidado de insumos (receta).
  * **Respuesta Exitosa:** `200 OK`

### 3. Pedidos (Transaccional)

* **`POST /pedidos`**
  * **Descripción:** Procesa un pedido de compra, valida inventario, descuenta insumos y emite el comprobante.
  * **Métodos de pago admitidos:** `efectivo`, `tarjeta`, `sinpe_movil`.
  * **Cuerpo de la petición (JSON):**

```json
{
  "metodo_pago": "sinpe_movil",
  "items": [
    { "producto_id": 1, "cantidad": 1 },
    { "producto_id": 2, "cantidad": 2 }
  ]
}
```

  * **Respuestas:**
    * **`201 Created`:** Pedido registrado con éxito, retornando subtotal, impuesto (13%) y total.
    * **`400 Bad Request`:** Parámetros faltantes o formato de datos no válido.
    * **`409 Conflict`:** Stock insuficiente de algún insumo requerido (transacción revertida con `ROLLBACK`).

---

## 🧪 Pruebas con Postman

La suite de validación está documentada en el archivo versionado `Cafeteria_API.postman_collection.json`.

| Caso de Prueba | Método | Endpoint | Código Esperado | Propósito de Validación |
| :--- | :---: | :--- | :---: | :--- |
| **1. Listar Insumos** | `GET` | `/insumos` | `200 OK` | Verificación de conexión a PostgreSQL y lectura de inventario. |
| **2. Producto con Receta** | `GET` | `/productos/2` | `200 OK` | Consulta relacional de productos y composición de recetas. |
| **3. Pedido Exitoso** | `POST` | `/pedidos` | `201 Created` | Transacción ACID exitosa, descuento de insumos y cálculo del 13%. |
| **4. Error Stock Insuficiente** | `POST` | `/pedidos` | `409 Conflict` | Manejo de excepciones de negocio y ejecución segura de ROLLBACK. |

### Para importar la colección:

1. Abrir Postman.
2. Hacer clic en **Import**.
3. Seleccionar el archivo `Cafeteria_API.postman_collection.json`.

---

## 🤖 Integración del AI Agent en n8n

El sistema cuenta con un flujo conversacional autónomo diseñado en n8n, encargado de interactuar con el cliente, interpretar peticiones en lenguaje natural y consumir la API del backend mediante herramientas (Function Calling / Tools).

### Arquitectura del Flujo

* **When chat message received (Chat Trigger):** Disparador de interfaz web/chat.
* **AI Agent (LangChain Core):** Nodo central encargado del razonamiento, delimitado por un System Message que restringe sus acciones al contexto de la cafetería.
* **Chat Model:** Proveedor LLM (DeepSeek / OpenAI) para procesamiento de lenguaje natural.
* **Window Buffer Memory:** Mantiene el contexto histórico de la sesión (últimos 10 mensajes).

### Herramientas (Custom Tools)

* **`consultar_menu` (`GET /api/productos`):** Permite al modelo consultar el menú en vivo antes de dar recomendaciones.
* **`crear_pedido` (`POST /api/pedidos`):** Permite al agente ejecutar compras directamente en la base de datos una vez que el cliente confirma el pedido y especifica el método de pago. Captura errores `409` para notificar desabastecimientos de forma amigable.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

* Node.js v18+ y npm.
* Instancia de PostgreSQL en Supabase con las tablas migradas e inicializadas.

### 1. Clonar y configurar variables de entorno

```bash
git clone https://github.com/DanielOR20/Laboratorio2_Backend.git
cd Laboratorio2_Backend/backend
npm install
```

Crea un archivo `.env` en la raíz de `backend/` con las siguientes credenciales:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

### 2. Iniciar el servidor backend

```bash
npm run dev
# El servidor iniciará en http://localhost:3000
```

### 3. Iniciar n8n e importar el workflow

```bash
npx n8n
```

1. Ingresa a `http://localhost:5678`.
2. Ve a **Workflows > Import from File** y selecciona `workflow_cafeteria_agent.json`.
3. Configura tus credenciales del modelo LLM (DeepSeek / OpenAI) y ejecuta las pruebas desde el panel Chat.