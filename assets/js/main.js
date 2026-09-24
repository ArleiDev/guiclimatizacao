/**
 * GUI CLIMATIZAÇÃO - SCRIPT PRINCIPAL
 * Agendamento WhatsApp, Calculadora de BTUs, Modais e Interatividade
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initWhatsAppBooking();
  initBtuCalculator();
  initFaqAccordion();
  initImageModal();
  initSmoothScroll();
});

// Número do WhatsApp oficial
const WHATSAPP_PHONE = '5577991573470';
const WHATSAPP_FORMATTED = '(77) 99157-3470';

/* ==========================================================================
   1. MENU MOBILE
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu(show) {
    if (show) {
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = '';
    }
  }

  menuBtn.addEventListener('click', () => toggleMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* ==========================================================================
   2. AGENDAMENTO & ORÇAMENTO VIA WHATSAPP (FORMULÁRIO INTELIGENTE)
   ========================================================================== */
function initWhatsAppBooking() {
  const form = document.getElementById('whatsapp-booking-form');
  const previewBox = document.getElementById('whatsapp-preview-text');
  if (!form) return;

  const nameInput = document.getElementById('booking-name');
  const phoneInput = document.getElementById('booking-phone');
  const serviceSelect = document.getElementById('booking-service');
  const locationTypeSelect = document.getElementById('booking-location-type');
  const citySelect = document.getElementById('booking-city');
  const periodSelect = document.getElementById('booking-period');
  const notesInput = document.getElementById('booking-notes');

  function generateMessage() {
    const name = nameInput.value.trim() || 'Cliente';
    const phone = phoneInput.value.trim() || 'Não informado';
    const service = serviceSelect.value || 'Instalação ou Manutenção';
    const locationType = locationTypeSelect.value || 'Residencial';
    const city = citySelect.value || 'Ibipitanga / Primavera do Leste';
    const period = periodSelect.value || 'Horário Comercial';
    const notes = notesInput.value.trim();

    let msg = `*SOLICITAÇÃO DE AGENDAMENTO / ORÇAMENTO* ❄️🔧\n`;
    msg += `Olá, Gui Climatização! Gostaria de atendimento:\n\n`;
    msg += `👤 *Nome:* ${name}\n`;
    if (phone !== 'Não informado') {
      msg += `📱 *WhatsApp:* ${phone}\n`;
    }
    msg += `🛠️ *Serviço:* ${service}\n`;
    msg += `🏢 *Tipo de Imóvel:* ${locationType}\n`;
    msg += `📍 *Cidade / Região:* ${city}\n`;
    msg += `⏰ *Melhor Horário:* ${period}\n`;
    if (notes) {
      msg += `📝 *Observações:* ${notes}\n`;
    }
    msg += `\n_Vim através do site oficial e aguardo confirmação!_`;

    return msg;
  }

  function updatePreview() {
    if (!previewBox) return;
    const msg = generateMessage();
    previewBox.innerText = msg;
  }

  // Eventos de digitação para atualizar o preview em tempo real
  const inputs = [nameInput, phoneInput, serviceSelect, locationTypeSelect, citySelect, periodSelect, notesInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    }
  });

  // Envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!nameInput.value.trim()) {
      alert('Por favor, informe seu nome para prosseguir.');
      nameInput.focus();
      return;
    }

    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });

  // Atualiza primeira vez
  updatePreview();
}

/* ==========================================================================
   3. CALCULADORA DE BTUs INTERATIVA
   ========================================================================== */
function initBtuCalculator() {
  const areaRange = document.getElementById('calc-area-range');
  const areaNumber = document.getElementById('calc-area-number');
  const sunSelect = document.getElementById('calc-sun');
  const peopleInput = document.getElementById('calc-people');
  const peopleVal = document.getElementById('calc-people-val');
  const techInput = document.getElementById('calc-tech');
  const techVal = document.getElementById('calc-tech-val');

  const btuResultDisplay = document.getElementById('calc-btu-result');
  const btuIdealDisplay = document.getElementById('calc-btu-ideal');
  const btuTipDisplay = document.getElementById('calc-btu-tip');
  const btuWhatsAppBtn = document.getElementById('calc-whatsapp-btn');

  if (!areaRange || !btuResultDisplay) return;

  function calculateBTU() {
    const area = parseFloat(areaRange.value) || 15;
    const isHeavySun = sunSelect.value === 'heavy'; // Sol da tarde ou ambiente envidraçado
    const baseBtuPerMeter = isHeavySun ? 800 : 600;

    const people = parseInt(peopleInput.value) || 1;
    const additionalPeople = Math.max(0, people - 1);
    const peopleBtu = additionalPeople * (isHeavySun ? 800 : 600);

    const electronics = parseInt(techInput.value) || 1;
    const techBtu = electronics * 600;

    const totalRawBtu = (area * baseBtuPerMeter) + peopleBtu + techBtu;

    // Achar capacidade comercial padrão recomendada
    const commercialSizes = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
    let recommended = 9000;

    for (let size of commercialSizes) {
      if (totalRawBtu <= size) {
        recommended = size;
        break;
      }
      recommended = size;
    }

    if (totalRawBtu > 60000) {
      recommended = 60000; // Ou multi-split
    }

    // Atualiza exibições
    btuResultDisplay.textContent = `${totalRawBtu.toLocaleString('pt-BR')} BTUs`;
    btuIdealDisplay.textContent = `${recommended.toLocaleString('pt-BR')} BTUs`;

    if (recommended <= 12000) {
      btuTipDisplay.textContent = 'Ideal para quartos e salas compactas. Recomendamos modelos Inverter para até 70% de economia de energia!';
    } else if (recommended <= 24000) {
      btuTipDisplay.textContent = 'Ideal para salas integradas, escritórios e áreas médias com fluxo regular de pessoas.';
    } else {
      btuTipDisplay.textContent = 'Ideal para grandes ambientes comerciais, lojas ou residências amplas. Avalie modelos Piso-Teto ou Cassete.';
    }

    // Atualiza link do botão para WhatsApp
    const message = encodeURIComponent(
      `Olá, Gui Climatização! Calculei no site a necessidade de climatização para um espaço de ${area}m² com recomendação de *${recommended.toLocaleString('pt-BR')} BTUs*. Gostaria de saber os valores para compra ou instalação!`
    );
    btuWhatsAppBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
  }

  // Sincronizar Range e Number
  areaRange.addEventListener('input', () => {
    areaNumber.value = areaRange.value;
    calculateBTU();
  });

  areaNumber.addEventListener('input', () => {
    let val = parseFloat(areaNumber.value);
    if (val < 5) val = 5;
    if (val > 100) val = 100;
    areaRange.value = val;
    calculateBTU();
  });

  peopleInput.addEventListener('input', () => {
    peopleVal.textContent = peopleInput.value;
    calculateBTU();
  });

  techInput.addEventListener('input', () => {
    techVal.textContent = techInput.value;
    calculateBTU();
  });

  sunSelect.addEventListener('change', calculateBTU);

  // Iniciar cálculo
  calculateBTU();
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      // Alterna o atual
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. MODAL DE ZOOM DE IMAGENS (CARDS DA EMPRESA)
   ========================================================================== */
function initImageModal() {
  const modal = document.getElementById('image-lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const zoomTriggers = document.querySelectorAll('.zoomable-image');

  if (!modal || !modalImg) return;

  function openModal(src, caption) {
    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = caption || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  zoomTriggers.forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-img') || el.src;
      const caption = el.getAttribute('data-caption') || el.alt;
      openModal(src, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. ROLAGEM SUAVE COM OFFSET DE CABEÇALHO
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Função global para preencher serviço rapidamente a partir dos botões de cards
window.selectServiceAndSchedule = function(serviceName) {
  const serviceSelect = document.getElementById('booking-service');
  const bookingSection = document.getElementById('agendamento');

  if (serviceSelect) {
    // Acha a melhor opção correspondente
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
    // Dispara evento de mudança
    serviceSelect.dispatchEvent(new Event('change'));
  }

  if (bookingSection) {
    const headerOffset = 80;
    const elementPosition = bookingSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
