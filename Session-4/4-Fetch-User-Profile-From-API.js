async function getUserProfile(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) throw new Error("User not found");
        const user = await response.json();
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
    } catch (error) {
        console.log(error.message);
    }
}

getUserProfile(1);