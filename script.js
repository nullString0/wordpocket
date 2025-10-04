const addBtn = document.getElementById('add');
const container = document.getElementById('container');

const tips = document.createElement('div');
tips.id = 'tips';
tips.innerHTML = `
    再編集・転換／削除ボタン<br>
    1.ここに単語を入力します<br>
    2.意味やメモを入力します
`
document.body.appendChild(tips);

const words = JSON.parse(localStorage.getItem('words')) || [];
words.forEach(function(wordObject){
        addNewWord(wordObject);
    });

addBtn.addEventListener('click', function() {
    addNewWord();

    if (container.children.length === 1) {
        tips.style.display = 'block';
    }

    if (container.children.length === 2) {
        tips.style.display = 'none';
    }
});

function addNewWord(data = {}) {
    const wordText = data.word || '';
    const transText = data.translation || '';

    const word = document.createElement('div');
    word.classList.add('word');

    word.innerHTML = `
    <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div class="main-word ${wordText ? '' : 'hidden'}"></div>
    <div class="main-trans hidden"></div>
    <textarea class="word-input ${wordText ? 'hidden' : ''}"></textarea>
    <textarea class="trans-input ${wordText ? 'hidden' : ''}"></textarea>
    `;

    const editButton = word.querySelector('.edit');
    const deleteButon = word.querySelector('.delete');
    const mainWord = word.querySelector('.main-word');
    const mainTrans = word.querySelector('.main-trans');
    const textAreaWord = word.querySelector('.word-input');
    const textAreaTrans = word.querySelector('.trans-input');

    textAreaWord.value = wordText;
    textAreaTrans.value = transText;
    mainWord.innerHTML = marked(wordText);
    mainTrans.innerHTML = marked(transText);

    deleteButon.addEventListener('click', function() {
        word.remove();
        updateLS();
    });

    editButton.addEventListener('click', function(){
        mainWord.classList.toggle('hidden');
        textAreaWord.classList.toggle('hidden');
        textAreaTrans.classList.toggle('hidden');
        
        if (!textAreaWord.classList.contains('hidden')) {
        textAreaWord.focus();
        }
    });

    const updateContent = function() {
        const wordValue = textAreaWord.value.trim();
        const transValue = textAreaTrans.value.trim();

        mainWord.innerHTML = marked(wordValue);
        mainTrans.innerHIML = marked(transValue);

        updateLS();
    };

    textAreaWord.addEventListener('input', function() {
        updateContent();
    });
    textAreaTrans.addEventListener('input', function() {
        updateContent();
    });

    container.appendChild(word);
}

function updateLS() {
    const allWordInputs = document.querySelectorAll('.word-input');
    const allTransInputs = document.querySelectorAll('.trans-input');

    const allWords = [];

    allWordInputs.forEach(function(wordArea, index) {
        const word = wordArea.value.trim();
        const translation = allTransInputs[index].value.trim();
        if(word || translation) {
            allWords.push({ word, translation });
        }
    });

    localStorage.setItem('words', JSON.stringify(allWords));
}