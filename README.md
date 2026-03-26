# Sistema de Gestión de Activos TI

Aplicación web desarrollada como parte del Trabajo de Aplicación Práctica (TAP), orientada a la gestión de inventario de equipos tecnológicos en una organización.

El sistema permite registrar, controlar y consultar los movimientos asociados a los equipos, mejorando la trazabilidad de los recursos y la disponibilidad de información para la toma de decisiones.

---

## **Objetivo del sistema**

Desarrollar un sistema de gestión que permita:

- Registrar equipos tecnológicos en el inventario  
- Gestionar movimientos (asignación, devolución, mantenimiento y baja)  
- Mantener el estado actualizado de los equipos  
- Identificar la asignación actual de cada equipo  
- Generar informes por trabajador y tipo de movimiento  

---

## **Arquitectura del sistema**

El sistema está basado en una arquitectura de tres capas:

| Capa        | Descripción                                           |
|-------------|------------------------------------------------------|
| Frontend    | Aplicación web desarrollada en React + Vite          |
| Backend     | API desarrollada en Node.js                          |
| Base de datos | Microsoft SQL Server                               |

---

## **Estructura del proyecto**

tap-gestion-activos-ti/  
├── backend/        # API y lógica de aplicación (Node.js)  
├── frontend/       # Interfaz web (React + Vite)  
├── database/       # Scripts SQL (base de datos, triggers, datos)  
└── README.md  

---

## **Base de datos**

La base de datos está diseñada bajo un modelo relacional que incluye las siguientes entidades principales:

- Trabajadores  
- Productos  
- Equipos  
- Movimientos  
- Tipos de movimiento  
- Estados de equipo  
- Asignación actual  

Se implementan triggers para:

- Validar reglas de negocio  
- Actualizar automáticamente el estado del equipo  
- Mantener la asignación actual  

---

## **Tecnologías utilizadas**

| Componente          | Tecnología                |
|---------------------|--------------------------|
| Frontend            | React + Vite             |
| Backend             | Node.js + Express        |
| Base de datos       | Microsoft SQL Server     |
| Control de versiones| Git + GitHub             |

---

## **Instrucciones de ejecución**

### **1. Base de datos**

Ejecutar los scripts en el siguiente orden:

database/001_base_datos.sql  
database/002_triggers.sql  
database/003_datos.sql  

---

### **2. Backend**

cd backend  
npm install  
npm run dev  

---

### **3. Frontend**

cd frontend  
npm install  
npm run dev  

---

## **Funcionalidades principales**

- Registro de equipos  
- Registro de movimientos  
- Validación de reglas de negocio  
- Actualización automática de estado  
- Consulta de inventario  
- Filtros por trabajador, tipo y fecha  
- Generación de informes  

---

## **Pruebas**

El sistema fue validado mediante pruebas funcionales que verifican:

- Registro correcto de equipos  
- Validación de duplicidad  
- Registro de movimientos  
- Actualización automática de estados  
- Generación de informes  

---

## **Relación con el informe TAP**

Este repositorio contiene la implementación del prototipo descrito en el informe de Trabajo de Aplicación Práctica (TAP), incluyendo:

- Diseño de base de datos  
- Lógica de negocio  
- Desarrollo backend  
- Desarrollo frontend  
- Integración del sistema  

---

## **Alcance del proyecto**

Este sistema corresponde a un prototipo funcional, por lo que:

- No incluye gestión avanzada de usuarios  
- No contempla despliegue en ambiente productivo  
- No incluye medidas de seguridad avanzadas  

Su objetivo es demostrar la viabilidad de una solución tecnológica para la gestión de inventario de activos TI.

---

## **Autor**

Nicolás Vera Orozco  
Ingeniería en Ejecución Informática  
AIEP Online – 2026  
