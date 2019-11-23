class User {
    constructor(firstName, lastName, email, creditCardNumber, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.creditCardNumber = creditCardNumber;
        this.password = password;
    }
}

class Login {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

export { User, Login };