function sendVerificationEmail(email) {
    return new Promise((resolve) => {
        console.log("Sending verification email...");
        setTimeout(() => {
            console.log("Email sent successfully");
            resolve();
        }, 1000);
    });
}

async function registerUser(name, email) {
    try {
        if (!name || !email) throw new Error("Invalid input");
        await sendVerificationEmail(email);
        console.log("User registered successfully");
    } catch (error) {
        console.log(error.message);
    }
}

registerUser("Esraa", "esraa@gmail.com");