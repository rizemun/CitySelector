require('./style.less');

function CitySelector(settings) {

    let template = function () {
        return "<input type=\"button\" class=\"CitySelector__select-button\" value=\"Выбрать регион\">" +
            "<ul class=\"CitySelector__list CitySelector__regions hidden\"></ul>" +
            "<ul class=\"CitySelector__list CitySelector__localities hidden\"></ul>"
    };

    let target = document.getElementById(settings.elementId);
    let a = document.createElement("div");
    a.classList.add("CitySelector");
    a.innerHTML = template();
    target.append(a);

    $(a).on("click", (event) => {
        if (!event.target.classList.contains("CitySelector__select-button")) {
            return;
        }
        let button = event.target;
        button.classList.add("hidden");

        let lists = [].filter.call($(a).children(), elem => elem.classList.contains("CitySelector__list"));
        lists.forEach(elem => elem.classList.remove("hidden"));

        $.getJSON(settings.regionsUrl, (data) => {
            data.forEach(elem => {
                $(".CitySelector__regions").append(createLiElem(elem.title, elem.id, function () {
                    loadLocalities(settings.localitiesUrl, this.dataset.number);
                    changeSelection(this);
                }));
            });


        });
    });
    this.destroy = function () {
        let target = "#" + settings.elementId;
        let $target = $(target);
        let selectors = [].filter.call($(target).children(), elem => elem.classList.contains("CitySelector"));
        //$target.remove(selectors);
        //selectors.remove();
        $(selectors.pop()).remove();
    };
}


function changeSelection(that) {
    let nodes = $(that).parent().children();
    [].forEach.call(nodes, elem => {
        if (elem.classList.contains("_selected")) {
            elem.classList.remove("_selected");
        }
    });
    that.classList.add("_selected");
}

function loadLocalities(url, number) {
    let loc = $(".CitySelector__localities");
    loc.empty();
    $.getJSON(url, (data) => {
        data.forEach(region => {
            if (region.id === number) {
                region.list.forEach(city => {
                    loc.append(createLiElem(city, 0, function () {
                        changeSelection(this);
                        appendSaveButton(loc.parent());
                    }))
                });
            }
        });
    })
}


function createLiElem(title, number, onClickCallback) {
    let liElem = document.createElement("li");
    liElem.classList.add("CitySelector__item");
    liElem.innerHTML = title;
    liElem.dataset.title = title;
    if (number > 0) {
        liElem.dataset.number = number;
    }
    if (onClickCallback) {
        $(liElem).on("click", onClickCallback);
    }
    return liElem;
}

/*
Используется паттерн "синглтон"
 */
function appendSaveButton(target) {
    let buttonClass = "CitySelector__save";
    let $buttonClass = "." + buttonClass;

    if ($($buttonClass).length !== 0) {
        return;
    }
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Сохранить";
    button.classList.add(buttonClass);
    target.append(button);
    let $button = $(button);
    $button.on("click", function () {
        let neighbours = $button.parent().children();
        let lists = [].filter.call(neighbours, elem => elem.classList.contains("CitySelector__list"));
        let regions = $(lists[0]).children();
        let locations = $(lists[1]).children();
        let currentRegion = [].filter.call(regions, elem => elem.classList.contains("_selected"))[0];
        let currentLocation = [].filter.call(locations, elem => elem.classList.contains("_selected"))[0];
        console.log({
            region: currentRegion.dataset.title,
            locality: currentLocation.dataset.title,
            id: currentRegion.dataset.number
        });
    });


}


module.exports = CitySelector;





