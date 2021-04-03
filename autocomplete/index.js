document.getElementById('inp')
    .addEventListener('click', event => {
        const input = document.getElementById(event.target['id']);
        let wrap;
        let list = document.createElement('div');
        const selector = `.${input.className}`;
        if (input.className === 'inputs__from') {
            wrap = document.getElementById('wrap1');
            list.className = 'autocomplete-list_from';
        } else if (input.className === 'inputs__to') {
            wrap = document.getElementById('wrap2');
            list.className = 'autocomplete-list_to';
        }
        wrap.appendChild(list);
        input.addEventListener('input', () => debounce(getSuggest(input.value, selector, list), 250));
    });

const getSuggest = async (searchText, selector, list) => {
    list.innerHTML = '';
    const listSelector = `.${list.className}`;
    if (searchText.length >= 3) {
        let matches = await fetch(`https://aerodatabox.p.rapidapi.com/airports/search/term?q=${searchText}&limit=5`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "a7cadd20e6msh028f8ab9d0e6814p1df2ddjsnb3b555259ec4",
                "x-rapidapi-host": "aerodatabox.p.rapidapi.com"
            }
        })
            .then(status)
            .then(response => response.json());

        let suggest = matches.items;
        suggest.forEach(place => {
            if (typeof place['municipalityName'] !== 'undefined') {
                let item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.tabIndex = 1;
                item.innerHTML = `${place['municipalityName']},  ${place['shortName']} (${place['iata']})`;
                list.appendChild(item);
                item.addEventListener('click', function () {
                    document.querySelector(selector).value = item.textContent;
                    document.querySelector(listSelector).style.display = 'none';
                });
            }
        });
    }
};

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

