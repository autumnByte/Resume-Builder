// Basic helpers
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

// DOM refs
const fullName = $('#fullName');
const email = $('#email');
const phone = $('#phone');
const summary = $('#summary');
const pName = $('#pName');
const pMeta = $('#pMeta');
const pSummary = $('#pSummary');
const avatar = $('#avatar');
const pSkills = $('#pSkills');
const pEducation = $('#pEducation');
const pExperience = $('#pExperience');
const resumePreview = $('#resumePreview');
const progressBar = $('#progressBar');
const downloadBtn = $('#downloadPdf');

// create or get error message nodes for email/phone
function ensureErrorNode(input) {
  let node = input.nextElementSibling;
  if (!node || !node.classList.contains('field-error')) {
    node = document.createElement('span');
    node.className = 'field-error';
    input.parentNode.insertBefore(node, input.nextSibling);
  }
  return node;
}
const emailErr = ensureErrorNode(email);
const phoneErr = ensureErrorNode(phone);

// initial skills
const defaultSkills = ['Java','JavaScript','React','HTML','CSS','Node.js','SQL','Python'];
const skillsSet = new Set();

// fill skill options
const skillsList = $('#skillsList');
function makeSkillButton(skill){
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'skill-tag';
  btn.textContent = skill;
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => { toggleSkill(skill, btn); });
  return btn;
}
defaultSkills.forEach(s => skillsList.appendChild(makeSkillButton(s)));

// add custom skill input enter
$('#skillInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = e.target.value.trim();
    if (val) {
      const btn = makeSkillButton(val);
      skillsList.appendChild(btn);
      e.target.value = '';
      toggleSkill(val, btn);
      updatePreview();
      updateProgress();
    }
  }
});

function toggleSkill(skill, node) {
  if (skillsSet.has(skill)) {
    skillsSet.delete(skill);
    node && node.setAttribute('aria-pressed','false');
    if (node) node.style.opacity = .6;
  } else {
    skillsSet.add(skill);
    node && node.setAttribute('aria-pressed','true');
    if (node) node.style.opacity = 1;
  }
  updatePreview();
  updateProgress();
}

// Add education/experience rows
const educations = $('#educations');
const experiences = $('#experiences');
const eduTpl = $('#eduTpl');
const expTpl = $('#expTpl');

function addEducation(data = { institute: '', degree: '', year: '' }) {
  const clone = eduTpl.content.firstElementChild.cloneNode(true);
  clone.querySelector('.edu-institute').value = data.institute;
  clone.querySelector('.edu-degree').value = data.degree;
  clone.querySelector('.edu-year').value = data.year;
  clone.querySelector('.remove').addEventListener('click', () => { clone.remove(); updatePreview(); updateProgress(); });
  $$('.edu-institute, .edu-degree, .edu-year', clone).forEach(el => el.addEventListener('input', () => { updatePreview(); updateProgress(); }));
  educations.appendChild(clone);
  updatePreview(); updateProgress();
}

function addExperience(data = { role: '', company: '', desc: '' }) {
  const clone = expTpl.content.firstElementChild.cloneNode(true);
  clone.querySelector('.exp-role').value = data.role;
  clone.querySelector('.exp-company').value = data.company;
  clone.querySelector('.exp-desc').value = data.desc;
  clone.querySelector('.remove').addEventListener('click', () => { clone.remove(); updatePreview(); updateProgress(); });
  $$('.exp-role, .exp-company, .exp-desc', clone).forEach(el => el.addEventListener('input', () => { updatePreview(); updateProgress(); }));
  experiences.appendChild(clone);
  updatePreview(); updateProgress();
}

$('#addEdu').addEventListener('click', () => addEducation());
$('#addExp').addEventListener('click', () => addExperience());

// Live bindings for basic fields
[fullName, email, phone, summary].forEach(el => el.addEventListener('input', () => { updatePreview(); updateProgress(); }));

// -------- validation logic --------
function isValidEmail(v) {
  if (!v) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(v);
}

function isValidPhone(v) {
  if (!v) return false;
  // allow leading +, spaces, hyphens, parentheses; require 7-15 digits total
  const digits = v.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function validateEmailField() {
  const val = email.value.trim();
  if (!val) {
    email.classList.remove('input-error');
    emailErr.textContent = '';
    return false;
  }
  if (!isValidEmail(val)) {
    email.classList.add('input-error');
    emailErr.textContent = 'Please enter a valid email (e.g. you@example.com).';
    return false;
  } else {
    email.classList.remove('input-error');
    emailErr.textContent = '';
    return true;
  }
}

function validatePhoneField() {
  const val = phone.value.trim();
  if (!val) {
    phone.classList.remove('input-error');
    phoneErr.textContent = '';
    return false;
  }
  if (!isValidPhone(val)) {
    phone.classList.add('input-error');
    phoneErr.textContent = 'Enter a valid phone number (7–15 digits, + allowed).';
    return false;
  } else {
    phone.classList.remove('input-error');
    phoneErr.textContent = '';
    return true;
  }
}

// run validations live
email.addEventListener('input', () => { validateEmailField(); updateProgress(); });
phone.addEventListener('input', () => { validatePhoneField(); updateProgress(); });

// ensure preview updates as before
function updatePreview(){
  const nameVal = fullName.value.trim();
  pName.textContent = nameVal || 'Your Name';
  avatar.textContent = initialsFromName(nameVal) || 'SD';
  const metaParts = [];
  if (email.value.trim()) metaParts.push(email.value.trim());
  if (phone.value.trim()) metaParts.push(phone.value.trim());
  pMeta.textContent = metaParts.join(' · ') || 'Email · Phone';
  pSummary.textContent = summary.value.trim() || 'A short summary will appear here as you type.';

  // skills
  pSkills.innerHTML = '';
  if (skillsSet.size > 0) {
    skillsSet.forEach(s => {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = s;
      span.style.opacity = 1;
      pSkills.appendChild(span);
    });
  } else pSkills.innerHTML = '<span class="muted-small">No skills yet</span>';

  // education
  pEducation.innerHTML = '';
  const eduItems = $$('.edu-item', educations);
  if (eduItems.length === 0) pEducation.innerHTML = '<div class="muted-small">No education added</div>';
  else eduItems.forEach(it => {
    const inst = it.querySelector('.edu-institute').value.trim();
    const degree = it.querySelector('.edu-degree').value.trim();
    const year = it.querySelector('.edu-year').value.trim();
    const div = document.createElement('div'); div.style.marginBottom = '8px';
    div.innerHTML = `<div style="font-weight:700">${escapeHtml(degree || inst || 'Untitled')}</div><div class="muted-small">${escapeHtml(inst)} ${year ? '· ' + escapeHtml(year) : ''}</div>`;
    pEducation.appendChild(div);
  });

  // experience
  pExperience.innerHTML = '';
  const expItems = $$('.exp-item', experiences);
  if (expItems.length === 0) pExperience.innerHTML = '<div class="muted-small">No experience added</div>';
  else expItems.forEach(it => {
    const role = it.querySelector('.exp-role').value.trim();
    const company = it.querySelector('.exp-company').value.trim();
    const desc = it.querySelector('.exp-desc').value.trim();
    const div = document.createElement('div'); div.style.marginBottom = '8px';
    div.innerHTML = `<div style="font-weight:700">${escapeHtml(role || company || 'Untitled')}</div><div class="muted-small">${escapeHtml(company)}${desc ? '<div style="margin-top:6px">' + escapeHtml(desc) + '</div>' : ''}</div>`;
    pExperience.appendChild(div);
  });

  // set attribute to trigger animation
  const hasContent = nameVal || email.value.trim() || phone.value.trim() || summary.value.trim() || skillsSet.size > 0 || eduItems.length > 0 || expItems.length > 0;
  resumePreview.setAttribute('data-has-content', hasContent ? 'true' : 'false');
}

// small helpers
function initialsFromName(n){ if(!n) return ''; return n.split(' ').filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join(''); }
function escapeHtml(s){ return (s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

// Clear button
$('#clearBtn').addEventListener('click', () => {
  if (!confirm('Clear all fields and reset preview?')) return;
  // reset fields
  $('#resumeForm').reset();
  // clear dynamic lists
  educations.innerHTML = ''; experiences.innerHTML = '';
  // clear skills
  skillsSet.clear();
  // reduce opacity on skill buttons
  $$('.skill-tag', skillsList).forEach(btn => btn.style.opacity = .6);
  // clear validation states
  email.classList.remove('input-error');
  phone.classList.remove('input-error');
  emailErr.textContent = '';
  phoneErr.textContent = '';
  updatePreview(); updateProgress();
});

// Progress bar logic (simple heuristic)
function updateProgress(){
  const parts = [fullName.value.trim(), email.value.trim(), phone.value.trim(), summary.value.trim()];
  const filledCount = parts.filter(Boolean).length;
  const eduCount = $$('.edu-item', educations).length;
  const expCount = $$('.exp-item', experiences).length;
  const skillCount = skillsSet.size;
  const total = 6; // name,email,phone,summary,edu or exp, skill
  let score = filledCount;
  if (eduCount > 0 || expCount > 0) score++;
  if (skillCount > 0) score++;
  const pct = Math.round((score / total) * 100);
  progressBar.style.width = pct + '%';
}

// Download PDF: uses html2pdf.js from CDN (client-side). If offline, alert user.
// On click we check validation — if a field is filled but invalid, block and focus it.
$('#downloadPdf').addEventListener('click', () => {
  const emailVal = email.value.trim();
  const phoneVal = phone.value.trim();
  const emailValid = !emailVal || isValidEmail(emailVal); // OK if empty or valid
  const phoneValid = !phoneVal || isValidPhone(phoneVal);

  if (!emailValid) {
    validateEmailField(); // show error
    email.focus();
    alert('Please correct your email before downloading the PDF.');
    return;
  }
  if (!phoneValid) {
    validatePhoneField();
    phone.focus();
    alert('Please correct your phone number before downloading the PDF.');
    return;
  }

  // make a print-friendly clone
  const node = resumePreview.cloneNode(true);
  node.style.width = '800px';
  node.style.margin = '20px';
  node.style.boxShadow = 'none';
  // load html2pdf if available
  if (typeof html2pdf === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
    s.onload = () => generatePDF(node);
    s.onerror = () => alert('Could not load PDF library. You can still print the page (Ctrl+P).');
    document.body.appendChild(s);
  } else generatePDF(node);

  function generatePDF(node){
    const opt = {
      margin: 0.4,
      filename: (fullName.value.trim() || 'resume') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'in', format: 'a4' }
    };
    html2pdf().set(opt).from(node).save();
  }
});

// small keyboard nicety: pressing Ctrl+Enter downloads PDF
document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') $('#downloadPdf').click(); });

// init: add one edu and one exp default
addEducation({ institute: 'Your University', degree: 'B.Tech, CSE', year: '2023 - Present' });
addExperience({ role: 'Intern / Developer', company: 'Company Name', desc: 'Short description of role or achievements.' });
// style skill buttons initial opacity
$$('.skill-tag', skillsList).forEach(b => b.style.opacity = .6);
updatePreview(); updateProgress();
