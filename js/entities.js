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

class Campaign {
    constructor(shortName, urlIdentifier, description, deadline, goal){
        this.shortName = shortName;
        this.urlIdentifier = urlIdentifier;
        this.description = description;
        this.deadline = deadline;
        this.goal = goal;
        this.remaining = goal;
    }
}

export { User, Login, Campaign };