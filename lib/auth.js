import { compare, hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase, getUser } from "./db";

export async function hashPassword(password) {
	return await hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
	return await compare(password, hashedPassword);
}

export const authOptions = {
	session: {
		strategy: "jwt"
	},
	providers: [
		CredentialsProvider({
			async authorize(credentials) {
				if (!credentials.email) {
					throw new Error("No email provided");
				}
				const client = await connectToDatabase();
				const user = await getUser(client, credentials.email);
				if (!user) {
					client.close();
					throw new Error("No user found");
				}

				if (!await verifyPassword(credentials.password, user.password)) {
					client.close();
					throw new Error("Incorrect password");
				}

				client.close();
				return { email: user.email };
			}
		})
	],
	secret: process.env.SECRET
};

export async function auth(req, res) {
	const session = await getServerSession(req, res, authOptions);
	
	if (session && session.user) {
		// 'getServerSession()' returns a Session object containing a 'user' property with an object
		//		The 'user' object contains various properties, with default values of 'undefined'
		//		NextJS does not accept Session objects with undefined values, so they have to be replaced with 'null'
		session.user = Object.entries(session.user)
			.reduce((obj, [key, value]) => {
				obj[key] = value? value : null;
				return obj;
			}, {});
	}

	return session;
}