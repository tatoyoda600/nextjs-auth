import { addUser, connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			const { email, password } = req.body;
		
			if (!email || !email.includes("@") || !password || password.trim().length < 7) {
				res.status(422).json({ message: "Invalid input" });
				return;
			}
			
			const client = await connectToDatabase();
			if (!client) {
				return;
			}
			const result = await addUser(client, email, password);
			res.status(result.status).json({ message: result.message });
			break;
			
		default:
			res.status(400).json({ message: "Target does not exist" });
			break;
	}
}