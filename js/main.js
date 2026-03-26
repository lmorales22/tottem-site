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

    if (group.closest('.why-us') || group.closest('.approach')) {
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

const initWhyUsGallery = () => {
  const items = Array.from(document.querySelectorAll('.why-us-item'));
  const panels = Array.from(document.querySelectorAll('.why-us-stage-panel'));
  if (!items.length || !panels.length) return;

  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const setActiveItem = (key) => {
    items.forEach((item) => {
      const isActive = item.dataset.whyusItem === key;
      const trigger = item.querySelector('.why-us-trigger');
      const body = item.querySelector('.why-us-item-body');

      item.classList.toggle('is-active', isActive);

      if (trigger) {
        trigger.setAttribute('aria-expanded', String(isActive));
      }

      if (body) {
        body.setAttribute('aria-hidden', String(!isActive));
      }
    });

    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.whyusPanel === key);
    });
  };

  const initialKey = items[0].dataset.whyusItem;
  setActiveItem(initialKey);

  items.forEach((item) => {
    const key = item.dataset.whyusItem;
    const trigger = item.querySelector('.why-us-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      setActiveItem(key);
    });

    trigger.addEventListener('focus', () => {
      setActiveItem(key);
    });

    if (hoverCapable) {
      trigger.addEventListener('mouseenter', () => {
        setActiveItem(key);
      });
    }
  });
};

initWhyUsGallery();

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
    hero_eyebrow: "Architecture & Documentation Studio \u00b7 Medell\u00edn, Colombia",
    hero_headline: "We Design. You Build.",
    hero_sub: "Senior-level architectural design and construction documentation from Colombia. Your timezone, your codes, your standards. Thirty years of building expertise, now dedicated entirely to design.",
    hero_cta_primary: "Request a Sample Package",
    hero_cta_secondary: "See Our Work",
    // Stats strip
    stat_years: "Years of Architecture & Construction",
    stat_projects: "Projects Designed & Documented",
    stat_savings: "Cost Savings vs. U.S. Firms",
    // Why Us
    whyus_label: "WHY TOTTEM",
    whyus_heading: "What makes us different.",
    whyus_01_title: "We've Built What You'll Build",
    whyus_01_text: "Most outsourcing firms only design. We spent 30 years designing and constructing. We know what a contractor needs because we've been the contractor. Our drawings don't just look good. They build clean.",
    whyus_02_title: "Same Time Zone, Real-Time Collaboration",
    whyus_02_text: "Based in Colombia, we operate on Eastern Time. No midnight calls. No 12-hour email delays. When your team is working, we're working. On Zoom, on BIM 360, on the same clock.",
    whyus_03_title: "Senior Talent, Rational Pricing",
    whyus_03_text: "Our team is led by architects with decades of experience. Not junior drafters learning on your project. You get principal-level design thinking at 40 to 60% of what a comparable U.S. firm charges.",
    whyus_04_title: "Your Standards, Not Ours",
    whyus_04_text: "We work to IBC, Florida Building Code, local amendments. Whatever your jurisdiction requires. Our deliverables are formatted for your permitting process, not ours.",
    marquee_architectural_design: "Architectural Design",
    marquee_construction_documentation: "Construction Documentation",
    marquee_design_consulting: "Design Consulting",
    marquee_draw_build: "We Design. You Build.",
    marquee_bogota_colombia: "Medellín, Colombia",
    marquee_30_years_expertise: "30 Years of Expertise",
    // Work
    work_label: "WORK",
    work_heading: "Selected Architectural Work",
    project_cta: "View project →",
    tag_residential: "Residential",
    tag_commercial: "Commercial",
    tag_institutional: "Institutional",
    // Services
    services_label: "SERVICES",
    services_heading: "What we do.",
    service_01_title: "Architectural Design",
    service_01_body: "Concept through design development, schematic design, design development, permit sets, and client presentations. We take projects from initial vision to a fully developed design ready for documentation.",
    service_01_d1: "Schematic Design Packages",
    service_01_d2: "Design Development Sets",
    service_01_d3: "Permit-Ready Drawings",
    service_01_d4: "Client Presentation Materials",
    service_02_title: "Construction Documentation",
    service_02_body: "Full construction document sets, details, specifications, and coordination drawings. This is our primary B2B service: production-ready documentation that your team can build from.",
    service_02_d1: "Full CD Sets",
    service_02_d2: "Construction Details & Sections",
    service_02_d3: "Specifications & Schedules",
    service_02_d4: "Coordination Drawings",
    service_01_pull: "From first sketch to permit-ready set.",
    service_02_pull: "The drawings your contractor will actually build from.",
    service_03_pull: "Thirty years of field experience, distilled into every review.",
    service_03_title: "Design Consulting",
    service_03_body: "Need a second set of expert eyes? We advise on design feasibility, code compliance strategy, and constructability. Informed by three decades of actually building what we design.",
    service_03_d1: "Design Review & Critique",
    service_03_d2: "Constructability Analysis",
    service_03_d3: "Code Compliance Strategy",
    service_03_d4: "Value Engineering Recommendations",
    // Approach
    approach_label: "OUR APPROACH",
    approach_heading: "Built on Trust, Delivered with Precision",
    approach_text: "We don't believe in black-box outsourcing. Every project begins with a direct conversation between your team and ours. You'll know your lead designer by name. You'll have access to our files in real time. And you'll never wonder where your project stands. Because we treat your deadlines like our own.",
    approach_clients: "Our clients are U.S.-based architecture firms, real estate developers, and general contractors who need reliable, high-quality design production without the overhead of scaling an in-house team.",
    // Sample
    sample_label: "SAMPLE PACKAGE",
    sample_heading: "See our work before you commit.",
    sample_subline: "Leave your work email and we will send a curated sample package with a short personalized proposal within one business day.",
    sample_gate_label: "Request a tailored sample package.",
    sample_gate_text: "We review your firm, your selected service, and the type of work you do before we reply. No generic auto-response.",
    sample_gate_stamp: "Curated Reply",
    sample_form_email: "Work Email",
    sample_form_company: "Firm Name (optional)",
    sample_cta: "Request Tailored Sample",
    sample_note: "We review every request and reply within one business day.",
    sample_trust_real: "Completed project sample",
    sample_trust_docs: "Plans, sections, details, and renders",
    sample_trust_review: "Short personalized proposal",
    sample_preview_label: "Tailored Package Delivery",
    sample_preview_badge: "Within One Business Day",
    sample_preview_title: "Sample Package + Custom Proposal",
    sample_preview_meta: "We pair the deliverables package with a short response shaped around your firm and selected service.",
    sample_includes_label: "What arrives in the package",
    sample_success_label: "Request Received",
    sample_success_title: "We will review your firm and send a tailored sample package within one business day.",
    sample_success_text: "Your request is in. We will use your company profile and selected service to curate the response.",
    sample_error: "We couldn't send your request. Please try again.",
    sample_feat_plans: "Floor Plans",
    sample_feat_sections: "Building Sections",
    sample_feat_details: "Detail Sheets",
    sample_feat_renders: "3D Renders",
    // Process
    process_label: "PROCESS",
    process_heading: "From First Call to Final Delivery.",
    process_intro: "A direct, visible workflow shaped around your standards, your reviewers, and your business day.",
    process_sidecar_label: "Need the full workflow?",
    process_sidecar_text: "We share the complete process map with every tailored sample package.",
    process_deepen_cta: "Request Full Workflow",
    process_core_label: "Shared Workflow",
    process_core_text: "Your standards. Your reviewers. Your files.",
    process_assurance_01_label: "Direct Communication",
    process_assurance_01_text: "You work with the architect leading your package, not through layers of account management.",
    process_assurance_02_label: "Your Standards",
    process_assurance_02_text: "Templates, title blocks, code notes, sheet order, and file naming follow your system.",
    process_assurance_03_label: "Shared Files",
    process_assurance_03_text: "Shared folders, BIM 360 / ACC, and markup reviews keep the process clear from day one.",
    process_you_label: "You Share",
    process_we_label: "We Deliver",
    process_tools_label: "Tools:",
    process_tools_line: "Usually coordinated in Revit, AutoCAD, Bluebeam, BIM 360 / ACC, Zoom, Teams, and shared folders.",
    process_01_title: "Discovery & Kickoff",
    process_01_desc: "Brief, standards, deliverables, and reviewers are aligned before production begins.",
    process_01_time: "2–5 business days",
    process_01_you: "Brief + standards.",
    process_01_we: "Scope + roadmap.",
    process_01_tools: "Zoom or Teams, Drive or Dropbox, and BIM 360 / ACC when required.",
    process_02_title: "Production & Coordination",
    process_02_desc: "We produce in your standards, with visible progress and coordination questions raised early.",
    process_02_time: "2–6 weeks, depending on scope",
    process_02_you: "Milestone feedback.",
    process_02_we: "Coordinated packages.",
    process_02_tools: "Revit, AutoCAD, Bluebeam, BIM 360 / ACC, and shared review sets.",
    process_03_title: "Review & Revision",
    process_03_desc: "Comments return in structured rounds, not fragmented email chains.",
    process_03_time: "1–2 weeks per cycle",
    process_03_you: "Markups + direction.",
    process_03_we: "Updated issues.",
    process_03_tools: "Bluebeam, annotated PDFs, Zoom reviews, and transmittal logs.",
    process_04_title: "Final Delivery & Continuity",
    process_04_desc: "Clean issue sets, native files as agreed, and continuity after delivery.",
    process_04_time: "1–3 business days to issue",
    process_04_you: "Final go-ahead.",
    process_04_we: "Issued set + follow-up.",
    process_04_tools: "Internal QC, issue sets, email, Zoom, and the same working channels already in place.",
    process_05_title: "QC & Final Delivery",
    process_05_desc: "Before anything leaves our office, the set is checked for coordination, sheet logic, references, and overall clarity.",
    process_05_time: "1–3 business days",
    process_05_you: "Final go-ahead for issue or submission requirements from your team.",
    process_05_we: "Issued PDFs, native files as agreed, and a clean transmittal of delivered items.",
    process_05_tools: "Internal peer review, PDF issue sets, native file export, and delivery log.",
    process_06_title: "Post-Delivery Support",
    process_06_desc: "We stay available for permit comments, addenda, clarification requests, and the next phase of work. The goal is continuity, not a handoff into silence.",
    process_06_time: "Ongoing",
    process_06_you: "Review comments, bidder questions, or field clarifications after issue.",
    process_06_we: "Fast follow-up revisions, response support, and continuity with the same team already onboarded.",
    process_06_tools: "Email, Zoom, Bluebeam, and the same working channels already in place.",
    process_timeline_label: "Typical working ranges",
    process_timeline_note: "Timeframes vary by scope, consultants, and jurisdiction.",
    process_timeline_01_label: "Targeted support",
    process_timeline_01_value: "2–4 weeks",
    process_timeline_02_label: "Permit-ready sets",
    process_timeline_02_value: "4–8 weeks",
    process_timeline_03_label: "Larger scopes",
    process_timeline_03_value: "Custom roadmap",
    // Studio
    studio_label: "STUDIO",
    studio_heading: "30 Years of Building. Now We Only Design.",
    studio_text: "For three decades, Tottem Arquitectura did it all. We designed buildings, documented them, and then built them. Residential towers in Medellín. Commercial complexes across Colombia. Then we made the biggest decision of our practice: we stopped building. Not because we couldn't. Because we realized our greatest value was our ability to produce design and documentation that anticipated construction. Drawings that solved problems before they reached the field.",
    credentials_software: "Software & Tools",
    credentials_advantage: "Colombia Advantage",
    cred_timezone: "Eastern Time (UTC-5)",
    cred_bilingual: "Bilingual Team (EN/ES)",
    cred_pricing: "40-60% Cost Savings",
    cred_codes: "IBC / FBC Compliant",
    // Final CTA
    finalcta_heading: "Direct communication. No black box.",
    finalcta_text: "If the fit feels right, the next step is simple. Use the contact form below and we will respond directly from our team.",
    finalcta_btn: "Go to Contact",
    // Contact
    contact_label: "CONTACT",
    contact_heading: "Let's Talk About Your Next Project",
    contact_subline: "Whether you have a project ready to go or you're exploring what nearshore architectural outsourcing looks like, we'd like to hear from you. No sales pitch. Just a direct conversation between architects.",
    contact_whatsapp: "WhatsApp Us",
    contact_location: "Medell\u00edn, Colombia (Eastern Time)",
    contact_hours: "Monday \u2013 Friday, 8:00 AM \u2013 6:00 PM ET",
    form_name: "Full Name",
    form_company: "Company / Firm Name",
    form_email: "Email Address",
    form_phone: "Phone (optional)",
    form_role_placeholder: "Your Role",
    form_role_architect: "Architect",
    form_role_developer: "Developer",
    form_role_contractor: "Contractor",
    form_role_owner: "Owner",
    form_role_other: "Other",
    form_service_placeholder: "Service Needed",
    form_service_design: "Architectural Design",
    form_service_docs: "Construction Documentation",
    form_service_consulting: "Design Consulting",
    form_service_unsure: "Not Sure Yet",
    sample_service_hint: "Select up to three services.",
    sample_service_required: "Please choose at least one service.",
    sample_service_limit: "Please choose no more than three services.",
    form_type_placeholder: "Project Type",
    form_type_residential: "Residential",
    form_type_commercial: "Commercial",
    form_type_mixed: "Mixed-Use",
    form_type_hospitality: "Hospitality",
    form_type_institutional: "Institutional",
    form_type_other: "Other",
    form_heard_placeholder: "How Did You Hear About Us?",
    form_heard_referral: "Referral",
    form_heard_google: "Google Search",
    form_heard_linkedin: "LinkedIn",
    form_heard_event: "Industry Event",
    form_heard_other: "Other",
    form_message: "Tell us about your project (optional)",
    form_submit: "Send Message",
    // Footer
    footer_tagline: "We Design. You Build.",
    footer_location: "Medell\u00edn, Colombia",
    footer_copy: "\u00a9 2026 Tottem Arquitectura. All rights reserved.",
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
    hero_eyebrow: "Estudio de Arquitectura y Documentaci\u00f3n \u00b7 Medell\u00edn, Colombia",
    hero_headline: "Nosotros Diseñamos. Usted Construye.",
    hero_sub: "Dise\u00f1o arquitect\u00f3nico y documentaci\u00f3n de construcci\u00f3n de nivel senior desde Colombia. Su zona horaria, sus c\u00f3digos, sus est\u00e1ndares. Treinta a\u00f1os de experiencia en construcci\u00f3n, ahora dedicados completamente al dise\u00f1o.",
    hero_cta_primary: "Solicite un Paquete Muestra",
    hero_cta_secondary: "Ver Nuestro Trabajo",
    stat_years: "A\u00f1os de Arquitectura y Construcci\u00f3n",
    stat_projects: "Proyectos Dise\u00f1ados y Documentados",
    stat_savings: "Ahorro vs. Firmas en EE.UU.",
    whyus_label: "POR QU\u00c9 TOTTEM",
    whyus_heading: "Qu\u00e9 nos hace diferentes.",
    whyus_01_title: "Hemos Construido Lo Que Usted Construir\u00e1",
    whyus_01_text: "La mayor\u00eda de las firmas de outsourcing solo dise\u00f1an. Nosotros pasamos 30 a\u00f1os dise\u00f1ando y construyendo. Sabemos lo que un contratista necesita porque hemos sido el contratista. Nuestros planos no solo se ven bien. Se construyen bien.",
    whyus_02_title: "Misma Zona Horaria, Colaboraci\u00f3n en Tiempo Real",
    whyus_02_text: "Con base en Colombia, operamos en hora del Este. Sin llamadas a medianoche. Sin demoras de 12 horas en email. Cuando su equipo trabaja, nosotros trabajamos. En Zoom, en BIM 360, en el mismo reloj.",
    whyus_03_title: "Talento Senior, Precios Racionales",
    whyus_03_text: "Nuestro equipo est\u00e1 liderado por arquitectos con d\u00e9cadas de experiencia. No dibujantes junior aprendiendo en su proyecto. Obtiene pensamiento de dise\u00f1o a nivel de socio al 40 a 60% de lo que cobra una firma comparable en EE.UU.",
    whyus_04_title: "Sus Est\u00e1ndares, No los Nuestros",
    whyus_04_text: "Trabajamos con IBC, C\u00f3digo de Construcci\u00f3n de Florida, enmiendas locales. Lo que su jurisdicci\u00f3n requiera. Nuestros entregables est\u00e1n formateados para su proceso de permisos, no el nuestro.",
    marquee_architectural_design: "Diseño Arquitectónico",
    marquee_construction_documentation: "Documentación de Construcción",
    marquee_design_consulting: "Consultoría de Diseño",
    marquee_draw_build: "Nosotros Diseñamos. Usted Construye.",
    marquee_bogota_colombia: "Medellín, Colombia",
    marquee_30_years_expertise: "30 Años de Experiencia",
    work_label: "PROYECTOS",
    work_heading: "Proyectos Arquitectónicos Seleccionados",
    project_cta: "Ver proyecto →",
    tag_residential: "Residencial",
    tag_commercial: "Comercial",
    tag_institutional: "Institucional",
    services_label: "SERVICIOS",
    services_heading: "Qué hacemos.",
    service_01_title: "Diseño Arquitectónico",
    service_01_body: "Del concepto al desarrollo de diseño, diseño esquemático, desarrollo de diseño, planos de permisos y presentaciones al cliente. Llevamos proyectos de la visión inicial a un diseño completamente desarrollado, listo para documentación.",
    service_01_d1: "Paquetes de Diseño Esquemático",
    service_01_d2: "Juegos de Desarrollo de Diseño",
    service_01_d3: "Planos para Permisos",
    service_01_d4: "Materiales de Presentación al Cliente",
    service_02_title: "Documentación de Construcción",
    service_02_body: "Juegos completos de documentos de construcción, detalles, especificaciones y planos de coordinación. Este es nuestro servicio B2B principal: documentación lista para producción con la que su equipo puede construir.",
    service_02_d1: "Juegos Completos de DC",
    service_02_d2: "Detalles y Secciones Constructivas",
    service_02_d3: "Especificaciones y Programas",
    service_02_d4: "Planos de Coordinación",
    service_01_pull: "Del primer boceto al plano listo para permisos.",
    service_02_pull: "Los planos con los que su contratista realmente construirá.",
    service_03_pull: "Treinta años de experiencia en obra, destilados en cada revisión.",
    service_03_title: "Consultor\u00eda de Dise\u00f1o",
    service_03_body: "\u00bfNecesita un segundo par de ojos expertos? Asesoramos en viabilidad de dise\u00f1o, estrategia de cumplimiento de c\u00f3digos y constructabilidad. Informados por tres d\u00e9cadas de construir lo que diseñamos.",
    service_03_d1: "Revisi\u00f3n y Cr\u00edtica de Dise\u00f1o",
    service_03_d2: "An\u00e1lisis de Constructabilidad",
    service_03_d3: "Estrategia de Cumplimiento de C\u00f3digos",
    service_03_d4: "Recomendaciones de Ingenier\u00eda de Valor",
    approach_label: "NUESTRO ENFOQUE",
    approach_heading: "Construido sobre Confianza, Entregado con Precisi\u00f3n",
    approach_text: "No creemos en el outsourcing de caja negra. Cada proyecto comienza con una conversaci\u00f3n directa entre su equipo y el nuestro. Conocer\u00e1 a su dise\u00f1ador principal por nombre. Tendr\u00e1 acceso a nuestros archivos en tiempo real. Y nunca se preguntar\u00e1 d\u00f3nde est\u00e1 su proyecto. Porque tratamos sus plazos como propios.",
    approach_clients: "Nuestros clientes son firmas de arquitectura, desarrolladores inmobiliarios y contratistas generales en Estados Unidos que necesitan producci\u00f3n de dise\u00f1o confiable y de alta calidad sin el costo de escalar un equipo interno.",
    sample_label: "PAQUETE MUESTRA",
    sample_heading: "Vea nuestro trabajo antes de comprometerse.",
    sample_subline: "Deje su correo de trabajo y le enviaremos un paquete muestra curado con una propuesta breve y personalizada dentro del siguiente día hábil.",
    sample_gate_label: "Solicite un paquete muestra personalizado.",
    sample_gate_text: "Revisamos su firma, el servicio que selecciona y el tipo de trabajo que realiza antes de responder. No es una respuesta automática genérica.",
    sample_gate_stamp: "Respuesta Curada",
    sample_form_email: "Correo de Trabajo",
    sample_form_company: "Nombre de la Firma (opcional)",
    sample_cta: "Solicitar Muestra Personalizada",
    sample_note: "Revisamos cada solicitud y respondemos dentro del siguiente día hábil.",
    sample_trust_real: "Muestra de proyecto terminado",
    sample_trust_docs: "Plantas, secciones, detalles y renders",
    sample_trust_review: "Propuesta breve y personalizada",
    sample_preview_label: "Entrega Curada",
    sample_preview_badge: "Siguiente Día Hábil",
    sample_preview_title: "Paquete Muestra + Propuesta Personalizada",
    sample_preview_meta: "Combinamos el paquete de entregables con una respuesta breve, construida según su firma y el servicio que seleccione.",
    sample_includes_label: "Lo que llega en el paquete",
    sample_success_label: "Solicitud Recibida",
    sample_success_title: "Revisaremos su firma y enviaremos un paquete muestra personalizado dentro del siguiente día hábil.",
    sample_success_text: "Su solicitud quedó registrada. Usaremos el perfil de su compañía y el servicio seleccionado para curar la respuesta.",
    sample_error: "No pudimos enviar su solicitud. Inténtelo de nuevo.",
    sample_feat_plans: "Plantas",
    sample_feat_sections: "Secciones",
    sample_feat_details: "Detalles",
    sample_feat_renders: "Renders 3D",
    process_label: "PROCESO",
    process_heading: "De la Primera Llamada a la Entrega Final.",
    process_intro: "Un flujo directo y visible, organizado alrededor de sus estándares, sus revisores y su jornada laboral.",
    process_sidecar_label: "¿Necesita el flujo completo?",
    process_sidecar_text: "Compartimos el mapa completo del proceso con cada paquete muestra personalizado.",
    process_deepen_cta: "Solicite el Flujo Completo",
    process_core_label: "Flujo Compartido",
    process_core_text: "Sus estándares. Sus revisores. Sus archivos.",
    process_assurance_01_label: "Comunicación Directa",
    process_assurance_01_text: "Usted trabaja con el arquitecto que lidera su paquete, no a través de varias capas de intermediación.",
    process_assurance_02_label: "Sus Estándares",
    process_assurance_02_text: "Plantillas, carátulas, notas de código, orden de planos y nomenclatura de archivos siguen su sistema.",
    process_assurance_03_label: "Archivos Compartidos",
    process_assurance_03_text: "Carpetas compartidas, BIM 360 / ACC y rondas de revisión mantienen el proceso claro desde el primer día.",
    process_you_label: "Usted Comparte",
    process_we_label: "Nosotros Entregamos",
    process_tools_label: "Herramientas:",
    process_tools_line: "Normalmente coordinamos en Revit, AutoCAD, Bluebeam, BIM 360 / ACC, Zoom, Teams y carpetas compartidas.",
    process_01_title: "Descubrimiento y Arranque",
    process_01_desc: "Alineamos brief, estándares, entregables y revisores antes de iniciar la producción.",
    process_01_time: "2–5 días hábiles",
    process_01_you: "Brief + estándares.",
    process_01_we: "Alcance + hoja de ruta.",
    process_01_tools: "Zoom o Teams, Drive o Dropbox, y BIM 360 / ACC cuando se requiere.",
    process_02_title: "Producción y Coordinación",
    process_02_desc: "Producimos bajo sus estándares, con avance visible y dudas de coordinación elevadas a tiempo.",
    process_02_time: "2–6 semanas, según el alcance",
    process_02_you: "Retroalimentación por hitos.",
    process_02_we: "Paquetes coordinados.",
    process_02_tools: "Revit, AutoCAD, Bluebeam, BIM 360 / ACC y juegos compartidos de revisión.",
    process_03_title: "Revisión y Correcciones",
    process_03_desc: "Los comentarios regresan en rondas claras, no perdidos en cadenas de correo.",
    process_03_time: "1–2 semanas por ciclo",
    process_03_you: "Marcaciones + dirección.",
    process_03_we: "Juegos actualizados.",
    process_03_tools: "Bluebeam, PDFs anotados, revisiones por Zoom y registros de transmittal.",
    process_04_title: "Entrega Final y Continuidad",
    process_04_desc: "Juegos limpios de emisión, archivos nativos según lo acordado y continuidad después de la entrega.",
    process_04_time: "1–3 días hábiles para emitir",
    process_04_you: "Aprobación final.",
    process_04_we: "Emisión + seguimiento.",
    process_04_tools: "Control interno de calidad, juegos de emisión, correo, Zoom y los mismos canales de trabajo ya establecidos.",
    process_05_title: "Control de Calidad y Entrega Final",
    process_05_desc: "Antes de que cualquier cosa salga de nuestra oficina, el set se revisa por coordinación, lógica de planos, referencias y claridad general.",
    process_05_time: "1–3 días hábiles",
    process_05_you: "La aprobación final para emitir o los requisitos de entrega de su equipo.",
    process_05_we: "PDFs emitidos, archivos nativos según lo acordado y un transmittal limpio de los entregables enviados.",
    process_05_tools: "Revisión interna por pares, juegos de emisión en PDF, exportación de archivos nativos y registro de entrega.",
    process_06_title: "Soporte Posterior a la Entrega",
    process_06_desc: "Seguimos disponibles para comentarios de permisos, adendas, aclaraciones y la siguiente fase del trabajo. La meta es continuidad, no una entrega seguida de silencio.",
    process_06_time: "Continuo",
    process_06_you: "Comentarios de revisión, preguntas de oferentes o aclaraciones de campo después de la emisión.",
    process_06_we: "Correcciones de seguimiento, soporte de respuesta y continuidad con el mismo equipo ya incorporado.",
    process_06_tools: "Correo electrónico, Zoom, Bluebeam y los mismos canales de trabajo ya establecidos.",
    process_timeline_label: "Rangos habituales de trabajo",
    process_timeline_note: "Los tiempos varían según alcance, consultores y jurisdicción.",
    process_timeline_01_label: "Soporte puntual",
    process_timeline_01_value: "2–4 semanas",
    process_timeline_02_label: "Juegos listos para permisos",
    process_timeline_02_value: "4–8 semanas",
    process_timeline_03_label: "Alcances mayores",
    process_timeline_03_value: "Hoja de ruta personalizada",
    studio_label: "ESTUDIO",
    studio_heading: "30 A\u00f1os Construyendo. Ahora Solo Dise\u00f1amos.",
    studio_text: "Durante tres d\u00e9cadas, Tottem Arquitectura lo hizo todo. Dise\u00f1amos edificios, los documentamos y luego los construimos. Torres residenciales en Medell\u00edn. Complejos comerciales en toda Colombia. Luego tomamos la decisi\u00f3n m\u00e1s grande de nuestra pr\u00e1ctica: dejamos de construir. No porque no pudi\u00e9ramos. Porque nos dimos cuenta de que nuestro mayor valor era nuestra capacidad de producir dise\u00f1o y documentaci\u00f3n que anticipaba la construcci\u00f3n. Planos que resolv\u00edan problemas antes de llegar al campo.",
    credentials_software: "Software y Herramientas",
    credentials_advantage: "Ventaja Colombia",
    cred_timezone: "Hora del Este (UTC-5)",
    cred_bilingual: "Equipo Biling\u00fce (EN/ES)",
    cred_pricing: "40-60% de Ahorro",
    cred_codes: "Cumplimiento IBC / FBC",
    finalcta_heading: "Comunicaci\u00f3n directa. Sin caja negra.",
    finalcta_text: "Si la forma de trabajar le parece alineada, el siguiente paso es simple. Use el formulario de contacto a continuaci\u00f3n y le responderemos directamente desde nuestro equipo.",
    finalcta_btn: "Ir a Contacto",
    contact_label: "CONTACTO",
    contact_heading: "Hablemos de Su Pr\u00f3ximo Proyecto",
    contact_subline: "Ya sea que tenga un proyecto listo o est\u00e9 explorando c\u00f3mo funciona el outsourcing arquitect\u00f3nico nearshore, nos gustar\u00eda escucharle. Sin discurso de ventas. Solo una conversaci\u00f3n directa entre arquitectos.",
    contact_whatsapp: "Esch\u00edbenos por WhatsApp",
    contact_location: "Medell\u00edn, Colombia (Hora del Este)",
    contact_hours: "Lunes a Viernes, 8:00 AM \u2013 6:00 PM ET",
    form_name: "Nombre Completo",
    form_company: "Empresa / Firma",
    form_email: "Correo Electr\u00f3nico",
    form_phone: "Tel\u00e9fono (opcional)",
    form_role_placeholder: "Su Rol",
    form_role_architect: "Arquitecto",
    form_role_developer: "Desarrollador",
    form_role_contractor: "Contratista",
    form_role_owner: "Propietario",
    form_role_other: "Otro",
    form_service_placeholder: "Servicio Necesitado",
    form_service_design: "Dise\u00f1o Arquitect\u00f3nico",
    form_service_docs: "Documentaci\u00f3n de Construcci\u00f3n",
    form_service_consulting: "Consultor\u00eda de Dise\u00f1o",
    form_service_unsure: "A\u00fan No Estoy Seguro",
    sample_service_hint: "Seleccione hasta tres servicios.",
    sample_service_required: "Por favor seleccione al menos un servicio.",
    sample_service_limit: "Por favor seleccione no m\u00e1s de tres servicios.",
    form_type_placeholder: "Tipo de Proyecto",
    form_type_residential: "Residencial",
    form_type_commercial: "Comercial",
    form_type_mixed: "Uso Mixto",
    form_type_hospitality: "Hospitalidad",
    form_type_institutional: "Institucional",
    form_type_other: "Otro",
    form_heard_placeholder: "\u00bfC\u00f3mo Nos Encontr\u00f3?",
    form_heard_referral: "Referido",
    form_heard_google: "B\u00fasqueda en Google",
    form_heard_linkedin: "LinkedIn",
    form_heard_event: "Evento de la Industria",
    form_heard_other: "Otro",
    form_message: "Cu\u00e9ntenos sobre su proyecto (opcional)",
    form_submit: "Enviar Mensaje",
    footer_tagline: "Nosotros Diseñamos. Usted Construye.",
    footer_location: "Medell\u00edn, Colombia",
    footer_copy: "\u00a9 2026 Tottem Arquitectura. Todos los derechos reservados.",
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

const MARQUEE_SEQUENCE = [
  { key: 'marquee_architectural_design', kind: 'service' },
  { key: 'marquee_construction_documentation', kind: 'service' },
  { key: 'marquee_design_consulting', kind: 'service' },
  { key: 'marquee_draw_build', kind: 'statement' },
  { key: 'marquee_bogota_colombia', kind: 'meta' },
  { key: 'marquee_30_years_expertise', kind: 'proof' }
];

const PROJECT_CATEGORY_LABELS = {
  en: {
    residential: 'Residential',
    commercial: 'Commercial',
    institutional: 'Institutional',
  },
  es: {
    residential: 'Residencial',
    commercial: 'Comercial',
    institutional: 'Institucional',
  },
};

const SEO_CONTENT = {
  en: {
    title: 'Nearshore Architectural Design & Construction Documentation | Tottem',
    description: 'Nearshore architectural design, construction documentation, and consulting for U.S. architecture firms, developers, and contractors. Based in Medellín, same time zone.',
    ogLocale: 'en_US',
  },
  es: {
    title: 'Diseño Arquitectónico y Documentación Constructiva Nearshore | Tottem',
    description: 'Diseño arquitectónico, documentación constructiva y consultoría para firmas de arquitectura, desarrolladores y contratistas en Estados Unidos. Basados en Medellín, misma zona horaria.',
    ogLocale: 'es_CO',
  },
};

function getProjectCategoryLabel(lang, category) {
  return (PROJECT_CATEGORY_LABELS[lang] && PROJECT_CATEGORY_LABELS[lang][category]) || category;
}

function applySeoLanguage(lang) {
  const seo = SEO_CONTENT[lang] || SEO_CONTENT.en;
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  document.title = seo.title;

  const updates = [
    ['meta[name="description"]', seo.description],
    ['meta[property="og:title"]', seo.title],
    ['meta[property="og:description"]', seo.description],
    ['meta[property="og:locale"]', seo.ogLocale],
    ['meta[name="twitter:title"]', seo.title],
    ['meta[name="twitter:description"]', seo.description],
  ];

  updates.forEach(([selector, value]) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute('content', value);
    }
  });
}

function renderMarquee(lang) {
  const marqueeTrack = document.getElementById('marquee-track');
  if (!marqueeTrack || !translations[lang]) return;

  const repeatedItems = [...MARQUEE_SEQUENCE, ...MARQUEE_SEQUENCE];
  marqueeTrack.innerHTML = repeatedItems
    .map((item, index) => {
      const label = translations[lang][item.key];
      const separator = index === repeatedItems.length - 1
        ? ''
        : '<span class="marquee-sep" aria-hidden="true"></span>';

      return `<span class="marquee-item marquee-item--${item.kind}">${label}</span>${separator}`;
    })
    .join('');
}

function applyLanguage(lang) {
  applySeoLanguage(lang);
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
  document.querySelectorAll('.cover-info-category[data-category]').forEach(el => {
    const cat = el.dataset.category;
    el.textContent = getProjectCategoryLabel(lang, cat);
  });
  document.querySelectorAll('.cover-mobile-category[data-category]').forEach(el => {
    const cat = el.dataset.category;
    el.textContent = getProjectCategoryLabel(lang, cat);
  });
  document.querySelectorAll('.cover-info-title[data-name-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.nameEs : el.dataset.nameEn;
  });
  document.querySelectorAll('.cover-mobile-title[data-name-en]').forEach(el => {
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
  document.querySelectorAll('.sample-service-help').forEach(el => {
    if (el.dataset.helpEn) {
      el.textContent = lang === 'es' ? el.dataset.helpEs : el.dataset.helpEn;
      return;
    }

    const key = el.getAttribute('data-i18n');
    if (key && translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  // Select option translations
  document.querySelectorAll('select option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  renderMarquee(lang);
  // Update all lang-opt buttons (nav pill + mobile pill)
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });
  localStorage.setItem('tottem-lang', lang);
}

// Init language on load
let currentLang = localStorage.getItem('tottem-lang') || 'en';
applyLanguage(currentLang);

const initSampleGateForm = () => {
  const sampleForm = document.querySelector('.sample-gate-form');
  if (!sampleForm) return;

  const sampleCard = sampleForm.querySelector('.sample-gate-card');
  const submitButton = sampleForm.querySelector('.sample-cta');
  const errorEl = sampleForm.querySelector('.sample-gate-error');
  const serviceInputs = Array.from(sampleForm.querySelectorAll('input[name="service_needed"]'));
  const serviceErrorEl = sampleForm.querySelector('.sample-service-error');

  const setSampleServiceError = (message = '') => {
    if (!serviceErrorEl) return;
    serviceErrorEl.textContent = message;
  };

  const getSelectedServices = () => serviceInputs.filter(input => input.checked);

  const validateSampleServices = () => {
    const selected = getSelectedServices();

    if (selected.length === 0) {
      setSampleServiceError(translations[currentLang]?.sample_service_required || 'Please choose at least one service.');
      return false;
    }

    if (selected.length > 3) {
      setSampleServiceError(translations[currentLang]?.sample_service_limit || 'Please choose no more than three services.');
      return false;
    }

    setSampleServiceError('');
    return true;
  };

  serviceInputs.forEach(input => {
    input.addEventListener('change', () => {
      const selected = getSelectedServices();

      if (selected.length > 3) {
        input.checked = false;
        setSampleServiceError(translations[currentLang]?.sample_service_limit || 'Please choose no more than three services.');
        return;
      }

      setSampleServiceError('');
    });
  });

  sampleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!sampleForm.reportValidity()) {
      return;
    }

    if (!validateSampleServices()) {
      serviceInputs[0]?.focus();
      return;
    }

    const selectedServices = getSelectedServices();
    const selectedServiceValues = selectedServices.map(input => input.value);
    const selectedServiceLabels = selectedServices.map(input => {
      const labelKey = input.dataset.serviceLabelKey;
      return (labelKey && translations[currentLang]?.[labelKey]) || input.value;
    });

    const payload = {
      requestType: 'sample_package',
      fullName: sampleForm.querySelector('#sample-name')?.value.trim() || '',
      email: sampleForm.querySelector('#sample-email')?.value.trim() || '',
      company: sampleForm.querySelector('#sample-company')?.value.trim() || '',
      serviceNeeded: selectedServiceValues.join(', '),
      servicesNeeded: selectedServiceValues,
      serviceLabels: selectedServiceLabels,
      language: currentLang,
      submittedAt: new Date().toISOString()
    };

    const endpoint = sampleForm.dataset.endpoint?.trim();
    const storageKey = sampleForm.dataset.storageKey?.trim() || 'tottem-sample-requests';

    sampleCard?.classList.remove('is-error');
    if (errorEl) {
      errorEl.textContent = translations[currentLang]?.sample_error || '';
    }
    setSampleServiceError('');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
    }

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Sample request failed: ${response.status}`);
        }
      } else {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existing.push(payload);
        localStorage.setItem(storageKey, JSON.stringify(existing));
      }

      sampleForm.reset();
      setSampleServiceError('');
      sampleCard?.classList.add('is-submitted');
    } catch (error) {
      sampleCard?.classList.add('is-error');
      if (errorEl) {
        errorEl.textContent = translations[currentLang]?.sample_error || 'Unable to send request.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
      }
    }
  });
};

initSampleGateForm();

// Lang option click handlers (nav + mobile)
document.querySelectorAll('.lang-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    const newLang = btn.dataset.lang;
    if (newLang !== currentLang) {
      currentLang = newLang;
      applyLanguage(currentLang);
    }
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
      { type: "full", image: "images/behance_161726219_02.jpg", caption_en: "The pool terrace extends the living pavilion outward, a continuous plane of water and stone where the built and the natural negotiate a shared horizon.", caption_es: "La terraza de la piscina extiende el pabellón de vida hacia el exterior, un plano continuo de agua y piedra donde lo construido y lo natural negocian un horizonte compartido." },
      { type: "editorial", image: "images/behance_161726219_03.jpg", pull_en: "The section reveals what the eye alone cannot see.", pull_es: "La sección revela lo que el ojo solo no puede ver.", body_en: "Pool Area Section A documents the precision behind the apparent ease. Three resolved levels (the covered terrace at 5.50 m, the pool deck at 1.00 m, the water surface 1.40 m below) are unified by a continuous palette of exposed concrete and local stone. Glass sliding doors dissolve the boundary between outdoor kitchen and interior; the sloped roof structure above provides shade without enclosure, drawing the eye toward the valley beyond.", body_es: "La Sección A del área de piscina documenta la precisión detrás de la aparente facilidad. Tres niveles resueltos (la terraza cubierta a 5.50 m, el deck de la piscina a 1.00 m, la lámina de agua 1.40 m más abajo) unificados por una paleta continua de concreto a la vista y piedra local. Las puertas corredizas de vidrio disuelven el límite entre la cocina exterior y el interior; la estructura de techo inclinado proporciona sombra sin cerramiento, dirigiendo la vista hacia el valle." },
      { type: "statement", number: "01", text_en: "Every material decision made in dialogue with the hillside.", text_es: "Cada decisión de material tomada en diálogo con la ladera.", detail_en: "Casa Colinas, Medellín, 2021", detail_es: "Casa Colinas, Medellín, 2021" },
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
      { type: "full", image: "images/behance_157821753_02.jpg", caption_en: "A family home in the Laureles neighborhood, intimate in scale, generous in light.", caption_es: "Una vivienda familiar en el barrio Laureles, íntima en escala, generosa en luz." },
      { type: "editorial", image: "images/behance_157821753_03.jpg", pull_en: "The street and the garden in conversation.", pull_es: "La calle y el jardín en conversación.", body_en: "The facade negotiates between the urban fabric and the private interior, offering a controlled threshold that transforms the experience of arrival.", body_es: "La fachada negocia entre el tejido urbano y el interior privado, ofreciendo un umbral controlado que transforma la experiencia de llegada." },
      { type: "statement", number: "02", text_en: "Openness achieved through light and section, not area.", text_es: "La amplitud lograda a través de la luz y la sección, no del área.", detail_en: "Casa Laureles, Medellín, 2019", detail_es: "Casa Laureles, Medellín, 2019" },
      { type: "editorial", flip: true, image: "images/behance_157821753_07.jpg", pull_en: "Materiality without excess.", pull_es: "Materialidad sin exceso.", body_en: "Exposed concrete, raw timber, and natural stone, each material present for a reason, each surface an honest expression of its structure.", body_es: "Concreto a la vista, madera cruda y piedra natural, cada material presente por una razón, cada superficie una expresión honesta de su estructura." }
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
      { type: "statement", number: "03", text_en: "The house is never the same place twice.", text_es: "La casa nunca es el mismo lugar dos veces.", detail_en: "Casa del Bosque, Medellín, 2022", detail_es: "Casa del Bosque, Medellín, 2022" },
      { type: "editorial", image: "images/behance_161710953_09.jpg", pull_en: "A house that changes with the seasons.", pull_es: "Una casa que cambia con las estaciones.", body_en: "As the forest blooms and sheds, the interior light shifts, from the filtered green of April to the open clarity of January.", body_es: "A medida que el bosque florece y cae, la luz interior cambia, del verde filtrado de abril a la claridad abierta de enero." }
    ]
  },
  {
    id: 3,
    name: "Villa Nogal",
    name_es: "Villa Nogal",
    category: "residential",
    meta: { location: "Medellín", year: "2023", area: "850 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "The studio's most ambitious residential project to date. A compound organized around a central courtyard that serves as the heart of family life, distributing light, air, and movement through a series of interconnected pavilions.",
    intro_es: "El proyecto residencial más ambicioso del estudio hasta la fecha. Un conjunto organizado en torno a un patio central que sirve como corazón de la vida familiar, distribuyendo luz, aire y movimiento a través de una serie de pabellones interconectados.",
    spreads: [
      { type: "cover", image: "images/behance_161730713_01.jpg" },
      { type: "full", image: "images/behance_161730713_03.jpg", caption_en: "An estate defined by the tension between enclosure and openness, walls that protect, voids that breathe.", caption_es: "Una villa definida por la tensión entre el cerramiento y la apertura, muros que protegen, vacíos que respiran." },
      { type: "editorial", image: "images/behance_161730713_05.jpg", pull_en: "The courtyard as the heart of the house.", pull_es: "El patio como corazón de la casa.", body_en: "All primary spaces orbit a central courtyard, a room without a roof, calibrated to the path of the sun, gathering light and distributing it through the sections of the house.", body_es: "Todos los espacios principales orbitan un patio central, una habitación sin techo, calibrada al recorrido del sol, recolectando luz y distribuyéndola a través de las secciones de la casa." },
      { type: "full", image: "images/behance_161730713_08.jpg", caption_en: "Water, stone, and silence. The pool terrace as a meditative threshold.", caption_es: "Agua, piedra y silencio. La terraza de la piscina como umbral meditativo." },
      { type: "editorial", flip: true, image: "images/behance_161730713_11.jpg", pull_en: "Thirty years of expertise in a single project.", pull_es: "Treinta años de experiencia en un solo proyecto.", body_en: "Villa Nogal represents the studio's most complete residential statement to date, a synthesis of the material philosophy, spatial language, and construction rigor developed over three decades.", body_es: "Villa Nogal representa la declaración residencial más completa del estudio hasta la fecha, una síntesis de la filosofía material, el lenguaje espacial y el rigor constructivo desarrollados a lo largo de tres décadas." }
    ]
  },
  {
    id: 4,
    name: "Works & Pavilions",
    name_es: "Obras & Pabellones",
    category: "institutional",
    meta: { location: "Colombia", year: "2018–2024", area: "Variable", status_en: "Ongoing", status_es: "En curso" },
    intro_en: "A collection of ephemeral and permanent structures built for cultural programs across Colombia. Each pavilion is treated as an experiment in material and structure, concentrated arguments about what architecture can do at any scale.",
    intro_es: "Una colección de estructuras efímeras y permanentes construidas para programas culturales en Colombia. Cada pabellón es tratado como un experimento en material y estructura, argumentos concentrados sobre lo que la arquitectura puede hacer a cualquier escala.",
    spreads: [
      { type: "cover", image: "images/behance_157808365_01.jpg" },
      { type: "full", image: "images/behance_161723547_01.jpg", caption_en: "Ephemeral structures that question the permanence of space, built to last a season, designed to be remembered.", caption_es: "Estructuras efímeras que cuestionan la permanencia del espacio, construidas para durar una temporada, diseñadas para ser recordadas." },
      { type: "editorial", flip: true, image: "images/behance_161729313_01.jpg", pull_en: "Architecture as event.", pull_es: "La arquitectura como evento.", body_en: "The pavilion typology allows the studio to experiment with structure, material, and program in compressed form, each pavilion a concentrated argument about what architecture can do.", body_es: "La tipología del pabellón permite al estudio experimentar con estructura, material y programa en forma comprimida, cada pabellón un argumento concentrado sobre lo que la arquitectura puede hacer." },
      { type: "full", image: "images/behance_161982839_01.jpg", caption_en: "Public space activated, the pavilion as a catalyst for collective inhabitation.", caption_es: "Espacio público activado, el pabellón como catalizador de la habitación colectiva." }
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
      { type: "editorial", flip: true, image: "images/behance_161730713_09.jpg", pull_en: "The threshold between work and community.", pull_es: "El umbral entre el trabajo y la comunidad.", body_en: "The design refuses the false separation between production and social life, the café, the terrace, and the meeting room share the same material language as the studio floor.", body_es: "El diseño rechaza la falsa separación entre producción y vida social, el café, la terraza y la sala de reuniones comparten el mismo lenguaje material que el piso del estudio." }
    ]
  },
  {
    id: 6,
    name: "Civic Pavilion",
    name_es: "Pabellón Cívico",
    category: "institutional",
    meta: { location: "Colombia", year: "2022", area: "1,200 m²", status_en: "Completed", status_es: "Terminado" },
    intro_en: "A public building conceived as civic infrastructure, permanent, adaptable, and legible to all. The project responds to the challenge of designing for collective use: spaces that belong to no one in particular and therefore to everyone.",
    intro_es: "Un edificio público concebido como infraestructura cívica, permanente, adaptable y legible para todos. El proyecto responde al desafío de diseñar para el uso colectivo: espacios que no pertenecen a nadie en particular y que por eso pertenecen a todos.",
    spreads: [
      { type: "cover", image: "images/behance_161723547_01.jpg" },
      { type: "full", image: "images/behance_161729313_01.jpg", caption_en: "Civic space as democratic infrastructure, designed to serve every person who enters.", caption_es: "Espacio cívico como infraestructura democrática, diseñado para servir a cada persona que entra." },
      { type: "editorial", image: "images/behance_161982839_01.jpg", pull_en: "Architecture in service of the public.", pull_es: "La arquitectura al servicio de lo público.", body_en: "The building was designed with the understanding that public institutions must project stability and openness in equal measure, a presence on the street that is both authoritative and welcoming.", body_es: "El edificio fue diseñado con la comprensión de que las instituciones públicas deben proyectar estabilidad y apertura en igual medida, una presencia en la calle que es a la vez autoritativa y acogedora." }

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
    cat.textContent = getProjectCategoryLabel(lang, project.category);

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

    // Meta items (year, area, status), right-aligned
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
    img.alt = lang === 'es'
      ? `${project.name_es}, proyecto arquitectónico en ${project.meta?.location || 'Colombia'}`
      : `${project.name}, architectural project in ${project.meta?.location || 'Colombia'}`;
    img.loading = isFirst ? 'eager' : 'lazy';
    frame.appendChild(img);

    const mobileSummary = document.createElement('div');
    mobileSummary.className = 'cover-mobile-summary';

    const mobileCategory = document.createElement('p');
    mobileCategory.className = 'cover-mobile-category';
    mobileCategory.dataset.category = project.category;
    mobileCategory.textContent = getProjectCategoryLabel(lang, project.category);

    const mobileTitle = document.createElement('h3');
    mobileTitle.className = 'cover-mobile-title';
    mobileTitle.dataset.nameEn = project.name;
    mobileTitle.dataset.nameEs = project.name_es;
    mobileTitle.textContent = lang === 'es' ? project.name_es : project.name;

    const mobileMeta = document.createElement('p');
    mobileMeta.className = 'cover-mobile-meta';

    const mobileLocation = document.createElement('span');
    mobileLocation.className = 'cover-mobile-location';
    mobileLocation.textContent = project.meta?.location || '';
    mobileMeta.appendChild(mobileLocation);

    if (project.meta?.year) {
      const mobileMetaSep = document.createElement('span');
      mobileMetaSep.className = 'cover-mobile-meta-sep';
      mobileMetaSep.setAttribute('aria-hidden', 'true');
      mobileMetaSep.textContent = '•';
      mobileMeta.appendChild(mobileMetaSep);

      const mobileYear = document.createElement('span');
      mobileYear.className = 'cover-mobile-year';
      mobileYear.textContent = project.meta.year;
      mobileMeta.appendChild(mobileYear);
    }

    mobileSummary.appendChild(mobileCategory);
    mobileSummary.appendChild(mobileTitle);
    mobileSummary.appendChild(mobileMeta);
    frame.appendChild(mobileSummary);
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
    img.alt = lang === 'es'
      ? `${project.name_es}: ${spread.caption_es || spread.pull_es || 'documentación y arquitectura'}`
      : `${project.name}: ${spread.caption_en || spread.pull_en || 'architecture and documentation'}`;
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
    img.alt = lang === 'es'
      ? `${project.name_es}: ${spread.pull_es || 'detalle arquitectonico'}`
      : `${project.name}: ${spread.pull_en || 'architectural detail'}`;
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
  // Last slide is full-width, nothing to peek at after it
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
    // not the page, this gives the BIG.dk-style direct response to gestures
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

  // Slide text reveal, when the project card enters the vertical viewport,
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

  // Category tag, always-visible label at bottom-right of card
  // Especially useful on mobile where the cover info panel is hidden
  const tagEl = document.createElement('span');
  tagEl.className = 'project-tag';
  tagEl.dataset.i18n = `tag_${project.category}`;
  tagEl.textContent = currentLang === 'es'
    ? translations.es[`tag_${project.category}`]
    : translations.en[`tag_${project.category}`];
  card.appendChild(tagEl);
});

onScroll();
