const {
    active,
    none
} = {
    active: 'active',
    none: 'd-none'
}

AOS.init();


function $(className){
    return document.querySelectorAll(className)
}

const titleAnimation = $('.title-animation');

titleAnimation.forEach((item) => {
    const arr = item.dataset.titles.split(',');
    let index = 0;
    PrintItemsAnim(arr[index].split(''), item);

    setInterval(() => {
        index += 1;
        const strArray = arr[index].split('');

        PrintItemsAnim(strArray, item);

        if(index === arr.length - 1){
            index = 0
        }
    }, 6000)
})

function PrintItemsAnim(array, elem){
    elem.innerHTML = '';
    array.forEach((letter) => {
        const span = `<span style="--letter: '${letter}'"></span>`
        elem.insertAdjacentHTML('beforeend', span)
    })
}
