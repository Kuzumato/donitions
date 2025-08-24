// Customize the providers array below.
// Replace placeholder phone/account and QR paths with your actual data.
// uri: optional deep link to open the provider app (platform-dependent).
// qr: path to a large QR image (PNG) users can download or open.
// account: string to copy to clipboard as fallback.

const providers = [
  {
    id: 'gcash',
    name: 'GCASH',
    subtitle: 'Mobile wallet (GCash)',
    account: '09272237615', // change to your GCash phone or ID
    qr: 'qrs/qrgcash.jpg',    // put your QR image at this path
    // Example URIs: you must confirm the correct scheme with the provider.
    // These are placeholders and may not work until replaced with correct ones.
    uri: 'gcash://pay?recipient=09272237615'
  },
  {
    id: 'maya',
    name: 'MAYA',
    subtitle: 'Maya / PayMaya',
    account: '09272237615',
    qr: 'qrs/qrmaya.jpg',
    uri: 'maya://pay?recipient=09272237615'
  },
  // Add more providers here...
  {
    id: 'gotyme',
    name: 'GOTYME',
    subtitle: 'Gotyme Bank',
    account: '09272237615',
    qr: 'qrs/qrgotyme.jpg',
    uri: 'gotyme://(unlikely to be public)'
  },

  {
    id: 'ladnbank',
    name: 'LANDBANK',
    subtitle: 'Landbank',
    account: '09272237615',
    qr: 'qrs/qrlandbank.jpg',
    uri: 'landbank://(usually not available)'
  }
 ];

const providersEl = document.getElementById('providers');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalQR = document.getElementById('modalQR');
const downloadQR = document.getElementById('downloadQR');
const copyAccountBtn = document.getElementById('copyAccount');
const openAppBtn = document.getElementById('openApp');
const modalClose = document.getElementById('modalClose');

function createProviderButton(p){
  const a = document.createElement('button');
  a.className = 'btn-provider';
  a.setAttribute('data-id', p.id);
  a.innerHTML = `
    <img src="${p.qr}" alt="${p.name} logo" onerror="this.style.display='none'"/>
    <div class="provider-meta">
      <div class="provider-name">${p.name}</div>
      <div class="provider-sub">${p.subtitle}</div>
    </div>
  `;
  a.addEventListener('click', () => onProviderClick(p));
  return a;
}

function onProviderClick(p){
  // Try to open the app via URI if provided
  if(p.uri){
    tryOpenUri(p.uri, () => showModal(p));
    // also show modal after short timeout as fallback if app didn't open
    // showModal will be called by fallback in tryOpenUri
  } else {
    // No deep link configured: show modal with QR + copy
    showModal(p);
  }
}

function showModal(p){
  modal.setAttribute('aria-hidden', 'false');
  modalTitle.textContent = p.name;
  modalQR.src = p.qr;
  downloadQR.href = p.qr;
  downloadQR.setAttribute('download', `${p.id}-qr.png`);
  copyAccountBtn.onclick = () => {
    copyToClipboard(p.account);
  };
  openAppBtn.style.display = p.uri ? 'inline-block' : 'none';
  openAppBtn.href = p.uri || '#';
}

// Close modal handlers
modalClose.onclick = () => modal.setAttribute('aria-hidden','true');
modal.addEventListener('click', (e) => {
  if(e.target === modal) modal.setAttribute('aria-hidden','true');
});

function copyToClipboard(text){
  if(!text) return;
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(() => {
      copyAccountBtn.textContent = 'Copied ✓';
      setTimeout(()=>copyAccountBtn.textContent = 'Copy account', 1500);
    }).catch(err=>{
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try{
    document.execCommand('copy');
    alert('Account copied. Paste it in your e-wallet.');
  }catch(e){
    alert('Copy failed. Please copy manually: ' + text);
  }
  ta.remove();
}

// VERY SIMPLE heuristic to try opening a native app via URI scheme and fallback to modal.
// Note: mobile browsers behave differently; this heuristic uses a timeout to assume the app did not open.
function tryOpenUri(uri, fallback){
  // For some browsers, assigning window.location will attempt to open an app.
  // Use a timer to show the modal if the app didn't open.
  const now = Date.now();
  const timeout = 1100;
  let didHide = false;

  // Attempt to open
  window.location = uri;

  // After timeout, call fallback (show modal)
  setTimeout(() => {
    // If still on this page, show fallback
    fallback();
  }, timeout);
}

// Populate UI
providers.forEach(p => {
  providersEl.appendChild(createProviderButton(p));
});

// A small helper for edit link (optional)
document.getElementById('edit-link').href = location.href;