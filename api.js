    let token = "asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";

    const host = 'https://wedev-api.sky.pro/api/v2/ruslankrivilin/comments';

    const hostV1 = 'https://wedev-api.sky.pro/api';

    export const setToken = (newToken) => {
      token = newToken;
    };

    export const getToken = ( ) => {
      return token
    }; 

    //Функция входа по логину 
export const loginUser = (login, password) => {
  return fetch(
    `${hostV1}/user/login`,
    {
    method: "POST",
    body: JSON.stringify({
      login,
      password
    })
  }).then((response) => {
    return response.json()
  }) 
}

// Функция регистрации юзера
export const regUser = (login, password, name) => {
  return fetch(
    `${hostV1}/user`,
    {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
        name,
      })
    }
  ).then((response) => {
    return response.json()
  })
}

    export function fetchPromise() {
      return fetch(host,
      {
      method: "GET",
      headers: {
        Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((responseData) => {
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
            };
          });

          // renderComments(appComments);
          return appComments;
        });
    }

    export function postPromise(text, name) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
          text:text, name:name,
          forceError: true,
        }),
      }).then ((response) => {
          console.log(response);
          if (response.status === 201) {
            return response.json();
          } 
          else if(response.status === 400) {
            throw new Error ("Неверный запрос");          
          } 
          else if(response.status === 500) {
            throw new Error ("Пропал интернет");
          }
          else {
            throw new Error ("Неизвестная ошибка");
          }
          
        })
    }
    