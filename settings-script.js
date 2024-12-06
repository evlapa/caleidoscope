import { Container } from "./script_with-RAF-1.js";

let settings = {}

function getParameter(el) {
    return document.querySelector(`${el}`).value;
}

const btn = document.querySelector('.apply-btn');

btn.addEventListener('click', () => {
    const properties = ['quantity', 'color', 'size', 'borders', 'bordersColors', 'frequency'];
    const elems = ['#quantity', 'input[name="figure-color"]:checked', 'input[name="figure-size"]:checked', 'input[name="borders"]:checked', 'input[name="border-color"]:checked', '#frequency'];
    properties.map((key, index) => settings[key] = getParameter(elems[index]));

    new Container(settings);
});

