import { edit, answerComment } from "./main.js";
export const renderComments = (comments) => {
    const comentsHtml = comments.map((item, index) =>{
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
          const listElement = document.getElementById("list");
        listElement.innerHTML = comentsHtml;
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
                  renderComments(comments);
                  });
              };
          };
      likes();
      edit();
      answerComment();
    };
    