function searchByName() {
    const input = document.querySelector('.search input');
    const filter = input.value.toLowerCase();
    const columns = document.querySelectorAll('.deals > div');

    columns.forEach(col => {
        const cards = col.querySelectorAll('.tech, .lab, .qual-tech, .nego-tech');
        let hasVisible = false;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(filter) || filter === '') {
                card.style.display = '';
                hasVisible = true;
            } else {
                card.style.display = 'none';
            }
        });

        const content = col.querySelector('.content');
        let noResult = content.querySelector('.no-results');

        if (!hasVisible && filter !== '') {
            if (!noResult) {
                noResult = document.createElement('p');
                noResult.classList.add('no-results');
                noResult.textContent = 'No results found';
                content.appendChild(noResult);
            }
        } else {
            if (noResult) noResult.remove();
        }
    });
}

function buildCompanyBadge(item) {
    if (item.substatus === 'won') {
        return `<div class="win-btn"><i class="fa-regular fa-circle-check"></i> WON</div>`;
    }
    if (item.substatus === 'lost') {
        return `<div class="lose-btn"><i class="fa-regular fa-circle-xmark"></i> LOST</div>`;
    }
    return `<div class="core-btn">${item.company}</div>`;
}

function buildCard(item) {
    const highBadge = item.highValue ? `<div class="high">HIGH VALUE</div>` : '';
    const imgHtml = item.img ? `<img src="${item.img}" alt="person-img" class="per2">` : '';

    return `
        <div class="${item.cardClass}">
            ${highBadge}
            ${buildCompanyBadge(item)}
            <p class="cloud">${item.project}</p>
            <div class="value">
                <div class="value-label">
                <p>${item.valueLabel}</p>
                <p class="amount">${item.value}</p>
                </div>
                ${imgHtml}
            </div>
        </div>
    `;
}

fetch("data.json")
    .then(response => response.json())
    .then(json => {
        const dealsContainer = document.querySelector(".deals");
        dealsContainer.innerHTML = '';

        json.stages.forEach(stage => {
            const stageDeals = json.data.filter(d => d.status === stage.id);

            const col = document.createElement("div");
            col.classList.add(stage.colClass);

            col.innerHTML = `
                <div class="col-title">
                    <div class="${stage.dotClass}"><i class="fa-solid fa-circle"></i> ${stage.label}</div>
                    <div class="num">${stage.count}</div>
                </div>
                <div class="content">
                    ${stageDeals.map(item => buildCard(item)).join('')}
                </div>
            `;

            dealsContainer.appendChild(col);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

let sortAsc = true;
document.getElementById('sort-btn').addEventListener('click', () => {
    const columns = document.querySelectorAll('.deals > div');
    if (sortAsc) {
        document.querySelector('.fa-sort-up').style.display = 'none';
        document.querySelector('.fa-sort-down').style.display = 'block';
    } else {
        document.querySelector('.fa-sort-up').style.display = 'block';
        document.querySelector('.fa-sort-down').style.display = 'none';
    }
    columns.forEach(col => {
        const cards = Array.from(col.querySelectorAll('.tech,.lab,.qual-tech,.nego-tech'));
        cards.sort((a, b) => {
            const valA = parseInt(a.querySelector('.value .amount').textContent.trim().replace(/[$,]/g, '')) || 0;
            const valB = parseInt(b.querySelector('.value .amount').textContent.trim().replace(/[$,]/g, '')) || 0;
            return sortAsc ? valB - valA : valA - valB;
        });
        const content = col.querySelector('.content');
        cards.forEach(card => content.appendChild(card));
    });
    sortAsc = !sortAsc;
});

document.getElementById('new-record-btn').addEventListener('click', () => {
    document.getElementById('record-popup').classList.add('active');
});

document.getElementById('close-record-popup').addEventListener('click', () => {
    document.getElementById('record-popup').classList.remove('active');
});

document.getElementById('record-popup').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('active');
    }
});

document.getElementById('submit-record').addEventListener('click', () => {
    const category = document.getElementById('record-category').value;
    const company = document.getElementById('record-company').value.trim();
    const project = document.getElementById('record-project').value.trim();
    const rawValue = document.getElementById('record-value').value.trim();
    const substatus = document.getElementById('record-substatus').value;

    if (!company || !project || !rawValue) {
        alert('Please fill in all required fields.');
        return;
    }

    const numericValue = parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) {
        alert('Please enter a valid numeric value.');
        return;
    }
    const formattedValue = '$' + numericValue.toLocaleString();

    const cardClassMap = {
        prospecting: 'tech',
        qualification: 'qual-tech',
        proposal: 'tech',
        closed: 'tech'
    };
    
    const valueLabelMap = {
        prospecting: 'Value',
        qualification: 'Value',
        proposal: 'Value',
        closed: substatus === 'won' ? 'Final Value' : substatus === 'lost' ? 'Missed Opportunity' : 'Value'
    };

    const item = {
        company: company.toUpperCase(),
        project: project,
        valueLabel: valueLabelMap[category],
        value: formattedValue,
        img: '',
        status: category,
        cardClass: cardClassMap[category],
        substatus: substatus || undefined,
        highValue: numericValue >= 200000
    };

    const stageColMap = {
        prospecting: '.pros-col',
        qualification: '.qual-col',
        proposal: '.pro-col',
        closed: '.close-col'
    };

    const col = document.querySelector(stageColMap[category]);
    if (col) {
        const content = col.querySelector('.content');
        content.insertAdjacentHTML('beforeend', buildCard(item));
        const numBadge = col.querySelector('.num');
        if (numBadge) numBadge.textContent = parseInt(numBadge.textContent) + 1;
    }

    document.getElementById('record-company').value = '';
    document.getElementById('record-project').value = '';
    document.getElementById('record-value').value = '';
    document.getElementById('record-substatus').value = '';
    document.getElementById('record-popup').classList.remove('active');
});
