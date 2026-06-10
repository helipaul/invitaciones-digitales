export interface MesaRegalo {
  tienda: string
  url: string
}

export interface EventData {
  nombre: string
  apellido: string
  fecha: Date
  mensaje: string
  padres: string[]
  padrinos: string[]
  misa: { hora: string; lugar: string; direccion: string }
  recepcion: { hora: string; lugar: string; direccion: string }
  googleMapsUrl: string
  vestimenta: { descripcion: string; colores: string[]; notas: string }
  mesaRegalos: MesaRegalo[]
}

export const event: EventData = {
  nombre: "Valentina",
  apellido: "Ramírez López",
  fecha: new Date("2026-08-15T19:00:00"),
  mensaje:
    "Con todo el amor del mundo te invitamos a compartir este momento tan especial. " +
    "Este día marcará el inicio de una nueva etapa llena de sueños, y no podría imaginarlo sin ti a mi lado.",
  padres: ["Carlos Ramírez Flores", "María López de Ramírez"],
  padrinos: ["Roberto y Ana Gómez", "Luis y Carmen Hernández"],
  misa: {
    hora: "18:00",
    lugar: "Parroquia San Francisco de Asís",
    direccion: "Av. Insurgentes Sur 1234, Benito Juárez, CDMX",
  },
  recepcion: {
    hora: "20:00",
    lugar: "Salón Jardines del Rey",
    direccion: "Blvd. Manuel Ávila Camacho 2500, Lomas de Chapultepec, CDMX",
  },
  googleMapsUrl:
    "https://maps.google.com/?q=Salon+Jardines+del+Rey+Lomas+de+Chapultepec+Mexico+City",
  vestimenta: {
    descripcion: "Formal",
    colores: ["Rosa", "Blanco", "Dorado"],
    notas: "Por favor evita el negro y el rojo.",
  },
  mesaRegalos: [
    { tienda: "Liverpool", url: "https://mesaderegalos.liverpool.com.mx" },
    { tienda: "El Palacio de Hierro", url: "https://www.elpalaciodehierro.com" },
  ],
}
