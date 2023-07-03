import { edit, answerComment } from "./main.js";
// const buttonWritter = document.getElementById("writter");

const listElement = document.getElementById("list");

// buttonWritter.addEventListener ('click',() => {
//   textInputElement.style.backgroundColor = "";
//   textareaInputElement.style.backgroundColor = "";
//   if (textInputElement.value === "" || textareaInputElement.value === "") {
//     textInputElement.style.backgroundColor = "red";
//     textareaInputElement.style.backgroundColor = "red"
//     return;
//   }
//   const date = new Date();
//   const formattedDate =
//   date.getDate().toString().padStart(2, '0') + '.' + 
//   (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
//   date.getFullYear().toString().slice(-2) + ' ' +
//   date.getHours().toString().padStart(2, '0') + ':' +
//   date.getMinutes().toString().padStart(2, '0');
//   const oldlistElement = listElement.innerHTML
//   listElement.innerHTML = oldlistElement + `<li class="comment">
//       <div class="comment-all">
//       <div class="comment-header">
//         <div>${textInputElement.value}
//         </div>
//         <div> ${formattedDate}
//         </div>
//       </div>
//       <div class="comment-body">
//         <div class="comment-text">
//           ${textareaInputElement.value}
//         </div>
//       </div>
//       </div>
//       <div class="comment-footer">
//         <div class="likes">
//           <span class="likes-counter">0</span>
//           <button class="like-button"></button>
//         </div>
//       </div>
//     </li>`;

// buttonWritter.disabled = true;
// buttonWritter.textContent = "Элемент добавляется...";
// const text = textareaInputElement.value;
// const name = textInputElement.value;
// postPromise(text, name)
//   .then (() =>{
//     return fetchPromise();
//   })
//   .then ((data) => {
//     buttonWritter.disabled = false;
//     buttonWritter.textContent = "Написать";
//     textInputElement.value = "";
//     textareaInputElement.value = "";
//   })
//   .catch ((error) => {
//     console.log(error);
//     if (error.message === "Пропал интернет") {
//       alert("Кажется, что - то пошло не так, попробуйте позже");
//     }

//     if (error.message === "Неверный запрос") {
//       alert("Имя и комментарий должны быть не короче 3х символов");
//     }

//   })
//   .finally (()=> {
//     buttonWritter.disabled = false;
//     buttonWritter.textContent = "Написать";
//   })
//   renderComments(app, user, comments);

// });

export const renderComments = (
  app,
  user, 
  comments
  ) => {
    
    let isLoginMode = true;

    // Переменная надписи об авторизации
    const goToAuthHtml = `
      <div>
        <p class"auth-text">Чтобы добавить комментарий, <a href="#" id="loginLink">авторизуйтесь</a></p>
      </div>
    `;
  
    // форма добавления комментария
    const commentFormHtml = `
      <div class="add-form" id="addForm">
        <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="nameInput" value="${user}" disabled
        />
        <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4" id="commentInput">
        </textarea>
        <div class="add-form-row">
          <button class="add-form-button" id="buttonComment">Написать</button>
        </div>
      </div>`
  
      const commentsHtml = comments.map((item, index) =>{
        let activeLike = '';
        if (comments[index].isActiveLike) {
          activeLike ='-active-like'
        } 
        return `<li class="comment">
                  <div class="comment-all">
                  <div class="comment-header">
                    <div>${item.name}</div>
                    <div>${item.date}</div>
                  </div>
                  <div class="comment-body">
                    <div class="${item.isEdit ? 'none-visible' : 'comment-text'}">
                      ${item.text}
                    </div>
                  </div>
                  </div>
                  <div class="comment-footer">
                    
                    <div class="likes">
                      <span class="likes-counter">${item.like}</span>
                      <button class="like-button ${activeLike}" data-index='${index}'></button>
                    </div>
                  </div>
                </li>`
              }
            )
            .join('') ; 
  
    // Разметка страницы HTML
    const appEl = document.getElementById('app');
    appHtml = `
      <div class="container">
        <ul class="comments" id="listComments">${commentsHtml}</ul>
      </div>
      ${!getToken() ? goToAuthHtml : commentFormHtml}
    `;
  
    appEl.innerHTML = appHtml;      
  
    // Обработчик клика Авторизуйтесь
    const loginLinkEl = document.getElementById('loginLink')
    loginLinkEl?.addEventListener('click', () => {
      renderLoginform();
    })
  
    // Обработчик клика кнопки "Войти"
    const renderLoginform = () => {
      appEl.innerHTML = `
        <div class="login-form" id="addForm">
          <h2 class="comment-text">${isLoginMode ? "Авторизация" : "Регистрация"}</h2>
          ${isLoginMode ? '' : `<input type="text" class="add-form-login-password" placeholder="Введите ваше имя" id="nameInput" value="" />`}
    
          <input type="text" class="add-form-login-password" placeholder="Введите ваше логин" id="loginInput" value="" /> 
    
          <input type="password" class="add-form-login-password" placeholder="Введите Ваш пароль" id="passwordInput" value=""/>
      
          <div class="add-form-row">
            <button class="buttonLogin" id="buttonLogin">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
          </div>
          <a href='#' style="text-decoration: underline;" class="comment-text" id="toggleLink">${isLoginMode ? 'Зарегистрироваться' : "Войти"}</a>
        </div>`
      
    const toggleButtonEl = document.getElementById('toggleLink')
    toggleButtonEl.addEventListener('click', () => {
      isLoginMode = !isLoginMode;
      renderLoginform();
    });
  
    // Обработчик клика войти/зарегистроваться
    const buttonLoginEl = document.getElementById('buttonLogin');
    buttonLoginEl.addEventListener('click', () => {
      const login = document.getElementById('loginInput').value;
      const password = document.getElementById('passwordInput').value;
  
      if (isLoginMode) {
        loginUser(login, password).then((response) => {
          setToken(response.user.token);
          renderComments(comments, appHtml, response.user.name);
          sendComment()
        })
      } else {
        const name = document.getElementById('nameInput').value;
        regUser(login, password, name)
          .then((response) => {
            setToken(response.user.token);
            renderComments(comments, appHtml, response.user.name);
            sendComment();
          })
      }
    })
    }


      // const appHtml = `
      // <div class="container">
      // <ul id="list" class="comments"> 
      // ${commentsHtml}
      // </ul>
      // <div class="add-form">
      // <input
      //   type="text"
      //   class="add-form-name"
      //   placeholder="Введите ваше имя"
      //   value=""
      //   id="add-text"
      // />
      // <textarea
      //   type="textarea"
      //   class="add-form-text"
      //   placeholder="Введите ваш коментарий"
      //   rows="4"
      //   value=""
      //   id="add-textarea"
      // ></textarea>
      // <div class="add-form-row">
      //   <button class="add-form-button" id="writter">Написать</button>
      // </div>
      // </div>
      // </div>
      // `
          // <div class=container>
          //   <ul class='comments'>
          //   ${
          //     isInitialLoading
          //       ? "<div class='loading'>Загрузка комментариев...</div>"
          //       : commentsHTML
          //   }
          //   </ul>
          //   ${
          //     user
          //       ? `
          //       <div class="add-form">
          //         <input
          //           type="text"
          //           class="add-form-name"
          //           placeholder="Введите ваше имя"
          //           id="name-input"
          //           value="${user.name}"
          //           disabled
          //         />
          //         <textarea
          //           type="textarea"
          //           class="add-form-text"
          //           placeholder="Введите ваш коментарий"
          //           rows="4"
          //           id="text-input"
          //         ></textarea>
          //         <div class="add-form-row">
          //           <button id="add-button" class="add-form-button">Написать</button>
          //         </div>
          //       </div>
          //   `
          //       : `<div class="form-loading" style="margin-top: 20px">
          //             Что бы добавить комментарий, <a href='#' id="go-to-login" href="">авторизуйтесь</a>
          //           </div>`
          //   }
          //   </div>`;

        // app.innerHTML = appHtml;

        // const listElement = document.getElementById("list");
        // listElement.innerHTML = commentsHtml;

        const likes = () => {
          const likeButtons = document.querySelectorAll('.like-button');
              for (const likeButton of likeButtons) {
                  likeButton.addEventListener('click', (e) => {
                  e.stopPropagation()
                  const index = likeButton.dataset.index;
              if (likeButton.classList.contains('-active-like')) {
                comments[index].like = Number(comments[index].like) -1;
                comments[index].isActiveLike = false;
              } else {
                comments[index].like = Number(comments[index].like) +1;
                comments[index].isActiveLike = true;
              }
                  renderComments(app, user, comments);
                  });
              };
          };
      likes();
      edit();
      answerComment();

      // buttonWritter.addEventListener ('click',() => {
      //   textInputElement.style.backgroundColor = "";
      //   textareaInputElement.style.backgroundColor = "";
      //   if (textInputElement.value === "" || textareaInputElement.value === "") {
      //     textInputElement.style.backgroundColor = "red";
      //     textareaInputElement.style.backgroundColor = "red"
      //     return;
      //   }
      //   const date = new Date();
      //   const formattedDate =
      //   date.getDate().toString().padStart(2, '0') + '.' + 
      //   (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
      //   date.getFullYear().toString().slice(-2) + ' ' +
      //   date.getHours().toString().padStart(2, '0') + ':' +
      //   date.getMinutes().toString().padStart(2, '0');
      //   const oldlistElement = listElement.innerHTML
      //   listElement.innerHTML = oldlistElement + `<li class="comment">
      //       <div class="comment-all">
      //       <div class="comment-header">
      //         <div>${textInputElement.value}
      //         </div>
      //         <div> ${formattedDate}
      //         </div>
      //       </div>
      //       <div class="comment-body">
      //         <div class="comment-text">
      //           ${textareaInputElement.value}
      //         </div>
      //       </div>
      //       </div>
      //       <div class="comment-footer">
      //         <div class="likes">
      //           <span class="likes-counter">0</span>
      //           <button class="like-button"></button>
      //         </div>
      //       </div>
      //     </li>`;
      
      // buttonWritter.disabled = true;
      // buttonWritter.textContent = "Элемент добавляется...";
      // const text = textareaInputElement.value;
      // const name = textInputElement.value;
      // postPromise(text, name)
      //   .then (() =>{
      //     return fetchPromise();
      //   })
      //   .then ((data) => {
      //     buttonWritter.disabled = false;
      //     buttonWritter.textContent = "Написать";
      //     textInputElement.value = "";
      //     textareaInputElement.value = "";
      //   })
      //   .catch ((error) => {
      //     console.log(error);
      //     if (error.message === "Пропал интернет") {
      //       alert("Кажется, что - то пошло не так, попробуйте позже");
      //     }
      
      //     if (error.message === "Неверный запрос") {
      //       alert("Имя и комментарий должны быть не короче 3х символов");
      //     }
      
      //   })
      //   .finally (()=> {
      //     buttonWritter.disabled = false;
      //     buttonWritter.textContent = "Написать";
      //   })
      //   renderComments(app, user, comments);
      
      // });
    };
    