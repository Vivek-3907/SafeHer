document.addEventListener('DOMContentLoaded', async () => {
  const schemeList = document.getElementById('schemeList');
  const accordion = document.getElementById('legalAccordion');

  const schemes = [
    { title: 'Vahli Dikri Yojana', description: 'Support for daughters through education and welfare assistance.' },
    { title: 'MMUY', description: 'Women empowerment initiatives for education and livelihoods.' },
    { title: 'PMMY', description: 'Microfinance support for women entrepreneurs.' },
    { title: 'KPSY', description: 'Nutrition and child welfare support for women and families.' },
    { title: 'Sakhi One Stop Crisis Centre', description: 'A one-stop emergency support centre for survivors.' }
  ];

  schemeList.innerHTML = schemes.map((scheme) => `
    <article class="scheme-item">
      <h3>${scheme.title}</h3>
      <p>${scheme.description}</p>
    </article>
  `).join('');

  const legal = [
    { title: 'Zero FIR', content: 'Any person can file a Zero FIR at any police station; the complaint will be recorded and transferred to the relevant jurisdiction.' },
    { title: 'BNSS Section 43', content: 'Women cannot be arrested at night under certain conditions without compliance with legal safeguards.' },
    { title: 'POSH Act 2013', content: 'Workplace sexual harassment complaints can be raised through the Internal Complaints Committee (ICC).' },
    { title: 'Domestic Violence Act 2005', content: 'Protection, shelter, residence rights, and legal recourse are available in domestic violence cases.' }
  ];

  accordion.innerHTML = legal.map((entry) => `
    <article class="accord-item">
      <h3>${entry.title}</h3>
      <p>${entry.content}</p>
    </article>
  `).join('');
});
