import {User} from "../types/user";
import {httpService} from "./http-service";
import {SignInRequest} from "../types/sign-in-request";
import {SignUpRequest} from "../types/sign-up-request";

export const userService = {
    getUser() {
        return httpService.get<User>('/auth/users/current');
    },

    signIn(request: SignInRequest) {
        return httpService.post<SignInRequest, User>('/auth/access-token', request);
    },

    signUp(request: SignUpRequest) {
        return httpService.post<SignUpRequest, User>('/auth/users', request);
    },

    signOut() {
        return httpService.delete<undefined, undefined>('/auth/users/current', undefined);
    },

    refreshTokens() {
        return httpService.post<undefined, User>('/auth/refresh-token', undefined);
    }
};
