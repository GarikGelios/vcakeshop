# vCakeShop

**[Design](https://www.behance.net/gallery/86218617/zozhCake-landing-page-of-healthy-desserts-and-cakes)**
**[ColorScheme](https://colorscheme.ru/#5w11T7V--w0w0)**

- Project setup `npm install`

- Compiles and hot-reloads for development `npm run serve`

- Compiles and minifies for production `npm run build`

- Lints and fixes files `npm run lint`

- Customize configuration See [Configuration Reference](https://cli.vuejs.org/config/).

```js
"dependencies": {
    "axios": "^0.19.2",
    "core-js": "^3.6.5",
    "vue": "^2.6.11",
    "vue-router": "^3.2.0",
    "vuex": "^3.4.0"
  },
```

> Используя пресет с _vuex_ и _vue-router_ они сами создадут нужные папки и импортируют функции. Установить _axios_ надо самостоятельно

> Используй **Prettier-Standard - JavaScript formatter** плагин, чтобы успокоить eslint

## Google Drive вместо админки

1. Создал [папку](https://drive.google.com/drive/folders/10HQGzpGkPiUL1OgSpdZWzRZPTxSYxsni?usp=sharing) которая содержит картинки продукции и таблицу данные которой доступны из [json](https://spreadsheets.google.com/feeds/list/1PVWNPVPAZ8lPTJW4CkW95ybnRxT6G_SSX3RNNDdkWgg/1/public/full?alt=json)

2. Создал раздельную файловыю структуру для _store_ и импортировал всё в его главный файл _store/index.js_

3. В файле _store/actions/api-request.js_ делаю запрос в Google Таблицы, отправляю полученное в мутаци, где прокидываем дополнительно полученные данные из запроса

4. В файле _store/mutations/mutations.js_ принимаю экшен и записываю полученные данные в массив _spreadsheets: []_

5. В файле _store/getters/getters.js_ запрос реактивно получает данные из массива spreadsheets: [], который в state

6. Вывел в компонент представление _Home_ добавил компонент _v-catalog_

   6.2. чтобы из компонента сработал вызов api добавляю его метод из _vuex_ `methods: { ...mapActions(['GET_SPREADSHEETS_FROM_API']) }`

   6.1. как только компонент загружен, сразу вызываем api запрос на получение json из Google Таблиц `mounted () { this.GET_SPREADSHEETS_FROM_API() }`

   6.3. чтобы получать доступ к данным в шаблоне компонента добавляю его геттер в вычисляемые свойства `computed: { ...mapGetters(['SPREADSHEETS']) }`

7. Создал метод перебора массив с помощью метода *map*, чтобы получить толко нужную информацию с красивыми именами ключей и передал результат в *store* `this.ACT_PROCESSED_SPREADSHEETS_TO_STORE(arr)`

## Отслеживать изменения размера экрана в VUEX

1. В исходном компонете *App* объяви переменные в *data*

```js
    windowWidth: 1200, // ширина экрана
    windowType: ''     // тип экрана
```

2. Опиши размеры и типы  в *mounted()*, чтобы сразу при его отрисовке использовались

```js
    function switchWindowType(ww) { // сопоставляем размеры и тип
      if (ww >= 1200) {
        return "Extra large";
      } else if (ww >= 992 && ww <= 1199) {
        return "Large";
      } else if (ww >= 768 && ww <= 991) {
        return "Medium";
      } else if (ww >= 576 && ww <= 767) {
        return "Small";
      } else {
        return "Extra small";
      }
    }
```

3. Опиши фунцию, которая будет присваивать значения переменным и вызывать экшен. Вызови её при загрузке странице и запиши вызов при каждом изменении размера окна

```js
   function listenWindowSize() { //функция, которая будет измерять экран
      vm.windowWidth = window.innerWidth;
      vm.windowType = switchWindowType(vm.windowWidth); //имея размер определяем тип через функцию, где сопаставлены размеры и тип
      vm.WINDOW_SIZE(vm.windowType); //обращаемся к экшену и передаём ему тип
    }

    listenWindowSize(); //сразу вызываем написанную выше фунцию

    window.addEventListener("resize", function() { //запускаем всегда слушать изменения размера окна
      listenWindowSize();
    });
```

4. импортируй ``import { mapActions } from "vuex";`` и подключи для использования экшен ``...mapActions(["WINDOW_SIZE"])``

5. Экшен приниает название типа окна и передаёт его в мутацию ``WINDOW_SIZE({commit}, size) { commit('CHANGE_WINDOW_SIZE', size) } ``

6. Мутация принимает экшен и изменяет *store* ``CHANGE_WINDOW_SIZE(state, size) { state.windowSize = size; }``

7. Выведи значение типа экрана в *getters* ``WINDOW_TYPE(state) { return state.windowSize; } ``, чтобы использовать его в компонентах, прим. ``<small>window size: {{ this.WINDOW_TYPE }}</small>``

## Подключение Sass

1. Укажи настройки в корневом файле **vue.config.js**

```js
module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/assets/styles/styles.scss";`
            },
        }
    }
};
```

2. Сделай импорт в файл **main.js** `import './assets/styles/styles.scss'`

3. В компоненте в блоке ``<style>`` укажи атрибут ``lang="scss"`` и можно писать стили сразу в scss

## Вывод каталога

1. Создай новый массив с уникальными значениями категорий — их используй в меню `<div v-for="category in this.productCategories" :key="category"> {{ category }} </div>`

```js
productCategories () {
  return [
    ...new Set(
      this.GET_PROCESSED_SPREADSHEETS.map(({ category }) => category)
    )
  ]
}
```

2. Создал в каталоге массив `sortedProducts: []` в который попадают товары по переданному параметру из компонента *v-catalog-menu* через принятие в родителе `@select="selectCategory"`

3. присваивоить класс *checked*, если текущая выбранная категория равна категории этого элемента `:class="{ checked: li_checked==category }"`

4. Создал в *store* массив `cart: []` в который передаются уникальные значения по уникальному *id*

5. Добавил кнопки управления товаром в корзине: увеличить, уменьшить и удалить — из конкрентного товара передаю событие в родитель, т.к. нужен *index* с которым перебераем массив

> Vue это клиентский фреймворк, а отправка писем должна идти с серверной стороны

## backend server.js 

1. Установи пакет `npm install -S express`

2. Создай в корне проекта файл *server.js* и настрой сервер брать исходники из папки билда Vue `app.use('/', express.static(path.join(__dirname, '/dist')));`

3. Сделай билд Vue `npm run build` и потом запусти сервер `node server.js`

4. Установи автоматическое обновление при изменении файлов `npm i nodemon -D` и создай команду в файле *package.json* `"dev" : "nodemon server.js"` — теперь можешь запусскать сервер командой `npm run dev`

## Nodemailer

1. Установи необходимые пакеты `npm i dotenv -S` и сам `npm i nodemailer -S`

2. настрой отправку сообщений в *server.js*:

```js
app.post('/', (req, res) => {
const output = `
    <p>You have a new message from vCakeShop:</p>
    <ul>
      <li>name: ${req.body.text}</li>
    </ul>
  `
  const message = {
    from: 'Имя отправителя <почта@отправителя.com>', // sender address
    to: `почта@получателя.com`, // list of receivers
    subject: 'Тема сообщения', // Subject line
    html: output
  }
  mailer(message);
  res.redirect('/');
})
```

3. создай файл *nodemailer.js* и заполни (пример для Gmail):

```js
'use strict'
require('dotenv').config();

const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Сервер исходящей почты (SMTP) из настроек Gmail
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,   // тянется из .env
        pass: process.env.PASSWORD // тянется из .env
    }
});

const mailer = message => {
    transporter.sendMail(message, (err, info) =>{
        if(err) return console.log(err);
        console.log(`Email sent: `, info);
    })
};

module.exports = mailer;
```

4. Импортируй установленные пакеты в *server.js* `const mailer = require('./nodemailer')'`

5. Cоздай файл *.env* и укажи там логи и пароль от почты: `PASSWORD=пароль EMAIL=логин`

6. Оберни форму в тег *form* с атрибутами `method="POST" action="/"` и добавь кнопку отправки формы `<button type="submit">Send order</button>`

7. Каждый инпут формы должен иметь своё название в атрибуте *name* их надо передавать из запроса в html-письме в таком виде `${req.body.text}`

> Если используешь для отправки почты Gmail:
> разрещи подключение приложений в Gmail https://myaccount.google.com/lesssecureapps
> разреши не проверять капчей https://accounts.google.com/b/0/displayunlockcaptcha

### шаблон письма с переменными из цикла товаров в корзине

1. создай файл *nodemailer* и в ней файл *email.js* 

2. из *email.js* экспортируй фунцию создания шаблона письма `module.exports = function content(cart){ ...`, где в переменной *cart* функция будет принимать *req.body*

### OAUTH2

1. Отключи доступ небезопасных приложений в настройках *google account security checkup*

2. Перейди в *google developer console*, создай приложение

3. Перейди на страницу "Включить API и сервисы" и найди *GmailAPI* и жми кнопку включить

4. Создай учётные данные для GmailAPI вызываемого с Веб-сервера

5. ... см. https://www.youtube.com/watch?v=wevmV9iZswI

## Модальное для окно быстрого заказа

1. Создай отдельныый компонент для модального окна и импортируй его в компонент товара.

2. Создай в товаре кнопку для управления свойством видимости компонента модального окна ``showModal() {this.isModalVisible = !this.isModalVisible }`` и передавай из модального наверх вызов этого события по ликам кнопок самого окна

3. В модальном окне добавь тэги ``<slot></slot>`` чтобы передавать в это место из родителя элементы контента с сохранением html-структуры

4. Добавь в тэг затемнённой области модального окна атрибут, чтобы можно было обратиться конкретно к ней ``ref="modal_wrapper"``. Как только документ срендерился добавь слушать клики по этой области ``if (item.target === vm.$refs['modal_wrapper']){ vm.closeModal() }``

## Notification

1. Создай папку с файлом *notifications/notification.vue* и опиши в файле html-раметку уведомления

2. Создай цикл для перебора контента нотификаций содержимого в блоке ``v-for="message in messages"``, где содержимое *messages* приходит в **props** от родительского элемента

3. Укажи уникальный ключ, как ``:key="message.id"`` который в обекте будет уникально датой создания ``id: Date.now().toLocaleString()``

4. Размести компонент нотификации в родительском компоненте *v-catalog* и передай в него через props элемент массива *messages* ``{ name: 'notification name', id: Date.now().toLocaleString() }``

5. Добавь кнопки так же через props с условием, что если ничего не передаётся то и кнопку отображать не следует

6. Добавь к событию добавления товара в корзину последующее событие добавления нотификации в массив

```js
.then(() => {
  const timeStamp = Date.now().toLocaleString()
  this.messages.push({
    name: data.category + ' added to cart',
    id: timeStamp
  })
})
```

7. Оберни нотификации в их компоненте в тег *transition-group* и опиши стили с красивыми переходами

8. Добавь метод для скрытия нотификаций и вызывай его при изменении массива и при первом появлении компонента

```js
methods: {
  hideNotification () {
    const vm = this
    if (this.messages.length) {
      setTimeout(function () {
        vm.messages.splice(vm.messages.length - 1, 1)
      }, 3000)
    }
  }
},
watch: {
  messages () {
    this.hideNotification()
  }
},
mounted () {
  this.hideNotification()
}
```