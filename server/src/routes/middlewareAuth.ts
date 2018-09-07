import { Request, Response } from "express";
import { User } from "../entity/User";

export const userAuth = async (
	request: Request,
	response: Response,
	next: any
) => {
	if (request.session) {
		const user = await User.findOne({ where: { id: request.session.userId } });
		if (!user || !user.id) {
			return response.sendStatus(401);
		}

		return next();
	}
};

export const adminAuth = async (
	request: Request,
	response: Response,
	next: any
) => {
	if (request.session) {
		const user = await User.findOne({ where: { id: request.session.userId } });
		if (!user || !user.id || !user.isAdmin) {
			return response.sendStatus(401);
		}

		return next();
	}
};