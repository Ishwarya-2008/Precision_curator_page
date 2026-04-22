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
    if(sortAsc){
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
