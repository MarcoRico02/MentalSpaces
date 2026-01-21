import axios from 'axios';

async function getUser() {
  try {
    const response = await axios.get('http://localhost:8080/api/usuarios/all');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

export default getUser;