const ABOUT_STORAGE_KEY = 'redemption-pharmacy-about';

const defaultAboutContent = {
    pageTitle: 'About MediCare Pharmacy',
    pageSubtitle: 'Excellence in healthcare services since 2010',
    storyTitle: 'Our Story',
    story: [
        'MediCare Pharmacy was founded in 2010 with a simple mission: to provide exceptional pharmaceutical care and quality medications to our community. What started as a single pharmacy has grown into a network of trusted healthcare providers serving thousands of patients annually.',
        'Our commitment to excellence, patient safety, and community health has made us one of the most trusted pharmacies in the region. We believe that quality healthcare should be accessible and affordable for everyone.',
        'Today, MediCare Pharmacy stands as a beacon of trust and reliability, backed by a team of dedicated professionals who put patient health first.'
    ],
    mission: 'To provide exceptional pharmacy services and promote health and wellness in our community by delivering quality medications, expert advice, and compassionate care.',
    vision: 'To be the most trusted and innovative pharmacy in the region, recognized for our commitment to patient care, community health, and professional excellence.',
    values: 'Integrity, compassion, excellence, innovation, and community responsibility guide every decision we make and every service we provide.',
    team: [
        { name: 'Dr. James Mitchell', role: 'Pharmacist-in-Chief', credentials: 'BS Pharmacy, 20+ years experience' },
        { name: 'Sarah Johnson', role: 'Clinical Pharmacist', credentials: 'MS Clinical Pharmacy, 12 years experience' },
        { name: 'Michael Chen', role: 'Operations Manager', credentials: 'MBA Healthcare, 10 years experience' }
    ],
    communityTitle: 'Community Commitment',
    community: [
        'At MediCare Pharmacy, we believe in giving back to our community. We actively participate in health awareness programs, sponsor local health initiatives, and provide free consultations to underprivileged families.',
        'Our commitment extends beyond providing medications—we aim to improve the overall health and wellbeing of our community through education, prevention, and accessible healthcare services.'
    ]
};

function getAboutContent() {
    try {
        const savedContent = JSON.parse(localStorage.getItem(ABOUT_STORAGE_KEY));
        return savedContent ? { ...defaultAboutContent, ...savedContent } : defaultAboutContent;
    } catch (error) {
        return defaultAboutContent;
    }
}

function saveAboutContent(content) {
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(content));
}

function renderAboutContent() {
    const target = document.querySelector('[data-about-page]');
    if (!target) return;
    const content = getAboutContent();
    const text = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));

    document.querySelector('[data-about="pageTitle"]').textContent = content.pageTitle;
    document.querySelector('[data-about="pageSubtitle"]').textContent = content.pageSubtitle;
    document.querySelector('[data-about="storyTitle"]').textContent = content.storyTitle;
    document.querySelector('[data-about="story"]').innerHTML = content.story.map(paragraph => `<p>${text(paragraph)}</p>`).join('');
    document.querySelector('[data-about="mission"]').textContent = content.mission;
    document.querySelector('[data-about="vision"]').textContent = content.vision;
    document.querySelector('[data-about="values"]').textContent = content.values;
    document.querySelector('[data-about="team"]').innerHTML = content.team.map((member, index) => `<div class="about-team-member"><div class="about-team-icon">${member.image ? `<img src="${text(member.image)}" alt="${text(member.name)}">` : `<i class="fas ${['fa-user-md', 'fa-user-nurse', 'fa-user-tie'][index] || 'fa-user'}"></i>`}</div><h3>${text(member.name)}</h3><p class="team-role">${text(member.role)}</p><p class="team-credentials">${text(member.credentials)}</p></div>`).join('');
    document.querySelector('[data-about="communityTitle"]').textContent = content.communityTitle;
    document.querySelector('[data-about="community"]').innerHTML = content.community.map(paragraph => `<p>${text(paragraph)}</p>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem(ABOUT_STORAGE_KEY)) saveAboutContent(defaultAboutContent);
    renderAboutContent();
});

window.pharmacyAbout = { defaultAboutContent, getAboutContent, saveAboutContent, renderAboutContent };
