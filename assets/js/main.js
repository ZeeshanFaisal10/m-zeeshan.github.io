/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}
/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
// When we click on each nav_link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () =>{
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                       : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)



/*=============== EMAIL JS ===============*/


/*=============== SHOW SCROLL UP ===============*/ 
const scrollUP = () =>{
    const scrollUP = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUP.classList.add('show-scroll')
    :
    scrollUP.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUP)
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections  = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop - 58,
        sectionId = current.getAttribute('id')
        sectionsClass = document.querySelector('.nav__menu a[href*='+ sectionId +']')

        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)
/*=============== DARK LIGHT THEME ===============*/ 


/*=============== SCROLL REVEAL ANIMATION ===============*/
// const sr = ScrollReveal({
//     origin: 'top',
//     distance: '60px',
//     duration: 2500,
//     delay: 400,
//     // reset: true
// })

// sr.reveal(`.home__perfil, .about__image`, {origin: 'right'})
// sr.reveal(`.home__name, .home__info, .section__title-2,
//     .about__container, .section__title-1, .about__info
//     `, {origin: 'left'})

// sr.reveal(`.projects__card`, {interval: 100})
if (window.ScrollReveal) {
  const sr = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400,
      // reset: true
  });

  sr.reveal(`.home__perfil, .about__image`, {origin: 'right'});
  sr.reveal(`.home__name, .home__info, .section__title-2,
      .about__container, .section__title-1, .about__info
      `, {origin: 'left'});
  sr.reveal(`.projects__card`, {interval: 100});
} else {
  console.warn('ScrollReveal not loaded; skipping animations.');
}


// Modal

   /* ===== Modal & Gallery (multi-project) ===== */
(() => {
  const modal = document.getElementById('galleryModal');
  if (!modal) return; // modal not present on page

  const dialog = modal.querySelector('.modal__dialog');
  const overlay = modal.querySelector('[data-close-overlay]');
  const closeBtn = document.getElementById('closeModalBtn');
  const closeFooterBtn = document.getElementById('closeFooterBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  const downloadBtn = document.getElementById('downloadBtn');

  const slidesWrap = document.getElementById('slides');
  const projectButtons = Array.from(document.querySelectorAll('.projects__button'));

  // Give each button a dynamic id
  projectButtons.forEach((btn, i) => {
    if (!btn.id) btn.id = `openModalBtn-${i + 1}`;
  });

  let current = 0;
  let lastFocus = null;

  function buildSlidesFromUrls(urls) {
    // Clear existing slides & dots
    slidesWrap.innerHTML = '';
    dotsWrap.innerHTML = '';

    // Add new slides
    urls.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      const img = document.createElement('img');
      img.src = src.trim();
      img.alt = `Project image ${i + 1}`;
      img.draggable = false;
      slide.appendChild(img);
      slidesWrap.appendChild(slide);

      // Dot
      const d = document.createElement('button');
      d.className = 'dot';
      d.type = 'button';
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function getSlides() {
    return Array.from(slidesWrap.children);
  }

  function update() {
    const slides = getSlides();
    slidesWrap.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    const img = slides[current]?.querySelector('img');
    if (img) {
      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = img.src;
        a.download = (img.getAttribute('alt') || 'image').replace(/\s+/g, '_');
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
    }
  }

  function goTo(i) {
    const slides = getSlides();
    current = ((i % slides.length) + slides.length) % slides.length;
    update();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function openModal() {
    lastFocus = document.activeElement;
    modal.dataset.open = 'true';
    modal.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
    update();
    document.addEventListener('keydown', onKey);
    document.addEventListener('focus', trapFocus, true);
  }

  function closeModal() {
    modal.dataset.open = 'false';
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('focus', trapFocus, true);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }

  function trapFocus(e) {
    if (!modal.contains(e.target)) {
      e.stopPropagation();
      closeBtn?.focus();
    }
  }

  // Hook up project buttons
  projectButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Read gallery URLs from data-gallery (pipe-separated)
      const list = (btn.getAttribute('data-gallery') || '').split('|').map(s => s.trim()).filter(Boolean);
      const urls = list.length ? list : [
        // fallback sample images if none provided
        'https://picsum.photos/id/1015/1600/1000',
        'https://picsum.photos/id/1025/1600/1000',
        'https://picsum.photos/id/1003/1600/1000'
      ];
      buildSlidesFromUrls(urls);
      current = 0;
      openModal();
    });
  });

  // Static controls
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  closeFooterBtn?.addEventListener('click', closeModal);
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  // Touch swipe
  let startX = 0;
  dialog.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  });

  // Optional: open specific slide via hash (#slide=2)
  const params = new URLSearchParams(location.hash.replace('#',''));
  const hashSlide = Number(params.get('slide'));
  if (!Number.isNaN(hashSlide)) current = Math.max(0, hashSlide - 1);
})();
