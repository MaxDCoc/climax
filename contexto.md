Definición del problema



El usuario del sistema es un técnico en refrigeración que realiza instalaciones, reparaciones y servicios periódicos de manera independiente. Actualmente gestiona su trabajo utilizando únicamente su memoria personal y conversaciones por WhatsApp, sin un registro estructurado de clientes ni de los equipos instalados o reparados.



El problema principal es la falta de un registro histórico de clientes, trabajos realizados y fechas relevantes (como instalaciones o últimos servicios), lo que impide al técnico identificar cuándo corresponde realizar mantenimientos preventivos o retomar contacto con clientes anteriores.



Como consecuencia, se pierden oportunidades de trabajo recurrente (como servicios técnicos programados o seguimientos post-instalación) generando una pérdida directa de posibles ingresos y desaprovechando una base de clientes que ya confió previamente en el servicio.



Alcance de la solución



Gestión de clientes



* Registro básico de clientes

&nbsp;	nombre

&nbsp;	teléfono

&nbsp;	dirección (opcional)

* Historial de trabajos por cliente



Gestión de equipos / trabajos

* &nbsp;	Registro de equipos atendidos (ej: aire acondicionado)
* &nbsp;	Fecha del trabajo realizado
* &nbsp;	Tipo de trabajo:

&nbsp;		instalación

&nbsp;		reparación

&nbsp;		service



Seguimiento temporal

* Capacidad de saber:

&nbsp;	cuándo se hizo una instalación

&nbsp;	cuándo fue el último service

* Base para futuros recordatorios (aunque no se automaticen aún)



Uso desde el celular

* Interfaz pensada mobile-first
* No requiere computadora



Casos de uso principales



* Actor principal: Técnico en refrigeración
* Casos de uso

&nbsp;	Registrar cliente

&nbsp;	Registrar equipo

&nbsp;	Registrar servicio realizado

&nbsp;	Consultar historial de cliente

&nbsp;	Visualizar servicios proximos a vencer

&nbsp;	Contactar cliente



Requisitos funcionales y no funcionales



Requisitos funcionales

RF1 — Gestión de clientes

* Registrar un cliente con datos básicos
* Modificar los datos de un cliente
* Eliminar los datos de un cliente
* Visualizar el listado de clientes
* Consultar el historial de un cliente



RF2 — Gestión de equipos

* Registrar equipos asociados a un cliente
* Editar información de un equipo
* Consultar equipos por cliente



RF3 — Registro de servicios

* Registrar servicios realizados (instalación, reparación, service)
* Asociar cada servicio a un equipo
* Visualizar historial de servicios



RF4 — Detección de oportunidades de mantenimiento

* Identificar equipos según tiempo transcurrido desde:

&nbsp;	instalación

&nbsp;	último service

* Visualizar un listado de equipos candidatos a mantenimiento



RF5 — Contacto con clientes

* Acceder rápidamente al contacto del cliente
* Facilitar la comunicación vía WhatsApp u otro medio disponible



RF6 — Gestión básica de observaciones

* Registrar notas libres asociadas a clientes, equipos o servicios



Requisitos no funcionales



RNF1 — Usabilidad

* El sistema debe ser usable desde un dispositivo móvil
* Formularios cortos y simples
* Navegación clara, pensada para uso con una sola mano



RNF2 — Disponibilidad

* El sistema debe funcionar correctamente con conectividad intermitente
* No debe depender de acciones en tiempo real



RNF3 — Simplicidad operativa

* El sistema no debe exigir carga de datos completa
* Los campos opcionales deben poder omitirse



RNF4 — Rendimiento

* Las acciones principales deben responder en tiempos cortos
* El sistema debe priorizar rapidez sobre visuales complejos



RNF5 — Seguridad básica

* El acceso al sistema debe estar restringido al técnico
* No se requieren roles múltiples en esta versión





