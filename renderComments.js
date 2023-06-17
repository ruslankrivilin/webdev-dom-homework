export const renderComents = () => {
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
        listElement.innerHTML = comentsHtml;
      likes();
      edit();
      answerComment();
    };