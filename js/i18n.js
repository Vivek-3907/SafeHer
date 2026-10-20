const translations = {
  en: { title: 'SafeHer', hero: 'Women safety and empowerment platform' },
  gu: { title: 'સેફહેર', hero: 'મહિલાઓ માટે સુરક્ષા અને સશક્તિકરણ પ્લેટફોર્મ' },
  hi: { title: 'सेफहेर', hero: 'महिलाओं के लिए सुरक्षा और सशक्तिकरण प्लेटफ़ॉर्म' }
};

function applyLanguage(lang = 'en') {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
}

window.applyLanguage = applyLanguage;
