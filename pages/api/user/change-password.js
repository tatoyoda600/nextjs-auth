import { auth, verifyPassword } from "../../../lib/auth";
import { connectToDatabase, getUser, updatePassword } from "../../../lib/db";

export default async function handler(req, res) {
	switch (req.method) {
		case "PATCH":
			const { oldPassword, newPassword } = req.body;
			const session = await auth(req, res);
			
			if (!session || !session.user) {
				res.status(401).json({ message: "Not authenticated" });
				return;
			}

			if (!oldPassword || !newPassword || newPassword.trim().length < 7 || oldPassword.trim() === newPassword.trim()) {
				res.status(422).json({ message: "Invalid input" });
				return;
			}

			const client = await connectToDatabase();
			const user = await getUser(client, session.user.email);
			
			if (!user) {
				client.close()
				res.status(404).json({ message: "User not found" });
				return;
			}
			
			if (!await verifyPassword(oldPassword, user.password)) {
				client.close()
				res.status(422).json({ message: "Invalid password" });
				return;
			}

			const result = await updatePassword(client, session.user.email, newPassword);
			client.close();
			res.status(result.status).json({ message: result.message });
			break;
			
		default:
			res.status(400).json({ message: "Target does not exist" });
			break;
	}
}