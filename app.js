class User {
  constructor(id, name, city, phone) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.phone = phone;
  }
}
class UserHandler {
  constructor() {
    this.apiURL = "https://jsonplaceholder.typicode.com/users";
    this.users = [];
    this.initialize();
  }
  async initialize() {
    await this.fetchUsers();
    this.renderUsers();
    this.setupFormListener();
  }
  async fetchUsers() {
    try {
      const response = await fetch(this.apiURL);
      if (!response.ok) throw new Error("Unable to load users");
      const data = await response.json();
      console.log("data_received", data);
      this.users = data.map(
        (user) => new User(user.id, user.name, user.address.city, user.phone)
      );
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }
  renderUsers() {
    const tableBody = document.querySelector("#usersTable tbody");
    tableBody.innerHTML = "";
    this.users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.city}</td>
            `;
      tableBody.appendChild(row);
    });
  }
  async getUserById(id) {
    try {
      const response = await fetch(`${this.apiURL}/${id}`);
      if (!response.ok) throw new Error("User not found");
      const data = await response.json();
      return new User(data.id, data.name, data.address.city, data.phone);
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  }
  async displayUserInfo(id) {
    const user = await this.getUserById(id);
    const userInfoDiv = document.getElementById("userInfo");
    if (user) {
      userInfoDiv.innerHTML = `
                <h2>User Details</h2>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
            `;
    } else {
      userInfoDiv.innerHTML = "<p>User not found</p>";
    }
  }
  setupFormListener() {
    document.getElementById("userForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const userId = document.getElementById("userId").value;
      if (userId) {
        this.displayUserInfo(userId);
      } else {
        alert("Please enter a user ID.");
      }
    });
  }
}
new UserHandler();
