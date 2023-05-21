interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address?: {
    country: string,
    city: string;
    street: string;
  }
}

export default User;