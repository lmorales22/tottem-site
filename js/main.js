const nav = document.querySelector('.site-nav');
const hero = document.querySelector('.hero');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

const body = document.body;
const sectionAnchors = document.querySelectorAll('a[href^="#"]');

let lastScrollY = window.scrollY;
let tickingScroll = false;

const setNavState = (scrollY) => {
  nav.classList.toggle('scrolled', scrollY > 80);

  if (scrollY < 10) {
    nav.classList.remove('nav-hidden');
    return;
  }

  if (scrollY > 200 && scrollY > lastScrollY) {
    nav.classList.add('nav-hidden');
  } else if (scrollY < lastScrollY) {
    nav.classList.remove('nav-hidden');
  }
};

const setHeroParallax = (scrollY) => {
  const maxRange = hero.offsetHeight;
  if (scrollY <= maxRange) {
    const shift = scrollY * 0.4;
    hero.style.backgroundPosition = `center calc(40% + ${shift}px)`;
  }
};

const onScroll = () => {
  const scrollY = window.scrollY;
  setNavState(scrollY);
  setHeroParallax(scrollY);
  lastScrollY = scrollY;
  tickingScroll = false;
};

window.addEventListener('scroll', () => {
  if (!tickingScroll) {
    window.requestAnimationFrame(onScroll);
    tickingScroll = true;
  }
});

const openMobileMenu = () => {
  mobileMenu.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  body.style.overflow = 'hidden';
};

const closeMobileMenu = () => {
  mobileMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
};

menuToggle.addEventListener('click', openMobileMenu);
menuClose.addEventListener('click', closeMobileMenu);
mobileLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

sectionAnchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    const navHeight = nav.getBoundingClientRect().height;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  });
});

const revealGroups = document.querySelectorAll('[data-reveal-group]');
const standaloneReveals = document.querySelectorAll('.reveal:not([data-reveal])');

revealGroups.forEach((group) => {
  const children = group.querySelectorAll('[data-reveal]');
  children.forEach((child, index) => {
    child.classList.add('reveal');
    child.style.setProperty('--delay', `${index * 100}ms`);

    if (group.closest('.manifesto')) {
      child.style.transform = 'translateY(30px)';
    }
  });
});

standaloneReveals.forEach((item, index) => {
  item.style.setProperty('--delay', `${(index % 3) * 100}ms`);
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.classList.add('is-visible');
        observer.unobserve(target);
      }
    });
  },
  {
    threshold: 0.3
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');
const pointerFine = window.matchMedia('(pointer: fine)').matches;
const desktopWidth = window.innerWidth > 768;

if (pointerFine && desktopWidth) {
  body.classList.add('custom-cursor-enabled');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outerX = mouseX;
  let outerY = mouseY;

  const renderCursor = () => {
    outerX += (mouseX - outerX) * 0.2;
    outerY += (mouseY - outerY) * 0.2;

    cursorOuter.style.left = `${outerX}px`;
    cursorOuter.style.top = `${outerY}px`;
    cursorInner.style.left = `${mouseX}px`;
    cursorInner.style.top = `${mouseY}px`;

    window.requestAnimationFrame(renderCursor);
  };

  renderCursor();

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const projectCards = document.querySelectorAll('.project-item');
  const interactive = document.querySelectorAll('a, button');

  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cursorOuter.classList.add('hover-project');
    });
    card.addEventListener('mouseleave', () => {
      cursorOuter.classList.remove('hover-project');
    });
  });

  interactive.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      cursorOuter.classList.add('hover-link');
    });
    node.addEventListener('mouseleave', () => {
      cursorOuter.classList.remove('hover-link');
    });
  });
}

// ── Translations ──
const translations = {
  en: {
    // Nav
    nav_work: "Work",
    nav_services: "Services",
    nav_sample: "Sample",
    nav_process: "Process",
    nav_studio: "Studio",
    nav_contact: "Contact",
    // Filters
    filter_all: "All",
    filter_residential: "Residential",
    filter_commercial: "Commercial",
    filter_institutional: "Institutional",
    // Hero
    hero_eyebrow: "Architecture Studio \u00b7 Medell\u00edn, Colombia",
    hero_headline: "Permit-ready construction documents.<br>Senior architects. Remote delivery.",
    hero_sub: "30 years of architectural expertise. Built for US standards.",
    hero_cta_primary: "Download Sample Package",
    hero_cta_secondary: "Book a Discovery Call",
    // Stats strip
    stat_years: "Years of Experience",
    stat_projects: "Documentation Packages",
    stat_timezone: "Same Timezone as Eastern US",
    // Manifesto
    manifesto_quote: "Simple. Practical. Minimal.",
    manifesto_text: "At Tottem, design begins with place — the light entering a window, materials drawn from the land. Every project is a conversation between space and the people who inhabit it.",
    // Work
    work_label: "WORK",
    project_cta: "View project →",
    tag_residential: "Residential",
    tag_commercial: "Commercial",
    tag_institutional: "Institutional",
    // Services
    services_label: "SERVICES",
    services_heading: "What we do.",
    service_01_title: "Architectural Design",
    service_01_body: "Concept through design development — schematic design, design development, permit sets, and client presentations. We take projects from initial vision to a fully developed design ready for documentation.",
    service_01_d1: "Schematic Design Packages",
    service_01_d2: "Design Development Sets",
    service_01_d3: "Permit-Ready Drawings",
    service_01_d4: "Client Presentation Materials",
    service_02_title: "Construction Documentation",
    service_02_body: "Full construction document sets — details, specifications, and coordination drawings. This is our primary B2B service: production-ready documentation that your team can build from.",
    service_02_d1: "Full CD Sets",
    service_02_d2: "Construction Details & Sections",
    service_02_d3: "Specifications & Schedules",
    service_02_d4: "Coordination Drawings",
    service_03_title: "BIM / 3D Modeling",
    service_03_body: "Revit models, coordination models, renders, and 3D visualization for client presentations and construction coordination. We deliver models that integrate with your BIM workflow.",
    service_03_d1: "Revit / BIM Models",
    service_03_d2: "3D Renders & Visualizations",
    service_03_d3: "Coordination Models",
    service_03_d4: "Client Presentation Packages",
    // Sample
    sample_label: "SAMPLE PACKAGE",
    sample_heading: "See our work before you commit.",
    sample_subline: "Download a sample documentation package — floor plans, sections, details, and 3D renders from a completed project.",
    sample_cta: "Download Sample Package",
    sample_feat_plans: "Floor Plans",
    sample_feat_sections: "Building Sections",
    sample_feat_details: "Detail Sheets",
    sample_feat_renders: "3D Renders",
    // Process
    process_label: "PROCESS",
    process_heading: "How we work.",
    process_01_title: "Discovery Call",
    process_01_desc: "We learn about your project, scope, and timeline.",
    process_01_time: "1–2 days",
    process_02_title: "Scope & Proposal",
    process_02_desc: "Detailed proposal with deliverables, timeline, and pricing.",
    process_02_time: "3–5 days",
    process_03_title: "Design Development",
    process_03_desc: "Schematic design through design development with client reviews.",
    process_03_time: "2–4 weeks",
    process_04_title: "Documentation",
    process_04_desc: "Production of construction documents, details, and specs.",
    process_04_time: "3–6 weeks",
    process_05_title: "Review & Revision",
    process_05_desc: "Collaborative review rounds until documentation is approved.",
    process_05_time: "1–2 weeks",
    process_06_title: "Final Deliverables",
    process_06_desc: "Complete package handoff — files, models, and documentation.",
    process_06_time: "1–3 days",
    // Studio
    studio_label: "STUDIO",
    studio_heading: "A workshop of moments and places.",
    studio_text: "We are a team that builds from the conviction that architecture must improve people's lives. We work on residential and corporate projects in Medellín and Colombia, guided by minimalism, material honesty, and respect for place.",
    credentials_software: "Software Stack",
    credentials_advantage: "Colombia Advantage",
    cred_timezone: "ET −1h / PT +2h Timezone",
    cred_bilingual: "Bilingual Team (EN/ES)",
    cred_pricing: "Competitive Pricing",
    // Contact
    contact_label: "CONTACT",
    contact_heading: "Let's talk.",
    contact_subline: "Ready to start a project? Book a 30-minute discovery call or send us your brief.",
    contact_whatsapp: "WhatsApp us",
    contact_location: "Medellín, Colombia",
    form_name: "Name",
    form_company: "Company",
    form_email: "Email",
    form_type_placeholder: "Project Type",
    form_type_residential: "Residential",
    form_type_commercial: "Commercial",
    form_type_institutional: "Institutional",
    form_type_other: "Other",
    form_message: "Tell us about your project",
    form_submit: "Request a Quote",
    // Footer
    footer_copy: "© 2025 Tottem Arquitectura",
    // Slide labels
    mag_close: "Close",
    mag_prev: "Previous",
    mag_next: "Next",
    cover_share: "Share",
    meta_location: "Location",
    meta_year: "Year",
    meta_area: "Area",
    meta_status: "Status",
  },
  es: {
    nav_work: "Proyectos",
    nav_services: "Servicios",
    nav_sample: "Muestra",
    nav_process: "Proceso",
    nav_studio: "Estudio",
    nav_contact: "Contacto",
    filter_all: "Todos",
    filter_residential: "Residencial",
    filter_commercial: "Comercial",
    filter_institutional: "Institucional",
    hero_eyebrow: "Estudio de Arquitectura \u00b7 Medell\u00edn, Colombia",
    hero_headline: "Documentación lista para permisos.<br>Arquitectos senior. Entrega remota.",
    hero_sub: "30 años de experiencia arquitectónica. Construido para estándares internacionales.",
    hero_cta_primary: "Descargar Paquete Muestra",
    hero_cta_secondary: "Agendar Llamada",
    stat_years: "Años de Experiencia",
    stat_projects: "Paquetes de Documentación",
    stat_timezone: "Misma Zona Horaria (ET-1h)",
    manifesto_quote: "Lo simple, lo práctico, el minimalismo.",
    manifesto_text: "En Tottem, el diseño parte del lugar, de la luz que entra por la ventana, de los materiales que nacen del suelo. Cada proyecto es una conversación entre el espacio y quien lo habita.",
    work_label: "PROYECTOS",
    project_cta: "Ver proyecto →",
    tag_residential: "Residencial",
    tag_commercial: "Comercial",
    tag_institutional: "Institucional",
    services_label: "SERVICIOS",
    services_heading: "Qué hacemos.",
    service_01_title: "Diseño Arquitectónico",
    service_01_body: "Del concepto al desarrollo de diseño — diseño esquemático, desarrollo de diseño, planos de permisos y presentaciones al cliente. Llevamos proyectos de la visión inicial a un diseño completamente desarrollado, listo para documentación.",
    service_01_d1: "Paquetes de Diseño Esquemático",
    service_01_d2: "Juegos de Desarrollo de Diseño",
    service_01_d3: "Planos para Permisos",
    service_01_d4: "Materiales de Presentación al Cliente",
    service_02_title: "Documentación de Construcción",
    service_02_body: "Juegos completos de documentos de construcción — detalles, especificaciones y planos de coordinación. Este es nuestro servicio B2B principal: documentación lista para producción con la que su equipo puede construir.",
    service_02_d1: "Juegos Completos de DC",
    service_02_d2: "Detalles y Secciones Constructivas",
    service_02_d3: "Especificaciones y Programas",
    service_02_d4: "Planos de Coordinación",
    service_03_title: "BIM / Modelado 3D",
    service_03_body: "Modelos Revit, modelos de coordinación, renders y visualización 3D para presentaciones al cliente y coordinación de construcción. Entregamos modelos que se integran con su flujo de trabajo BIM.",
    service_03_d1: "Modelos Revit / BIM",
    service_03_d2: "Renders y Visualizaciones 3D",
    service_03_d3: "Modelos de Coordinación",
    service_03_d4: "Paquetes de Presentación al Cliente",
    sample_label: "PAQUETE MUESTRA",
    sample_heading: "Vea nuestro trabajo antes de comprometerse.",
    sample_subline: "Descargue un paquete muestra de documentación — plantas, secciones, detalles y renders 3D de un proyecto terminado.",
    sample_cta: "Descargar Paquete Muestra",
    sample_feat_plans: "Plantas",
    sample_feat_sections: "Secciones",
    sample_feat_details: "Detalles",
    sample_feat_renders: "Renders 3D",
    process_label: "PROCESO",
    process_heading: "Cómo trabajamos.",
    process_01_title: "Llamada Inicial",
    process_01_desc: "Conocemos su proyecto, alcance y cronograma.",
    process_01_time: "1–2 días",
    process_02_title: "Alcance y Propuesta",
    process_02_desc: "Propuesta detallada con entregables, cronograma y precios.",
    process_02_time: "3–5 días",
    process_03_title: "Desarrollo de Diseño",
    process_03_desc: "Diseño esquemático hasta desarrollo con revisiones del cliente.",
    process_03_time: "2–4 semanas",
    process_04_title: "Documentación",
    process_04_desc: "Producción de documentos de construcción, detalles y especificaciones.",
    process_04_time: "3–6 semanas",
    process_05_title: "Revisión y Corrección",
    process_05_desc: "Rondas de revisión colaborativa hasta aprobación de la documentación.",
    process_05_time: "1–2 semanas",
    process_06_title: "Entregables Finales",
    process_06_desc: "Entrega completa del paquete — archivos, modelos y documentación.",
    process_06_time: "1–3 días",
    studio_label: "ESTUDIO",
    studio_heading: "Un taller de momentos y lugares.",
    studio_text: "Somos un equipo que construye desde la convicción de que la arquitectura debe mejorar la vida de las personas. Trabajamos en proyectos residenciales y corporativos en Medellín y Colombia, guiados por el minimalismo, la honestidad de los materiales y el respeto por el lugar.",
    credentials_software: "Software",
    credentials_advantage: "Ventaja Colombia",
    cred_timezone: "Zona horaria ET −1h / PT +2h",
    cred_bilingual: "Equipo Bilingüe (EN/ES)",
    cred_pricing: "Precios Competitivos",
    contact_label: "CONTACTO",
    contact_heading: "Conversemos.",
    contact_subline: "¿Listo para comenzar un proyecto? Agende una llamada de 30 minutos o envíenos su brief.",
    contact_whatsapp: "Escríbenos por WhatsApp",
    contact_location: "Medellín, Colombia",
    form_name: "Nombre",
    form_company: "Empresa",
    form_email: "Correo",
    form_type_placeholder: "Tipo de Proyecto",
    form_type_residential: "Residencial",
    form_type_commercial: "Comercial",
    form_type_institutional: "Institucional",
    form_type_other: "Otro",
    form_message: "Cuéntenos sobre su proyecto",
    form_submit: "Solicitar Cotización",
    footer_copy: "© 2025 Tottem Arquitectura",
    mag_close: "Cerrar",
    mag_prev: "Anterior",
    mag_next: "Siguiente",
    cover_share: "Compartir",
    meta_location: "Ubicación",
    meta_year: "Año",
    meta_area: "Área",
    meta_status: "Estado",
  }
};

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
  // Update injected slide text
  document.querySelectorAll('.project-slide-caption[data-caption-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.captionEs : el.dataset.captionEn;
  });
  document.querySelectorAll('.project-slide-pull[data-pull-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.pullEs : el.dataset.pullEn;
  });
  document.querySelectorAll('.project-slide-body[data-body-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.bodyEs : el.dataset.bodyEn;
  });
  // Cover slide bilingual elements
  const catMap = {
    en: { residential: 'Residential', commercial: 'Commercial', institutional: 'Institutional' },
    es: { residential: 'Residencial', commercial: 'Comercial', institutional: 'Institucional' },
  };
  document.querySelectorAll('.cover-info-category[data-category]').forEach(el => {
    const cat = el.dataset.category;
    el.textContent = (catMap[lang] && catMap[lang][cat]) ? catMap[lang][cat] : cat;
  });
  document.querySelectorAll('.cover-info-title[data-name-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.nameEs : el.dataset.nameEn;
  });
  document.querySelectorAll('.cover-meta-label[data-label-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.labelEs : el.dataset.labelEn;
  });
  document.querySelectorAll('.cover-meta-value[data-value-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.valueEs : el.dataset.valueEn;
  });
  document.querySelectorAll('.cover-editorial-text[data-intro-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.introEs : el.dataset.introEn;
  });
  document.querySelectorAll('.statement-text[data-text-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.textEs : el.dataset.textEn;
  });
  document.querySelectorAll('.statement-detail[data-detail-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.detailEs : el.dataset.detailEn;
  });
  // Form placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
  // Select option translations
  document.querySelectorAll('select option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  const toggleText = lang === 'en' ? 'ES' : 'EN';
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = toggleText;
  });
  localStorage.setItem('tottem-lang', lang);
}

// Init language on load
let currentLang = localStorage.getItem('tottem-lang') || 'en';
applyLanguage(currentLang);

// Lang toggle click handler
document.querySelectorAll('.lang-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    applyLanguage(currentLang);
  });
});

// ── Work Filters ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-item').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  });
});

// ── Inline Project Slides ──
const PROJECTS_DATA = [
  {
    id: 0,
    name: "Casa Colinas",
    name_es: "Casa Colinas",
    category: "residential",
    meta: { location: "Medellín", year: "2021", area: "320 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "A hillside residence designed to follow the natural contours of the terrain. The project organizes a series of connected volumes that step down the slope, each one calibrated to frame a specific view of the city below and the mountains beyond.",
    intro_es: "Una residencia en ladera diseñada para seguir los contornos naturales del terreno. El proyecto organiza una serie de volúmenes conectados que descienden por la pendiente, cada uno calibrado para enmarcar una vista específica de la ciudad abajo y las montañas al fondo.",
    spreads: [
      { type: "cover", image: "images/behance_161726219_01.jpg" },
      { type: "full", image: "images/behance_161713471_01.jpg", caption_en: "The house sits at the edge of a hillside, its volumes articulated to capture the morning light from the east.", caption_es: "La casa se asienta en el borde de una ladera, sus volúmenes articulados para capturar la luz matinal del oriente." },
      { type: "editorial", flip: true, image: "images/behance_161985173_01.jpg", pull_en: "Space carved from the land.", pull_es: "Espacio esculpido desde el terreno.", body_en: "Every material decision was made in dialogue with the hillside. Concrete walls emerge from the earth; timber ceilings echo the forest canopy above.", body_es: "Cada decisión de material se tomó en diálogo con la ladera. Los muros de concreto emergen de la tierra; los cielos en madera replican el dosel del bosque." },
      { type: "full", image: "images/behance_161726219_02.jpg", caption_en: "The pool terrace extends the living pavilion outward — a continuous plane of water and stone where the built and the natural negotiate a shared horizon.", caption_es: "La terraza de la piscina extiende el pabellón de vida hacia el exterior — un plano continuo de agua y piedra donde lo construido y lo natural negocian un horizonte compartido." },
      { type: "editorial", image: "images/behance_161726219_03.jpg", pull_en: "The section reveals what the eye alone cannot see.", pull_es: "La sección revela lo que el ojo solo no puede ver.", body_en: "Pool Area Section A documents the precision behind the apparent ease. Three resolved levels — the covered terrace at 5.50 m, the pool deck at 1.00 m, the water surface 1.40 m below — are unified by a continuous palette of exposed concrete and local stone. Glass sliding doors dissolve the boundary between outdoor kitchen and interior; the sloped roof structure above provides shade without enclosure, drawing the eye toward the valley beyond.", body_es: "La Sección A del área de piscina documenta la precisión detrás de la aparente facilidad. Tres niveles resueltos — la terraza cubierta a 5.50 m, el deck de la piscina a 1.00 m, la lámina de agua 1.40 m más abajo — unificados por una paleta continua de concreto a la vista y piedra local. Las puertas corredizas de vidrio disuelven el límite entre la cocina exterior y el interior; la estructura de techo inclinado proporciona sombra sin cerramiento, dirigiendo la vista hacia el valle." },
      { type: "statement", number: "01", text_en: "Every material decision made in dialogue with the hillside.", text_es: "Cada decisión de material tomada en diálogo con la ladera.", detail_en: "Casa Colinas — Medellín, 2021", detail_es: "Casa Colinas — Medellín, 2021" },
      { type: "editorial", image: "images/behance_157826253_01.jpg", pull_en: "Light as the primary material.", pull_es: "La luz como material principal.", body_en: "Deep overhangs filter the harsh midday sun while allowing the soft morning and evening light to wash across the concrete surfaces, revealing their texture hour by hour.", body_es: "Los aleros profundos filtran el sol intenso del mediodía mientras permiten que la luz suave de la mañana y la tarde bañe las superficies de concreto, revelando su textura hora a hora." }
    ]
  },
  {
    id: 1,
    name: "Casa Laureles",
    name_es: "Casa Laureles",
    category: "residential",
    meta: { location: "Medellín", year: "2019", area: "280 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "A compact urban house that negotiates between the density of the Laureles neighborhood and the aspiration for spaciousness within. The project achieves its openness through a careful arrangement of light and section, not area.",
    intro_es: "Una vivienda urbana compacta que negocia entre la densidad del barrio Laureles y la aspiración de amplitud interior. El proyecto logra su apertura a través de una cuidadosa disposición de la luz y la sección, no del área.",
    spreads: [
      { type: "cover", image: "images/behance_157821753_01.jpg" },
      { type: "full", image: "images/behance_157821753_02.jpg", caption_en: "A family home in the Laureles neighborhood — intimate in scale, generous in light.", caption_es: "Una vivienda familiar en el barrio Laureles — íntima en escala, generosa en luz." },
      { type: "editorial", image: "images/behance_157821753_03.jpg", pull_en: "The street and the garden in conversation.", pull_es: "La calle y el jardín en conversación.", body_en: "The facade negotiates between the urban fabric and the private interior, offering a controlled threshold that transforms the experience of arrival.", body_es: "La fachada negocia entre el tejido urbano y el interior privado, ofreciendo un umbral controlado que transforma la experiencia de llegada." },
      { type: "statement", number: "02", text_en: "Openness achieved through light and section — not area.", text_es: "La amplitud lograda a través de la luz y la sección — no del área.", detail_en: "Casa Laureles — Medellín, 2019", detail_es: "Casa Laureles — Medellín, 2019" },
      { type: "editorial", flip: true, image: "images/behance_157821753_07.jpg", pull_en: "Materiality without excess.", pull_es: "Materialidad sin exceso.", body_en: "Exposed concrete, raw timber, and natural stone — each material present for a reason, each surface an honest expression of its structure.", body_es: "Concreto a la vista, madera cruda y piedra natural — cada material presente por una razón, cada superficie una expresión honesta de su estructura." }
    ]
  },
  {
    id: 2,
    name: "Casa del Bosque",
    name_es: "Casa del Bosque",
    category: "residential",
    meta: { location: "Medellín", year: "2022", area: "410 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "A house calibrated to its forest setting, where the structural logic was determined as much by the existing trees as by the program within. The canopy is preserved; the architecture grows around it.",
    intro_es: "Una casa calibrada a su entorno boscoso, donde la lógica estructural fue determinada tanto por los árboles existentes como por el programa interior. El dosel se preserva; la arquitectura crece a su alrededor.",
    spreads: [
      { type: "cover", image: "images/behance_161710953_01.jpg" },
      { type: "full", image: "images/behance_161710953_02.jpg", caption_en: "Nestled within a dense forest canopy, the house dissolves the boundary between interior and landscape.", caption_es: "Anidada bajo un denso dosel de bosque, la casa disuelve el límite entre interior y paisaje." },
      { type: "editorial", flip: true, image: "images/behance_161710953_04.jpg", pull_en: "To build in nature is to listen.", pull_es: "Construir en la naturaleza es escuchar.", body_en: "The structural grid was calibrated to the existing trees, preserving the mature canopy and allowing the forest to inhabit the architecture from the very first day.", body_es: "La retícula estructural fue calibrada a los árboles existentes, preservando el dosel maduro y permitiendo que el bosque habite la arquitectura desde el primer día." },
      { type: "statement", number: "03", text_en: "The house is never the same place twice.", text_es: "La casa nunca es el mismo lugar dos veces.", detail_en: "Casa del Bosque — Medellín, 2022", detail_es: "Casa del Bosque — Medellín, 2022" },
      { type: "editorial", image: "images/behance_161710953_09.jpg", pull_en: "A house that changes with the seasons.", pull_es: "Una casa que cambia con las estaciones.", body_en: "As the forest blooms and sheds, the interior light shifts — from the filtered green of April to the open clarity of January.", body_es: "A medida que el bosque florece y cae, la luz interior cambia — del verde filtrado de abril a la claridad abierta de enero." }
    ]
  },
  {
    id: 3,
    name: "Villa Nogal",
    name_es: "Villa Nogal",
    category: "residential",
    meta: { location: "Medellín", year: "2023", area: "850 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "The studio's most ambitious residential project to date. A compound organized around a central courtyard that serves as the heart of family life — distributing light, air, and movement through a series of interconnected pavilions.",
    intro_es: "El proyecto residencial más ambicioso del estudio hasta la fecha. Un conjunto organizado en torno a un patio central que sirve como corazón de la vida familiar, distribuyendo luz, aire y movimiento a través de una serie de pabellones interconectados.",
    spreads: [
      { type: "cover", image: "images/behance_161730713_01.jpg" },
      { type: "full", image: "images/behance_161730713_03.jpg", caption_en: "An estate defined by the tension between enclosure and openness — walls that protect, voids that breathe.", caption_es: "Una villa definida por la tensión entre el cerramiento y la apertura — muros que protegen, vacíos que respiran." },
      { type: "editorial", image: "images/behance_161730713_05.jpg", pull_en: "The courtyard as the heart of the house.", pull_es: "El patio como corazón de la casa.", body_en: "All primary spaces orbit a central courtyard — a room without a roof, calibrated to the path of the sun, gathering light and distributing it through the sections of the house.", body_es: "Todos los espacios principales orbitan un patio central — una habitación sin techo, calibrada al recorrido del sol, recolectando luz y distribuyéndola a través de las secciones de la casa." },
      { type: "full", image: "images/behance_161730713_08.jpg", caption_en: "Water, stone, and silence. The pool terrace as a meditative threshold.", caption_es: "Agua, piedra y silencio. La terraza de la piscina como umbral meditativo." },
      { type: "editorial", flip: true, image: "images/behance_161730713_11.jpg", pull_en: "Thirty years of expertise in a single project.", pull_es: "Treinta años de experiencia en un solo proyecto.", body_en: "Villa Nogal represents the studio's most complete residential statement to date — a synthesis of the material philosophy, spatial language, and construction rigor developed over three decades.", body_es: "Villa Nogal representa la declaración residencial más completa del estudio hasta la fecha — una síntesis de la filosofía material, el lenguaje espacial y el rigor constructivo desarrollados a lo largo de tres décadas." }
    ]
  },
  {
    id: 4,
    name: "Works & Pavilions",
    name_es: "Obras & Pabellones",
    category: "institutional",
    meta: { location: "Colombia", year: "2018–2024", area: "Variable", status_en: "Ongoing", status_es: "En curso" },
    intro_en: "A collection of ephemeral and permanent structures built for cultural programs across Colombia. Each pavilion is treated as an experiment in material and structure — concentrated arguments about what architecture can do at any scale.",
    intro_es: "Una colección de estructuras efímeras y permanentes construidas para programas culturales en Colombia. Cada pabellón es tratado como un experimento en material y estructura — argumentos concentrados sobre lo que la arquitectura puede hacer a cualquier escala.",
    spreads: [
      { type: "cover", image: "images/behance_157808365_01.jpg" },
      { type: "full", image: "images/behance_161723547_01.jpg", caption_en: "Ephemeral structures that question the permanence of space — built to last a season, designed to be remembered.", caption_es: "Estructuras efímeras que cuestionan la permanencia del espacio — construidas para durar una temporada, diseñadas para ser recordadas." },
      { type: "editorial", flip: true, image: "images/behance_161729313_01.jpg", pull_en: "Architecture as event.", pull_es: "La arquitectura como evento.", body_en: "The pavilion typology allows the studio to experiment with structure, material, and program in compressed form — each pavilion a concentrated argument about what architecture can do.", body_es: "La tipología del pabellón permite al estudio experimentar con estructura, material y programa en forma comprimida — cada pabellón un argumento concentrado sobre lo que la arquitectura puede hacer." },
      { type: "full", image: "images/behance_161982839_01.jpg", caption_en: "Public space activated — the pavilion as a catalyst for collective inhabitation.", caption_es: "Espacio público activado — el pabellón como catalizador de la habitación colectiva." }
    ]
  },
  {
    id: 5,
    name: "Commercial Office",
    name_es: "Oficina Comercial",
    category: "commercial",
    meta: { location: "Medellín", year: "2023", area: "640 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "A corporate workspace designed around the premise that the quality of a work environment directly shapes the quality of work produced within it. Open-plan studios, focused work rooms, and generous social spaces are woven together through a continuous material palette.",
    intro_es: "Un espacio de trabajo corporativo diseñado desde la premisa de que la calidad del entorno laboral determina directamente la calidad del trabajo que se produce en él. Estudios de planta abierta, salas de trabajo concentrado y generosos espacios sociales se entrelazan a través de una paleta material continua.",
    spreads: [
      { type: "cover", image: "images/behance_161730713_06.jpg" },
      { type: "full", image: "images/behance_161730713_07.jpg", caption_en: "A workplace calibrated to focus and collaboration in equal measure.", caption_es: "Un lugar de trabajo calibrado para el enfoque y la colaboración en igual medida." },
      { type: "editorial", flip: true, image: "images/behance_161730713_09.jpg", pull_en: "The threshold between work and community.", pull_es: "El umbral entre el trabajo y la comunidad.", body_en: "The design refuses the false separation between production and social life — the café, the terrace, and the meeting room share the same material language as the studio floor.", body_es: "El diseño rechaza la falsa separación entre producción y vida social — el café, la terraza y la sala de reuniones comparten el mismo lenguaje material que el piso del estudio." }
    ]
  },
  {
    id: 6,
    name: "Civic Pavilion",
    name_es: "Pabellón Cívico",
    category: "institutional",
    meta: { location: "Colombia", year: "2022", area: "1,200 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "A public building conceived as civic infrastructure — permanent, adaptable, and legible to all. The project responds to the challenge of designing for collective use: spaces that belong to no one in particular and therefore to everyone.",
    intro_es: "Un edificio público concebido como infraestructura cívica — permanente, adaptable y legible para todos. El proyecto responde al desafío de diseñar para el uso colectivo: espacios que no pertenecen a nadie en particular y que por eso pertenecen a todos.",
    spreads: [
      { type: "cover", image: "images/behance_161723547_01.jpg" },
      { type: "full", image: "images/behance_161729313_01.jpg", caption_en: "Civic space as democratic infrastructure — designed to serve every person who enters.", caption_es: "Espacio cívico como infraestructura democrática — diseñado para servir a cada persona que entra." },
      { type: "editorial", image: "images/behance_161982839_01.jpg", pull_en: "Architecture in service of the public.", pull_es: "La arquitectura al servicio de lo público.", body_en: "The building was designed with the understanding that public institutions must project stability and openness in equal measure — a presence on the street that is both authoritative and welcoming.", body_es: "El edificio fue diseñado con la comprensión de que las instituciones públicas deben proyectar estabilidad y apertura en igual medida — una presencia en la calle que es a la vez autoritativa y acogedora." }

    ]
  }
];

// ── Typed slide builder ──
function buildSlide(spread, project, lang, isFirst) {
  const slide = document.createElement('div');
  slide.className = 'project-slide';

  if (spread.type === 'cover') {
    slide.classList.add('project-slide--cover');

    // ── Left info panel ──
    const info = document.createElement('div');
    info.className = 'cover-info';

    // Main content group
    const mainGroup = document.createElement('div');
    mainGroup.className = 'cover-info-main';

    // Category label
    const cat = document.createElement('p');
    cat.className = 'cover-info-category';
    cat.dataset.category = project.category;
    cat.textContent = lang === 'es'
      ? (project.category === 'residential' ? 'Residencial' : 'Cultural')
      : (project.category === 'residential' ? 'Residential' : 'Cultural');

    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'cover-info-title';
    titleEl.dataset.nameEn = project.name;
    titleEl.dataset.nameEs = project.name_es;
    titleEl.textContent = lang === 'es' ? project.name_es : project.name;

    // Location shown prominently below title
    const locationEl = document.createElement('p');
    locationEl.className = 'cover-info-location';
    locationEl.textContent = project.meta?.location || '';

    // Meta items (year, area, status) — right-aligned
    const metaList = document.createElement('div');
    metaList.className = 'cover-info-meta';

    if (project.meta) {
      [
        { key: 'year',   label_en: 'Year',   label_es: 'Año'   },
        { key: 'area',   label_en: 'Area',   label_es: 'Área'  },
        { key: 'status', label_en: 'Status', label_es: 'Estado', bilingual: true },
      ].forEach(({ key, label_en, label_es, bilingual }) => {
        const rawVal = bilingual ? project.meta[key + '_en'] : project.meta[key];
        if (!rawVal) return;
        const item = document.createElement('div');
        item.className = 'cover-meta-item';
        const lbl = document.createElement('span');
        lbl.className = 'cover-meta-label';
        lbl.dataset.labelEn = label_en;
        lbl.dataset.labelEs = label_es;
        lbl.textContent = lang === 'es' ? label_es : label_en;
        const val = document.createElement('span');
        val.className = 'cover-meta-value';
        if (bilingual) {
          val.dataset.valueEn = project.meta[key + '_en'] || '';
          val.dataset.valueEs = project.meta[key + '_es'] || '';
          val.textContent = lang === 'es' ? (project.meta[key + '_es'] || '') : (project.meta[key + '_en'] || '');
        } else {
          val.textContent = project.meta[key];
        }
        item.appendChild(lbl);
        item.appendChild(val);
        metaList.appendChild(item);
      });
    }

    mainGroup.appendChild(cat);
    mainGroup.appendChild(titleEl);
    mainGroup.appendChild(locationEl);

    info.appendChild(mainGroup);
    info.appendChild(metaList);
    slide.appendChild(info);

    // ── Center image ──
    const frame = document.createElement('div');
    frame.className = 'project-slide-frame';
    const img = document.createElement('img');
    img.src = spread.image;
    img.alt = lang === 'es' ? project.name_es : project.name;
    img.loading = isFirst ? 'eager' : 'lazy';
    frame.appendChild(img);
    slide.appendChild(frame);

    // ── Right editorial text ──
    if (project.intro_en) {
      const editorial = document.createElement('div');
      editorial.className = 'cover-editorial';
      const text = document.createElement('p');
      text.className = 'cover-editorial-text';
      text.dataset.introEn = project.intro_en;
      text.dataset.introEs = project.intro_es;
      text.textContent = lang === 'es' ? project.intro_es : project.intro_en;
      editorial.appendChild(text);
      slide.appendChild(editorial);
    }

  } else if (spread.type === 'full') {
    slide.classList.add('project-slide--full');

    const frame = document.createElement('div');
    frame.className = 'project-slide-frame';
    const img = document.createElement('img');
    img.src = spread.image;
    img.alt = '';
    img.loading = 'lazy';
    frame.appendChild(img);
    slide.appendChild(frame);

    if (spread.caption_en) {
      const bar = document.createElement('div');
      bar.className = 'project-slide-caption-bar';
      const cap = document.createElement('p');
      cap.className = 'project-slide-caption';
      cap.dataset.captionEn = spread.caption_en;
      cap.dataset.captionEs = spread.caption_es;
      cap.textContent = lang === 'es' ? spread.caption_es : spread.caption_en;
      bar.appendChild(cap);
      slide.appendChild(bar);
    }

  } else if (spread.type === 'editorial') {
    slide.classList.add('project-slide--editorial');
    if (spread.flip) slide.classList.add('is-flipped');

    const visual = document.createElement('div');
    visual.className = 'project-slide-visual';
    const img = document.createElement('img');
    img.src = spread.image;
    img.alt = '';
    img.loading = 'lazy';
    visual.appendChild(img);
    slide.appendChild(visual);

    const text = document.createElement('div');
    text.className = 'project-slide-text';

    const pull = document.createElement('p');
    pull.className = 'project-slide-pull';
    pull.dataset.pullEn = spread.pull_en;
    pull.dataset.pullEs = spread.pull_es;
    pull.textContent = lang === 'es' ? spread.pull_es : spread.pull_en;

    const body = document.createElement('p');
    body.className = 'project-slide-body';
    body.dataset.bodyEn = spread.body_en;
    body.dataset.bodyEs = spread.body_es;
    body.textContent = lang === 'es' ? spread.body_es : spread.body_en;

    text.appendChild(pull);
    text.appendChild(body);
    slide.appendChild(text);

  } else if (spread.type === 'statement') {
    slide.classList.add('project-slide--statement');

    const inner = document.createElement('div');
    inner.className = 'statement-inner';

    if (spread.number) {
      const numEl = document.createElement('span');
      numEl.className = 'statement-number';
      numEl.setAttribute('aria-hidden', 'true');
      numEl.textContent = spread.number;
      inner.appendChild(numEl);
    }

    const textEl = document.createElement('p');
    textEl.className = 'statement-text';
    textEl.dataset.textEn = spread.text_en;
    textEl.dataset.textEs = spread.text_es;
    textEl.textContent = lang === 'es' ? spread.text_es : spread.text_en;
    inner.appendChild(textEl);

    if (spread.detail_en) {
      const detailEl = document.createElement('p');
      detailEl.className = 'statement-detail';
      detailEl.dataset.detailEn = spread.detail_en;
      detailEl.dataset.detailEs = spread.detail_es;
      detailEl.textContent = lang === 'es' ? spread.detail_es : spread.detail_en;
      inner.appendChild(detailEl);
    }

    slide.appendChild(inner);
  }

  return slide;
}

// Initialize slides into each project card
PROJECTS_DATA.forEach((project) => {
  const card = document.querySelector(`.project-item[data-index="${project.id}"]`);
  if (!card) return;

  // Inject typed slides
  let lastSlide = null;
  project.spreads.forEach((spread, i) => {
    const slide = buildSlide(spread, project, currentLang, i === 0);
    card.appendChild(slide);
    lastSlide = slide;
  });
  // Last slide is full-width — nothing to peek at after it
  if (lastSlide) lastSlide.classList.add('project-slide--last');

  // Dot indicator
  if (project.spreads.length > 1) {
    const dotsEl = document.createElement('div');
    dotsEl.className = 'project-dots';
    project.spreads.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'project-dot' + (i === 0 ? ' is-active' : '');
      dotsEl.appendChild(dot);
    });
    card.appendChild(dotsEl);

    const slideWidth = () => {
      const s = card.querySelector('.project-slide');
      return s ? s.offsetWidth : card.clientWidth;
    };

    const updateSlideState = () => {
      const index = Math.round(card.scrollLeft / slideWidth());
      dotsEl.querySelectorAll('.project-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
      });
    };

    // After trackpad momentum settles, ease to the nearest slide
    let snapLock = false;
    const snapToNearest = () => {
      if (snapLock) return;
      const sw = slideWidth();
      const index = Math.round(card.scrollLeft / sw);
      const target = index * sw;
      if (Math.abs(card.scrollLeft - target) > 1) {
        snapLock = true;
        card.scrollTo({ left: target, behavior: 'smooth' });
        setTimeout(() => { snapLock = false; }, 500);
      }
    };

    // Intercept horizontal wheel events so trackpad swipes go to the card,
    // not the page — this gives the BIG.dk-style direct response to gestures
    card.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        card.scrollLeft += e.deltaX;
      }
    }, { passive: false });

    card.addEventListener('scroll', updateSlideState, { passive: true });
    card.addEventListener('scrollend', () => {
      snapToNearest();
      updateSlideState();
    }, { passive: true });
  }

  // Slide text reveal — when the project card enters the vertical viewport,
  // animate text elements in with a staggered fade-up using IntersectionObserver.
  // Using IntersectionObserver (not scroll event) per performance best practices.
  const textTargets = card.querySelectorAll(
    '.project-slide-pull, .project-slide-body, .project-slide-caption, ' +
    '.statement-text, .statement-detail, .cover-info-title, .cover-editorial-text'
  );
  textTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`;
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        textTargets.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  cardObserver.observe(card);

  // Category tag — always-visible label at bottom-right of card
  // Especially useful on mobile where the cover info panel is hidden
  const tagEl = document.createElement('span');
  tagEl.className = 'project-tag';
  tagEl.dataset.i18n = `tag_${project.category}`;
  tagEl.textContent = currentLang === 'es'
    ? translations.es[`tag_${project.category}`]
    : translations.en[`tag_${project.category}`];
  card.appendChild(tagEl);
});

const initServicesAccordion = () => {
  const accordion = document.querySelector('.services-accordion');
  if (!accordion) return;

  const items = Array.from(accordion.querySelectorAll('.service-item'));
  if (!items.length) return;

  const closeItem = (item) => {
    const trigger = item.querySelector('.service-trigger');
    const panel = item.querySelector('.service-panel');
    if (!trigger || !panel) return;

    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.style.maxHeight = '0px';
    panel.style.opacity = '0';
  };

  const openItem = (item) => {
    const trigger = item.querySelector('.service-trigger');
    const panel = item.querySelector('.service-panel');
    if (!trigger || !panel) return;

    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    panel.style.opacity = '1';
  };

  items.forEach((item) => {
    closeItem(item);

    const trigger = item.querySelector('.service-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((otherItem) => {
        if (otherItem !== item) closeItem(otherItem);
      });

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  openItem(items[0]);

  window.addEventListener('resize', () => {
    const openPanelItem = accordion.querySelector('.service-item.is-open');
    if (!openPanelItem) return;
    const openPanel = openPanelItem.querySelector('.service-panel');
    if (!openPanel) return;
    openPanel.style.maxHeight = `${openPanel.scrollHeight}px`;
  });
};

initServicesAccordion();
onScroll();
