---
# **Flujo de Desarrollo: De Código Local a Producción en la Nube**

Este documento describe el flujo de trabajo utilizado para desarrollar, probar y desplegar código en producción siguiendo un proceso manual basado en ramas (`dev`, `test`, `main`) y despliegue en una máquina virtual en AWS. El flujo asegura que el código pase por múltiples etapas de validación antes de llegar a producción.
---

# **Resumen del Flujo**

El flujo de desarrollo sigue estos pasos clave:

1. **Local:** Los cambios se realizan en las máquinas locales de los desarrolladores.
2. **Rama `dev`:** Los cambios se fusionan con la rama `dev` para pruebas iniciales.
3. **Rama `test`:** Los cambios se fusionan con la rama `test` para pruebas más rigurosas.
4. **Rama `main`:** Los cambios listos para producción se fusionan con la rama `main`.
5. **Despliegue en la Nube:** Un desarrollador conecta la máquina virtual en AWS, realiza un `git pull` y reinicia los servicios con `docker-compose restart`.

Este flujo garantiza que el código sea probado exhaustivamente antes de ser desplegado en producción.

---

## **Diagrama del Flujo**

```plaintext
+-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |
|   Código Local    +------>+      Rama dev     +------>+     Rama test     +------>+     Rama main    |
|                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+
                                                                                              |
                                                                                              v
                                                                                   +-------------------+
                                                                                   |                   |
                                                                                   |   Máquina Virtual |
                                                                                   |       (AWS)       |
                                                                                   |                   |
                                                                                   +-------------------+
```

---

## **Pasos Detallados del Flujo**

### **1. Código Local**

- Los desarrolladores trabajan en sus máquinas locales, creando nuevas características o corrigiendo errores.
- Se utiliza una rama de feature (`feature/...`) para cada tarea específica.
- Ejemplo:

  ```bash
  git checkout -b feature/nueva-funcionalidad
  ```

### **2. Fusión a la Rama `dev`**

- Una vez completada la tarea, el código se fusiona con la rama `dev` mediante un **Pull Request (PR)**.
- En este punto, se realizan revisiones de código y pruebas básicas.
- Comando para fusionar:

  ```bash
  git checkout dev
  git merge feature/nueva-funcionalidad
  git push origin dev
  ```

### **3. Fusión a la Rama `test`**

- La rama `dev` se fusiona con la rama `test` para realizar pruebas más rigurosas.
- Aquí se ejecutan pruebas manuales o automatizadas para validar las funcionalidades.
- Comando para fusionar:

  ```bash
  git checkout test
  git merge dev
  git push origin test
  ```

### **4. Fusión a la Rama `main`**

- Una vez que el código ha pasado todas las pruebas en la rama `test`, se fusiona con la rama `main`.
- Esta es la rama principal que contiene el código listo para producción.
- Comando para fusionar:

  ```bash
  git checkout main
  git merge test
  git push origin main
  ```

### **5. Conexión a la Máquina Virtual en AWS**

- Accede a la máquina virtual en AWS donde está alojada la aplicación.
- Usa SSH para conectarte a la máquina:

  ```bash
  ssh ubuntu@<TU_IP_O_HOST_AWS>
  ```

- Asegúrate de tener acceso a la carpeta donde está el proyecto.

### **6. Actualizar el Código**

- Dentro de la máquina virtual, navega al directorio del proyecto y ejecuta un `git pull` para traer los cambios más recientes desde la rama `main`:

  ```bash
  cd /ruta/a/tu/proyecto
  git pull origin main
  ```

### **7. Reiniciar Servicios con Docker Compose**

- Una vez que el código esté actualizado, reinicia los contenedores de Docker para aplicar los cambios:

  ```bash
  docker-compose restart
  ```

### **8. Verificar el Despliegue**

- Accede a la aplicación en producción para asegurarte de que los cambios se han aplicado correctamente.
- Si hay problemas, revisa los logs de Docker para diagnosticar errores:

  ```bash
  docker-compose logs
  ```

---

## **Herramientas Utilizadas**

### **Control de Versiones**

- **Git:** Para manejar el control de versiones y las ramas.
- **GitHub/GitLab:** Para gestionar los repositorios y los Pull Requests.

### **Pruebas**

- **Manuales:** Pruebas realizadas directamente en las ramas `dev` y `test`.
- **Automatizadas (opcional):** Scripts o herramientas como Jest, Mocha, etc., para pruebas unitarias e integración.

### **Infraestructura**

- **AWS:** La máquina virtual en AWS aloja la aplicación en producción.
- **Docker Compose:** Para gestionar los contenedores de la aplicación.

---

## **Ventajas del Flujo Actual**

1. **Etapas Claras:** El código pasa por múltiples etapas (`dev`, `test`, `main`) antes de llegar a producción, asegurando su calidad.
2. **Control Total:** Tienes control completo sobre cada paso del despliegue.
3. **Bajo Costo:** No se necesitan herramientas adicionales ni servicios de CI/CD.

---

## **Desventajas del Flujo Actual**

1. **Manual:** Requiere intervención humana en cada etapa del flujo.
2. **Propenso a Errores:** Si olvidas algún paso o algo falla durante el proceso, puede llevar tiempo diagnosticar y corregir.
3. **Escalabilidad Limitada:** A medida que el proyecto crece, este enfoque puede volverse ineficiente.

---

## **Posibles Mejoras Futuras**

Aunque el flujo actual funciona, puedes considerar implementar herramientas de **CI/CD** (Integración Continua / Entrega Continua) para automatizar el proceso. Algunas opciones incluyen:

- **GitHub Actions:** Automatiza el despliegue cuando se hace un `push` a la rama `main`.
- **Jenkins:** Herramienta robusta para pipelines personalizados.
- **AWS CodeDeploy:** Herramienta nativa de AWS para despliegues automatizados.

Estas herramientas pueden reducir errores humanos, mejorar la eficiencia y escalar mejor con el crecimiento del proyecto.

---

## **Conclusión**

Este flujo manual es funcional y adecuado para proyectos pequeños o medianos. Sin embargo, a medida que el proyecto crezca, considera adoptar herramientas de automatización para optimizar el proceso de despliegue. Si tienes sugerencias o preguntas sobre este flujo, ¡no dudes en abrir un issue!

---
