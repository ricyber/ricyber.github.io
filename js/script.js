// Estado de tema con persistencia
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);
})();

// Toggle de tema
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Scroll suave y estado activo del menú
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
        history.replaceState(null, '', href);
      }
    }
  });
});

const sections = ['#inicio','#experiencia','#proyectos','#formacion', '#cursos','#habilidades','#sobre-mi']
  .map(id => document.querySelector(id))
  .filter(Boolean);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link.active').forEach(a => a.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => observer.observe(sec));

// GSAP: animación de terminal tipo "escritura"
const terminalLines = [
  '$ ri@cyber:~$ whoami',
  '>> Ricardo Salazar',
  '$ ri@cyber:~$ pwd',
  '>> /home/ri&cyber',
  '$ ri@cyber:~$ ls -la',
  '>> drwxr--r--. 1 root ri&cyber 18:17 linux-x64.pkg.tar.xz',
  '>> drwxrwxrwx. 1 root ri&cyber 17:08 cyber-status.txt',
  '>> -r-xr-x-wx. 1 root ri&cyber 13:17 upt-33.AppImage',
  '$ ri@cyber:~$ cat /home/ri&cyber/cyber-status.txt',
  '>> Bienvenido a mi portafolio'
];

function typeLine(line, delayMs, isLastLine) {
  return new Promise(resolve => {
    const out = document.getElementById('terminalOutput');
    if (!out) return resolve();
    const cursor = ensureCursor();
    const span = document.createElement('span');
    out.appendChild(span);
    let i = 0;
    const speed = 30; // ms por caracter
    setTimeout(function write() {
      span.textContent = line.slice(0, i++);
      // Mantener el cursor siempre al final del texto en curso
      if (cursor) out.appendChild(cursor);
      if (i <= line.length) {
        setTimeout(write, speed);
      } else {
        if (!isLastLine) {
          out.appendChild(document.createElement('br'));
        }
        if (cursor) out.appendChild(cursor); // al final de la línea (o última línea)
        resolve();
      }
    }, delayMs);
  });
}

function ensureCursor() {
  const out = document.getElementById('terminalOutput');
  if (!out) return null;
  let cursor = out.querySelector('.terminal-cursor');
  if (!cursor) {
    cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    out.appendChild(cursor);
  } else {
    out.appendChild(cursor); // mover al final
  }
  return cursor;
}

async function playTerminal() {
  ensureCursor();
  for (let i = 0; i < terminalLines.length; i++) {
    const isLast = i === terminalLines.length - 1;
    await typeLine(terminalLines[i], i === 0 ? 200 : 100, isLast);
    ensureCursor();
  }
  ensureCursor();
}

// Animaciones de entrada con GSAP
window.addEventListener('DOMContentLoaded', () => {
  // hero
  if (window.gsap) {
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    gsap.from('.hero-left', { y: 18, opacity: 0, duration: 0.8, ease: 'power2.out' });
    gsap.from('.hero-right', { y: 18, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15 });
    gsap.utils.toArray('.section').forEach((sec, idx) => {
      if (idx === 0) return; // el hero ya animó
      gsap.from(sec, {
        scrollTrigger: { trigger: sec, start: 'top 75%' },
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });
    });
  }
  playTerminal();
});

