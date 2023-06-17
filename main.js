
import { fetchPromise } from "./api.js";
import { renderComents } from "./renderComents.js";
const buttonWritter = document.getElementById("writter");
const textInputElement = document.getElementById("add-text");
const textareaInputElement = document.getElementById("add-textarea");
const listElement = document.getElementById("list");
const deletElement = document.getElementById("comments.text");


let comments = [];

const fetchPromise = () => {
  return fetch ('https://webdev-hw-api.vercel.app/api/v1/ruslankrivilin/comments',
  {
    method: "GET"
  })
  .then ((response) => {
    return response.json();
  })
  .then ((responseData) => {
        const appComments = responseData.comments.map((comment) => {
        const dateComment = new Date(comment.date);
        return {
          name: comment.author.name,
          date: dateComment.getDate().toString().padStart(2, '0') + '.' + 
            (dateComment.getMonth() + 1).toString().padStart(2, '0') + '.' +
            dateComment.getFullYear().toString().slice(-2) + ' ' +
            dateComment.getHours().toString().padStart(2, '0') + ':' +
            dateComment.getMinutes().toString().padStart(2, '0'),
        text: comment.text,
        like: comment.likes,
        isActiveLikes: false,

        }
      })
      comments = appComments;
      renderComents();
  })
}
fetchPromise()
  

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
        renderComents();
        });
    };
};

const edit = () => {
const editButtons = document.querySelectorAll('.edit-button');
const commentBody = document.querySelectorAll('.comment-body');



editButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const commentBodyElem = commentBody[index];
    const comment = comments[index];

    if (comment.isEdit) {
      const textarea = document.querySelector('.edit-textarea');
      const newComment = textarea.value;
      comment.text = newComment;
    }

    comment.isEdit = !comment.isEdit;
    renderComents();
    })
  });

}

const answerComment = () => {
  const comentsElement = document.querySelectorAll('.comment')
  for (const comentElement of comentsElement) {
    comentElement.addEventListener("click", () => {
      textareaInputElement.value = `>${comentElement.querySelector('.comment-text').innerHTML
          .replaceAll("&amp;", "&")
          .replaceAll("&lt;", "<")
          .replaceAll("&gt;", ">")
          .replaceAll("&quot;", '"')}`
    + `\n\n${comentElement.querySelector('.comment-header').children[0].innerHTML
          .replaceAll("&amp;", "&")
          .replaceAll("&lt;", "<")
          .replaceAll("&gt;", ">")
          .replaceAll("&quot;", '"')},`
  })
}
}

const renderComents = () => {
const comentsHtml = comments.map((item, index) => {
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
    listElement.innerHTML = comentsHtml;
  likes();
  edit();
  answerComment();
};
fetchPromise();

buttonWritter.addEventListener ('click',() => {
  
  textInputElement.style.backgroundColor = "";
  textareaInputElement.style.backgroundColor = "";
  if (textInputElement.value === "" || textareaInputElement.value === "") {
    textInputElement.style.backgroundColor = "red";
    textareaInputElement.style.backgroundColor = "red"
    return;
  }
  const date = new Date();
  const formattedDate =
  date.getDate().toString().padStart(2, '0') + '.' + 
  (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
  date.getFullYear().toString().slice(-2) + ' ' +
  date.getHours().toString().padStart(2, '0') + ':' +
  date.getMinutes().toString().padStart(2, '0');
  const oldlistElement = listElement.innerHTML
  listElement.innerHTML = oldlistElement + `<li class="comment">
      <div class="comment-all">
      <div class="comment-header">
        <div>${textInputElement.value}
        </div>
        <div> ${formattedDate}
        </div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${textareaInputElement.value}
        </div>
      </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">0</span>
          <button class="like-button"></button>
        </div>
      </div>
    </li>`;

buttonWritter.disabled = true;
buttonWritter.textContent = "Элемент добавляется...";
fetch('https://webdev-hw-api.vercel.app/api/v1/ruslankrivilin/comments', {
    method: "POST",
    body: JSON.stringify({
      text: textareaInputElement.value, name: textInputElement.value,
      forceError: true,
    }),
  }).then ((response) => {
      console.log(response);
      if (response.status === 201) {
        return response.json();
      } 
      else if(response.status === 400) {
        alert ("Поле должно содержать хотя бы 3 символа");
        throw new Error ("Пользователь ввел меньше 3 символов");          
      } 
      else {
        alert ("Кажется, что - то пошло не так, попробуйте позже");
        throw new Error ("У пользователя пропал интернет");
      }
      
    })
  .then (() =>{
    return fetchPromise();
  })
  .then ((data) => {
    buttonWritter.disabled = false;
    buttonWritter.textContent = "Написать";
    textInputElement.value = "";
    textareaInputElement.value = "";
  })
  .catch ((error) => {
    console.log(error);

  })
  .finally (()=> {
    buttonWritter.disabled = false;
    buttonWritter.textContent = "Написать";
  })
  renderComents();

});