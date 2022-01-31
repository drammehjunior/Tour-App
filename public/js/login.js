
const login = async (email, password) => {
  try{
  const result = await axios({
        method: 'POST',
        url: 'http://localhost:8000/api/v1/users/login',
        data: {
          email,
          password
        }});
        console.log(result);
      }catch(err){
        console.log(err.response.data);
      }
    };

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password)
});