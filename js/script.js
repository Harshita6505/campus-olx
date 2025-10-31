// script.js - small interactivity for frontend (no backend)
// Navigation highlighting
document.addEventListener('DOMContentLoaded', ()=> {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a.navlink').forEach(a=>{
    if(a.getAttribute('href') === current) a.classList.add('cta');
  });

  // Simulate listing creation on resources page
  const addForm = document.getElementById('addListingForm');
  if(addForm){
    addForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const title = document.getElementById('title').value || 'Untitled';
      const desc = document.getElementById('description').value || '';
      const category = document.getElementById('category').value || 'Misc';
      const container = document.getElementById('listings');
      const card = document.createElement('div');
      card.className = 'card item';
      card.innerHTML = `<img src="images/sample.jpg" alt=""><h4>${title}</h4><p>${desc}</p><div class="resource-meta"><span class="badge">${category}</span><span class="small">Status: Available</span></div>`;
      container.prepend(card);
      addForm.reset();
      alert('Listing created locally (demo).');
    });
  }

  // Contact form (send.js simulation)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Message sent! (demo, no backend).');
      contactForm.reset();
    });
  }

  // Login/Register simple checks
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      if(!email.includes('@') || (!email.endsWith('.edu') && !email.endsWith('.ac.in') && !email.endsWith('.edu.in'))){
        alert('Please use a campus email (demo check).');
        return;
      }
      alert('Login successful (demo). Redirecting to resources.');
      location.href = 'resources.html';
    });
  }

  const regForm = document.getElementById('registerForm');
  if(regForm){
    regForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Registration successful (demo). You can now login.');
      location.href = 'login.html';
    });
  }
});
