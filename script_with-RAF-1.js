export class Container {
    constructor(userSettings) {
        this.userSettings = userSettings;
        this.figureNumber = this.userSettings.quantity;
        this.currentElements = [];
        this.size = this.calculateSize(); // посчитали размер контейнера в зависимости от ширины и высоты wrapper (взяли меньший показатель)
        this.setContainerSize(); // установили размер контейнера после расчета выше
        this.setSectorsSize(); // рассчитали размер секторов в зависимости от размера контейнера
        this.spreadSectors(); // распределили секторы по кругу
        this.createPattern(); // добавили узор
        this.animatePattern(this.currentElements);
    }

    calculateSize() {
        const width = parseInt(document.querySelector('main').offsetWidth);
        const height = parseInt(document.querySelector('main').offsetHeight);
        return Math.min(width, height);
    }

    setContainerSize() {
        const container = document.querySelector('.container');
        container.style.height = this.size + 'px';
        container.style.width = this.size + 'px';
    }

    setSectorsSize() {
        const allSectors = document.querySelectorAll('.playArea');

        for (const div of allSectors) {
            div.style.height = this.size / 2 + 'px';
            div.style.width = this.size * Math.tan(0.26) + 'px';
            div.style.left = (this.size - parseInt(div.style.width)) / 2 + 'px';
            const svg = div.querySelector('svg');
            svg.style.height = '100%';
            svg.style.width = '100%';
        }
    }

    spreadSectors() {
        const allSectors = document.querySelectorAll('.playArea');
        for (let i = 0, angle = 0; i <= allSectors.length - 1; i++, angle += 30) {
            allSectors[i].style.transform = `rotate(${angle}deg)`;
        }
    }

    createPattern() {
        this.clearSectors();
        this.fillSectors(this.figureNumber, this.userSettings); // заполняем исходный сектор фигурами в зависимости от заданного количества и других заданных параметров
        console.log(this.currentElements);
    }

    clearSectors() {
        const svgList = document.querySelectorAll('svg');
        for (const svg of svgList) {
            svg.innerHTML = '';
        }
    }

    fillSectors(figureNumber, settings) {
        const originalSector = document.querySelector('.original'); // выбираем сектор с классом original
        const sectorContent = originalSector.querySelector('svg'); // выбираем его вложенный svg
        // запускаем цикл по наполнению svg фигурами в заданном количестве
        for (let i = 0; i < figureNumber; i++) {
            this.createElement(sectorContent, settings.size, settings.bordersColors, settings.borders, settings.color, i, this.getRandomNumber);
        }
    }

    animatePattern(elemArray) {
        for (const elem of elemArray) {
            this.animateElem(elem, this.copyOriginalSector);
        }
    }

    animateElem(elem, func) {
        var start = null;
        var element = document.querySelector(`.${elem.class}`);
        const duration = 30000;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = timestamp - start;
            element.setAttribute('transform', `translate(${Math.min((elem.targetTranslateX - elem.currentTranslateX) * progress / duration, elem.targetTranslateX)} ${Math.min((elem.targetTranslateY - elem.currentTranslateY) * progress / duration, elem.targetTranslateY)}) rotate(${Math.min((elem.targetRotateAngle - elem.currentRotateAngle) * progress / duration, elem.targetRotateAngle)} ${elem.rotationCenterX} ${elem.rotationCenterY})`);
            func();

            if (progress < duration) {
                window.requestAnimationFrame(step);
                // func();
            } else {
                console.log('Finished!')
            }
        }

        window.requestAnimationFrame(step);
    }

    copyOriginalSector() {
        const originalContent = document.querySelector('.original > .sector-content');

        const allSectors = document.querySelectorAll('.playArea:not(.original) > .sector-content');

        for (const sector of allSectors) {
            sector.innerHTML = originalContent.innerHTML;
        }
    }

    createElement(targetBlock, size, border, borderSize, color, index, func) {
        const elemTypes = ['circle', 'path', 'rect', 'ellipse']; // массив возможных фигур;
        const styles = window.getComputedStyle(targetBlock);
        const elemBlockWidth = this.getRandomNumber(1, parseInt(styles.width) * size * 0.01); // рассчитали ширину элемента в зависимости от размера сектора и заданного размера элементов
        const elemBlockHeight = this.getRandomNumber(1, parseInt(styles.height) * size * 0.01); // рассчитали высоту элемента в зависимости от размера сектора и заданного размера элементов

        const newElemType = elemTypes[this.getRandomNumber(0, elemTypes.length - 1)];

        function createPath() {
            let result = '';
            const radiusList = []; // сюда положим радиусы скруглений с помощью цикла ниже

            for (let i = 0; i < 4; i++) {
                radiusList.push(func(1, func(parseInt(styles.width), parseInt(styles.height))));
            }

            // Далее рассчитываем начальную точку, дуги, соединения между ними:
            const startPoint = `M0,${radiusList[0]}`;
            const arc1 = `A${radiusList[0]},${radiusList[0]} 0 0,1 ${radiusList[0]} 0 L${elemBlockWidth - radiusList[1]},0`;
            const arc2 = `A${radiusList[1]},${radiusList[1]} 0 0,1 ${elemBlockWidth} ${radiusList[1]} L${elemBlockWidth},${elemBlockHeight - radiusList[2]}`;
            const arc3 = `A${radiusList[2]},${radiusList[2]} 0 0,1 ${elemBlockWidth - radiusList[2]} ${elemBlockHeight} L${radiusList[3]},${elemBlockHeight}`;
            const arc4 = `A${radiusList[3]},${radiusList[3]} 0 0,1 0 ${elemBlockHeight - radiusList[3]} Z`;

            return result = `path d="${startPoint} ${arc1} ${arc2} ${arc3} ${arc4}"`;
        }

        function createCircle() {
            let result = '';
            const cx = func(1, parseInt(styles.width));
            const cy = func(1, parseInt(styles.height));
            const r = func(1, Math.max(parseInt(styles.width), parseInt(styles.height)) * size * 0.01);

            return result = `circle cx="${cx}" cy="${cy}" r="${r}"`
        }

        function createRect() {
            let result = '';
            const x = func(1, parseInt(styles.width));
            const y = func(1, parseInt(styles.height));
            const width = elemBlockWidth;
            const height = elemBlockHeight;

            return result = `rect x="${x}" y="${y}" width="${width}" height="${height}"`;
        }

        function createEllipse() {
            let result = '';
            const cx = func(1, parseInt(styles.width));
            const cy = func(1, parseInt(styles.height));
            const rx = func(1, elemBlockWidth);
            const ry = func(1, elemBlockHeight);

            return result = `ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"`;
        }

        let elemToInsert;

        switch (newElemType) {
            case 'circle':
                elemToInsert = createCircle();
                break;
            case 'path':
                elemToInsert = createPath();
                break;
            case 'rect':
                elemToInsert = createRect();
                break;
            case 'ellipse':
                elemToInsert = createEllipse();
                break;
        }

        // Определяем цвет границы, исходя из settings:
        let stroke = '';
        if (border === 'black') {
            stroke = '#000'
        } else if (border === 'random') {
            stroke = this.generateColor();
        }

        // Определяем толщину границ:
        let strokeLine = '0';
        if (borderSize === 'thin') {
            strokeLine = '1';
        } else if (borderSize === 'thick') {
            strokeLine = '3';
        } else if (borderSize === 'random') {
            strokeLine = this.getRandomNumber(1, 3).toString();
        }

        // Определяем цвет заливки элемента:
        let fill = '';
        if (color === 'random') {
            fill = this.generateColor();
        } else {
            fill = '#fff';
        }

        // Определяем прозрачность заливки:
        let fillOpacity = Math.random().toFixed(2).toString();

        // Определяем поворот элемента:
        const rotation = this.getRandomNumber(0, 360);
        const translationX = this.getRandomNumber(0, parseInt(styles.width));
        const translationY = this.getRandomNumber(0, parseInt(styles.height));

        // Вставляем новый элемент в svg:

        targetBlock.innerHTML += `<${elemToInsert} class="elem${index}" stroke="${stroke}" stroke-width="${strokeLine}" fill="${fill}" fill-opacity="${fillOpacity}" transform="translate(${translationX} ${translationY}) rotate(${rotation} ${Math.floor(elemBlockWidth / 2)} ${Math.floor(elemBlockHeight / 2)})" />`;

        // Вставляем новый элемент в массив текущих элементов:
        this.currentElements.push({
            class: `elem${index}`,
            currentTranslateX: translationX,
            currentTranslateY: translationY,
            currentRotateAngle: rotation,
            rotationCenterX: Math.floor(elemBlockWidth / 2),
            rotationCenterY: Math.floor(elemBlockHeight / 2),
            targetTranslateX: this.getRandomNumber(0, parseInt(styles.width)),
            targetTranslateY: this.getRandomNumber(0, parseInt(styles.height)),
            targetRotateAngle: this.getRandomNumber(0, 360)
        })
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    generateColor() {
        const rgbColor = [];
        for (let i = 0; i < 3; i++) {
            const colorNum = this.getRandomNumber(0, 256);
            rgbColor.push(colorNum);
        }

        return `rgb(${rgbColor.join(',')})`;
    }
}