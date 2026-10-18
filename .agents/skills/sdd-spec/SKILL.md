---
name: sdd-spec
description: Redacta una especificación SDD en español para una funcionalidad acordada del dashboard.
---

# Fase `spec`

Lee `docs/constitution.md`, `AGENTS.md`, `MEMORY.md` y confirma el contexto del producto y solicitudes existentes. No redactes para un Diario de Estudio: el producto es Network Monitoring Dashboard y sus registros son datos de prueba.

Usa el siguiente número disponible y crea únicamente `specs/NNN-nombre-kebab-case/spec.md`. Escribe el qué y el porqué, sin stack, arquitectura, nombres de archivos ni plan de implementación. Sigue la plantilla del proyecto: contexto y objetivo, usuarios/actores, historias de usuario, requisitos funcionales `RF-x` con criterios EARS en español, requisitos no funcionales aplicables, casos límite, fuera de alcance, criterios de finalización y dudas abiertas. Requisitos y criterios deben ser observables; no inventes respuestas para decisiones materiales.

Registra `Estado: Pendiente de aprobación`. El coordinador ejecuta QA de solo lectura con `sdd_reviewer` antes de presentar la spec; corrige solo cuando el coordinador te devuelva hallazgos y decisiones confirmadas. No avances a `plan`, no cambies código y no marques aprobaciones.
