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

        $("#info")[0].style.display = "block";

        $.getJSON(settings.regionsUrl, (data) => {
            let regions = [].filter.call($(a).children(), elem => elem.classList.contains("CitySelector__regions"));
            let localies = [].filter.call($(a).children(), elem => elem.classList.contains("CitySelector__localities"));

            data.forEach(elem => {
                $(regions).append(createLiElem(elem.title, elem.id, function () {

                    let localityUrl = settings.localitiesUrl + "/" + elem.id;
                    console.log(localityUrl);
                    loadLocalities(localies, localityUrl, this.dataset.number, settings.saveUrl);
                    changeSelection(this);
                    changeDestination(elem.id,"");
                }));
            });


        });
    });
    this.destroy = function () {
        let target = "#" + settings.elementId;
        let selectors = [].filter.call($(target).children(), elem => elem.classList.contains("CitySelector"));
        $(selectors.pop()).remove();
    };
}

/**
 * Очищение выделения всех элементов списка и выделение указанного
 * @param that элемент, который надо сделать выделенным
 */
function changeSelection(that) {
    let nodes = $(that).parent().children();
    [].forEach.call(nodes, elem => {
        if (elem.classList.contains("_selected")) {
            elem.classList.remove("_selected");
        }
    });
    that.classList.add("_selected");
}

/**
 * Загрузка списка городов
 * @param target    <Ul> элемент в который записываются города;
 * @param url       запрос по которому получаем объект
 * @param number    номер региона
 */
function loadLocalities(target, url, number, saveUrl) {
    let loc = $(target);
    loc.empty();

    destroySaveButton(loc.parent());

    $.getJSON(url, (data) => {
        data.list.forEach(city => {
            loc.append(createLiElem(city, number, function () {
                changeSelection(this);
                appendSaveButton(loc.parent(), saveUrl);
                changeDestination(this.dataset.number, this.dataset.title);
            }))
        });
    });
}

/**
 * Создание элемента списка регионов/городов и назначение обработчика клика
 * @param title             Текст элемента (название города)
 * @param number            id города
 * @param onClickCallback   функция-обработчик клика на элемент
 * @returns {HTMLLIElement} элемент списка
 */
function createLiElem(title, number, onClickCallback) {
    let liElem = document.createElement("li");
    liElem.classList.add("CitySelector__item");
    liElem.innerHTML = title;
    liElem.dataset.title = title;
    liElem.dataset.number = number;
    if (onClickCallback) {
        $(liElem).on("click", onClickCallback);
    }
    return liElem;
}

/*
Используется паттерн "синглтон"
 */
/**
 * Создание и добавление кнопки сохранения к экземпляру модуля.
 * так же здесь создается обработчик нажатия на эту кнопку
 * @param target    элемент экземпляра модуля в который добавляем кнопку.
 */
function appendSaveButton(target, saveUrl) {
    let buttonClass = "CitySelector__save";
    let $buttonClass = "." + buttonClass;
    let buttonElem = [].filter.call(target.children(), elem => elem.classList.contains(buttonClass));

    if (buttonElem.length !== 0) {
        if(buttonElem[0].disabled === true){
            buttonElem[0].disabled = false;
        }
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
        let result ={
            region: currentRegion.dataset.number,
            locality: currentLocation.dataset.title
        };



        console.log("Синхронный POST запрос");
        console.log("сейчас будет ошибка что нельзя из основного потока запускать синхронный запрос");

        $.ajax({
            type: 'POST',
            url: saveUrl,
            data: result,
            success: ()=>{
                console.log("Ответ на запрос получен");
            },
            async: false
        });


        console.log(result);
    });
}

/**
 * Деактивирует кнопку сохранения
 * @param   target указатель на ту удаляемый элемент.
 */
function destroySaveButton(target){



    let buttonClass = "CitySelector__save";
    let buttonElem = [].filter.call(target.children(), elem => elem.classList.contains(buttonClass));
    if(buttonElem.length > 0){
        buttonElem[0].disabled = true;
        // $(buttonElem).remove();
    }

}

/**
 * Изменение информации в элементе вверху, справа
 * @param id        номер региона
 * @param locality  название города
 */
function changeDestination(id, locality){
    let target = {
        id: $("#regionText")[0],
        locality: $("#localityText")[0]
    };
    target.id.innerHTML = id;
    target.locality.innerHTML = locality;
}


module.exports = CitySelector;





