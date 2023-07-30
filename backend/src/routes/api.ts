import { Router } from 'express';

import * as AuthController from '../controllers/authController';
import * as MeetingController from '../controllers/meetingController';
import * as MeetingChatController from '../controllers/meetingChatController';
import * as MeetingParticipantsController from '../controllers/meetingParticipantController';

import { Auth } from '../middlewares/auth';

const router = Router();

// Routes for authentication
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/verify', AuthController.verifyJWT);

// Routes for meetings
router.post('/meetings', Auth.private, MeetingController.create)
router.get('/meetings/:code', Auth.private, MeetingController.findOne)
router.get('/meetings/:code/chat', Auth.private, MeetingChatController.getChat)
router.get('/meetings/:code/participants', Auth.private, MeetingParticipantsController.getParticipants)
router.get('/meetings/:code/participants/:user', Auth.private, MeetingParticipantsController.getOneParticipant)

export default router;