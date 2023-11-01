import { MongoClient } from "mongodb";
import { hashPassword } from "./auth";

export async function connectToDatabase() {
	return MongoClient.connect(`mongodb+srv://${"admin"}:${"AYL06BPrQe3MyNlo"}@${"NextJS"}.a5bnmrt.mongodb.net/?retryWrites=true&w=majority`)
		.then((client) => {
			return client;
		})
		.catch((err) => {
			res.status(500).json({ message: "Could not connect to the database" });
			return null
		})
}

export async function getUser(client, email) {
	return client.db("auth-site")
		.collection("users")
		.findOne({email: email})
			.then ((result) => {
				return result
			})
			.catch((err) => {
				return null;
			});
}

export async function addUser(client, email, password) {
	if (await getUser(client, email)) {
		return {
			status: 500,
			message: "Email already exists in the database" 
		};
	}

	const user = {
		email: email,
		password: await hashPassword(password)
	};

	return client.db("auth-site")
		.collection("users")
		.insertOne(user)
			.then ((result) => {
				client.close();
				return {
					status: 201,
					message: "Success" 
				};
			})
			.catch((err) => {
				client.close();
				return {
					status: 500,
					message: "Could not store user in the database" 
				};
			});
}

export async function updatePassword(client, email, newPassword) {
	return client.db("auth-site")
		.collection("users")
		.updateOne({email: email}, {
			$set: {
				password: await hashPassword(newPassword)
			}
		})
			.then ((result) => {
				client.close();
				return {
					status: 201,
					message: "Success" 
				};
			})
			.catch((err) => {
				client.close();
				return {
					status: 500,
					message: "Could not update the password in the database" 
				};
			});
}