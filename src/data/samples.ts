import { CVData } from '../types';
import defaultAvatar from '../assets/images/avatar_cv_portrait_1791968329363.jpg';

export const SAMPLE_CV: CVData = {
  nombre: 'Noemí Vargas',
  puesto: 'Coordinadora de Operaciones y Logística',
  contacto: 'Buenos Aires, CABA · (+54) 11 4892-3401',
  redes: 'noemi.vargas@email.com · linkedin.com/in/noemivargas',
  fortalezas:
    'Especialista en optimización de cadenas de suministro, logística integral y coordinación de equipos operativos con más de 7 años de trayectoria. Enfoque estratégico en reducción de mermas, control estricto de tiempos de entrega (OTIF) y gestión de inventarios con SAP. Liderazgo cercano, capacidad analítica y rápida adaptación ante contingencias de transporte y abastecimiento.',
  experiencia:
    '• Coordinadora de Distribución y Flota — Logística Sur Andina (2021 - Presente)\nGestión directa de flota de 28 vehículos de media y larga distancia. Implementación de ruteo dinámico con reducción de costos de combustible del 14% y mejora del índice de entregas a tiempo al 97.8%.\n\n• Analista Senior de Almacén y Stock — Distribuidora del Plata (2018 - 2021)\nSupervisión de ingreso, control de inventarios cíclicos y despacho de más de 3.500 SKU. Auditoría de mermas con disminución sostenida del 22% interanual.\n\n• Asistente de Logística y Despacho — Transportes San Juan (2016 - 2018)\nControl documental de remitos, facturación y atención a transportistas y clientes corporativos.',
  educacion:
    '• Licenciatura en Logística y Comercio Internacional — Universidad Nacional (2012 - 2017)\n• Diplomatura en Supply Chain Management & Lean Logistics — ITBA (2020)\n• Certificación en Gestión de Inventarios y Almacenes (2019)',
  referencias:
    '• Ing. Martín Domínguez — Gerente de Operaciones en Logística Sur Andina (Tel: +54 11 5543-9821)\n• Lic. Marcela Giménez — Directora de RRHH (contacto: mgimenez@surandina.com)',
  habilidades:
    'Gestión de Cadenas de Suministro, SAP R/3 (Módulos MM/SD), Ruteo Dinámico, Metodología 5S, Control de KPIs Operativos, Negociación con Proveedores, Microsoft Excel Avanzado, Liderazgo de Equipos',
  idiomas: 'Español (Nativo), Inglés (Intermedio laboral - B2)',
  fotoUrl: defaultAvatar,
};

export const EMPTY_CV: CVData = {
  nombre: '',
  puesto: '',
  contacto: '',
  redes: '',
  fortalezas: '',
  experiencia: '',
  educacion: '',
  referencias: '',
  habilidades: '',
  idiomas: '',
  fotoUrl: '',
};
