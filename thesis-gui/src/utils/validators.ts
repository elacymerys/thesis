const nickRegexp = /^\w{3,16}$/;
const emailRegexp = /^.+@.+\..+$/;

export const validateNick = (nick: string): string => {
    if (!nick || !nickRegexp.test(nick)) {
        return 'Nick must be 3-16 characters long and must not contain special signs!';
    } else {
        return '';
    }
}

export const validateEmail = (email: string): string => {
    if (!email || !emailRegexp.test(email)) {
        return 'Email must be a valid email address!';
    } else {
        return '';
    }
}

export const validatePassword = (password: string): string => {
    if (!password || password.length < 8 || password.length > 100) {
        return 'Password must be 8 to 100 characters long!';
    } else {
        return '';
    }
}

export const validateQuestion = (question: string): string => {
    if (!question || question.length < 1 || question.length > 200) {
        return 'RankedQuiz must be 1-200 characters long!';
    } else {
        return '';
    }
}

export const validateAnswer = (answer: string): string => {
    if (!answer || answer.length < 1 || answer.length > 50) {
        return 'Answer must be 1-50 characters long!';
    } else {
        return '';
    }
}

export const validateQuestionsSetName = (answer: string): string => {
    if (!answer || answer.length < 1 || answer.length > 50) {
        return 'Questions set name must be 1-50 characters long!';
    } else {
        return '';
    }
}
