let sortBtn = document.getElementById('sortBtn');
let loadMoreBtn = document.getElementById('loadMoreBtn');
let timelineList = document.getElementById('timelineList');

let sortAsc = false;

sortBtn.addEventListener('click', () => {
    let entries = Array.from(timelineList.querySelectorAll('.timeline-entry'));
    entries.sort((a, b) => {
        let dateA = new Date(a.getAttribute('data-date'));
        let dateB = new Date(b.getAttribute('data-date'));
        return sortAsc ? dateB - dateA : dateA - dateB;
    });
    entries.forEach(entry => timelineList.appendChild(entry));
    sortAsc = !sortAsc;
});

let dummyData = [
    {
        icon: 'fa-regular fa-envelope',
        iconClass: 'email-icon',
        title: 'Proposal Draft Sent',
        date: 'Oct 12, 3:30 PM',
        dataDate: '2024-10-12T15:30:00',
        desc: 'Sent the revised cloud migration proposal with updated pricing tiers and SLA terms to Alexandra for internal review.',
        tags: ['Email Outbound', 'Project: CloudScale']
    },
    {
        icon: 'fa-solid fa-phone',
        iconClass: 'call-icon',
        title: 'Technical Requirements Call',
        date: 'Oct 10, 11:00 AM',
        dataDate: '2024-10-10T11:00:00',
        desc: '"We need at least 99.95% uptime guarantee and a dedicated support channel for the first 6 months."',
        quote: true,
        people: { names: 'Alexandra & DevOps Lead (22 mins)' }
    },
    {
        icon: 'fa-regular fa-file-lines',
        iconClass: 'note-icon',
        title: 'Private Note: Competitor Intel',
        date: 'Oct 8, 5:15 PM',
        dataDate: '2024-10-08T17:15:00',
        desc: 'Neotech is also evaluating a proposal from Skyward Systems. Their pricing is aggressive but lacks the managed services layer we offer.'
    },
    {
        icon: 'fa-regular fa-envelope',
        iconClass: 'email-icon',
        title: 'Meeting Recap: Kickoff Alignment',
        date: 'Oct 5, 9:00 AM',
        dataDate: '2024-10-05T09:00:00',
        desc: 'Shared meeting notes from the kickoff alignment session. Action items include finalizing the migration timeline and assigning workstream leads.',
        tags: ['Email Outbound', 'Internal']
    },
    {
        icon: 'fa-solid fa-phone',
        iconClass: 'call-icon',
        title: 'Outbound Follow-up Call',
        date: 'Oct 2, 2:00 PM',
        dataDate: '2024-10-02T14:00:00',
        desc: '"Budget discussions are progressing. The CFO wants a phased rollout option before signing off."',
        quote: true,
        people: { names: 'Marcus & Finance Team (18 mins)' }
    }
];

let loadCount = 0;

loadMoreBtn.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) {
        let data = dummyData[(i)];
        let entry = document.createElement('div');
        entry.classList.add('timeline-entry');
        entry.setAttribute('data-date', data.dataDate);

        let tagsHTML = '';
        if (data.tags) {
            tagsHTML = `<div class="entry-tags">${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
        }

        let peopleHTML = '';
        if (data.people) {
            peopleHTML = `
                <div class="entry-people">
                    <div class="people-avatars">
                        <img src="images/profile.jpg" alt="Person" class="avatar">
                        <img src="images/manager.jpg" alt="Person" class="avatar avatar-overlap">
                    </div>
                    <span class="people-names">${data.people.names}</span>
                </div>`;
        }

        entry.innerHTML = `
            <div class="entry-icon ${data.iconClass}">
                <i class="${data.icon}"></i>
            </div>
            <div class="entry-content">
                <div class="entry-top">
                    <h3 class="entry-title">${data.title}</h3>
                    <span class="entry-date">${data.date}</span>
                </div>
                <p class="entry-desc${data.quote ? ' entry-quote' : ''}">${data.desc}</p>
                ${tagsHTML}
                ${peopleHTML}
            </div>`;

        timelineList.appendChild(entry);
    }

    loadCount++;
});