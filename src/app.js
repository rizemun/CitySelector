const CitySelector = require('./CitySelector/index.js');

// Пример создания компонента:
const citySelector = new CitySelector({
    elementId: 'citySelector',
    regionsUrl: 'http://localhost:3000/regions',
    localitiesUrl: 'http://localhost:3000/localities',
    saveUrl: 'http://localhost:3000/selectedRegions'
});

let createButton = $("#createCitySelector");
let destroyButton = $("#destroyCitySelector");

let CitySelectors = [];

createButton.on("click", () => {
    CitySelectors.push(new CitySelector({
        elementId: 'citySelector',
        regionsUrl: 'http://localhost:3000/regions',
        localitiesUrl: 'http://localhost:3000/localities',
        saveUrl: 'http://localhost:3000/selectedRegions'
    }))
});

destroyButton.on("click", () => {
    CitySelectors[0].destroy();
});
