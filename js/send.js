// send.js - small helper used on contact page or chat simulation
function sendMessage(){
  const input = document.getElementById('msg');
  if(!input || !input.value.trim()) return alert('Type a message.');
  const thread = document.getElementById('thread');
  const bubble = document.createElement('div');
  bubble.className = 'card';
  bubble.style.marginBottom = '8px';
  bubble.innerHTML = `<strong>You:</strong> <div>${input.value}</div>`;
  thread.appendChild(bubble);
  input.value='';
  setTimeout(()=> {
    const reply = document.createElement('div');
    reply.className='card';
    reply.style.background='#fff9e6';
    reply.innerHTML = '<strong>Seller:</strong> <div>Thanks for your message — this is a demo reply.</div>';
    thread.appendChild(reply);
    thread.scrollTop = thread.scrollHeight;
  }, 800);
}
