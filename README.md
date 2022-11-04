


------------------------------ PRÁCTICA 2 ------------------------
Enunciado: 

Para esta segunda practica se os pide que realizar la API para un banco. Para ello se piden los siguientes endpoints:
- getUser/email -> devolvera el usuario que se le pase por parametros
- addUser -> Añadira un usuario a la base de datos del banco
    Email
    Nombre
    Apellido
    Telefono
    DNI
- deleteUser/email -> eliminara un usuario de la base de datos del banco
- addTransaction -> Añadira una transaccion a un usuario.

La base de datos debera constar de las siguientes colecciones
   - Users:
        DNI: unico
        Nombre
        Apellidos
        Telefono: unico
        Email: unico
        IBAN: unico
        ID: unico
Los datos como el IBAN, email y DNI deberan asegurarse que cumple con los formatos concretos
    - Transactions:
        ID_Sender
        ID_Reciber
        amount

Los ID deberan ser los ID de la coleccion Users

Hay que crear el IBAN y el ID para cada usuario

Para la realizacion de esta practica se tendra en cuenta lo siguiente:
  - Se gestionen los errores, si el servidor se para por un error sera un suspenso
  - Siempre se devuelva una respuesta a las peticiones
  - Se usen los HTTP Codes correctos en cada peticion
  - Se usen los metodos correctos segun lo visto en clase

Información Extra:
  - He añadido la operación de transacción al usuario emisor para no sobrecargar los objetos durante el desarrollo
  - El filtrado de usuarios lo he hecho desde el email
  - El IBAN se genera juntando las dos primeras letras del nombre junto con 18 números aleatorios
  - El id se genera sumandole 1 al tamaño del array de usuarios
  
