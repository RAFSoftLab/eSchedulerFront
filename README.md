# **eScheduler**
Documentation for deploying and running the eScheduler application.

---

## 📖 **Overview**
eScheduler is an application for managing and scheduling classes. The platform features two primary user roles:
- **Administrators** – Responsible for creating, managing, and updating the schedule.
- **Professors** – Can view their personalized class schedules.

The application is designed to be:
- **User-friendly** – Ensures smooth and intuitive user experience.
- **Efficient** – Optimized to handle large datasets and quickly generate schedules.
- **Customizable** – Easily adaptable to new features and changes in requirements.

---

## ⚙️ **Technologies Used**

### 🔹 **Backend**
- **Java 17**
- **Spring Boot 3**
- **Spring Data JPA**
- **Spring Security** 
- **Hibernate**
- **MySQL (Database)**

### 🔹 **Frontend**
- **Angular 19**
- **TypeScript**
- **Standalone module architecture**

### 🔹 **Development Tools**
- **IntelliJ IDEA** (for both backend and frontend development)
- **Postman** (for API testing)
- **XAMPP** (for running MySQL and phpMyAdmin)

---

## 📋 **Requirements**
To run the application locally, ensure the following dependencies are installed on your system:
- **Java Development Kit (JDK) 17 or higher**
- **Gradle (Groovy) Build Tool** (comes with Spring Boot Initializer)
- **Node.js** (version: 22.11.0)
- **XAMPP** (which includes MySQL and phpMyAdmin)

---

## 🚀 **Setup and Run Instructions**

### 🔹 **1. Clone the Repositories**
Clone the project repositories for both the backend and frontend to your local system:
```bash
# Clone backend repository
git clone https://github.com/RAFSoftLab/eSchedulerBackend.git eScheduler

# Clone frontend repository
git clone https://github.com/RAFSoftLab/eSchedulerFront.git eSchedulerFront
```

---

## 🔹 **2. Configure the Database**
1. **Create a MySQL database** named `raspodelanastave` using **phpMyAdmin** or the MySQL command line.
2. **Update the database credentials** in the backend configuration file (`application.properties` or `application.yml`):
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/raspodelanastave
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```
---

## 🔹 **3. Run the Backend**
1. **Navigate to the backend directory**:
    ```bash
    cd eScheduler/
    ```
2. **Build and run the backend application**:
    ```bash
    ./gradlew clean build
    ./gradlew bootRun
    ```
3. **The backend server will start on**:
   👉 **http://localhost:8080**

---

## 🔹 **4. Run the Frontend**
1. **Navigate to the frontend directory**:
    ```bash
    cd eSchedulerFront/
    ```
2. **Install the frontend dependencies**:
    ```bash
    npm install
    ```
3. **Start the Angular application**:
    ```bash
    ng serve
    ```
4. **The frontend server will start on**:
   👉 **http://localhost:4200**

---

## 📚 **API Documentation**
API documentation for the backend is automatically generated using **Swagger**.
You can access it at:
👉 **http://localhost:8080/swagger-ui.html**

---

## 🛠️ **Troubleshooting**

### 🔹 **Database Connection Error**
**Issue:** Unable to connect to the database.  
**Solution:**
- Verify that **XAMPP** is running, and MySQL is active.
- Check if **phpMyAdmin** shows the `raspodelanastave` database.
- Ensure the credentials in `application.properties` are correct.

---

### 🔹 **Frontend Build Error**
**Issue:** Errors when running `ng serve`.  
**Solution:**
- Ensure **Node.js** and **npm** are installed.
- Check the Node.js version with `node -v` and ensure compatibility.
- Run `npm install` before starting the server.

---

### 🔹 **Backend Startup Issues**
**Issue:** Backend does not start.  
**Solution:**
- Check for missing dependencies.
- Run:
    ```bash
    ./gradlew clean build
    ```
  to resolve issues related to dependencies or build errors.

