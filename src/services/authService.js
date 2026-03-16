import Cookies from 'js-cookie';

import { setLocalUserInfo } from "../utils/userUtils";

const baseURL = "https://api-tabuada-glecio.vercel.app/api/v1/auth";

export const createUser = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/local/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const body = await response.json();
        const { data } = body;

        if (!response.ok) {
            const error = new Error(
                body.message || "Erro no registro de usuário"
            );
            error.statusCode = body.status_code || 500;

            throw error;
        }

        //localStorage.setItem("ACCESS_TOKEN", data.access_token);
        Cookies.set("token", data.access_token, { 
            expires: 15,
            secure: true,
            sameSite: "strict",
        });

        setLocalUserInfo({
            id: data.user.id,
            name: data.user.name,
            courseId: data.user.course_id,
            course: data.user.course.name,
            avatarId: data.user.avatar_id,
            avatarDefault: data.user.avatar.path_default,
            avatarMedium: data.user.avatar.path_256px,
            avatarLow: data.user.avatar.path_128px,
            maxScore: 0,
            isAdmin: data.user.is_admin,
        });

        return data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${baseURL}/local/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const body = await response.json();
        const { data } = body;

        if (!response.ok || body.status_code != 200) {
            const error = Error(body.message || "Erro na autenticação");
            error.statusCode = body.status_code || 500;

            throw error;
        }

        //localStorage.setItem("ACCESS_TOKEN", data.access_token);
        Cookies.set("token", data.access_token, {
            expires: 15,
            secure: true,
            sameSite: "strict",
        });

        setLocalUserInfo({
            id: data.user.id,
            name: data.user.name,
            courseId: data.user.course_id,
            course: data.user.course.name,
            avatarId: data.user.avatar_id,
            avatarDefault: data.user.avatar.path_default,
            avatarMedium: data.user.avatar.path_256px,
            avatarLow: data.user.avatar.path_128px,
            maxScore: data.user.max_score,
            isAdmin: data.user.is_admin,
        });

        return data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.clear();
    Cookies.remove("token");
    window.location.href = "/login";
};

export const resetPasswordRequest = async (email) => {
    try {
        const response = await fetch(`${baseURL}/password-reset/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Erro ao tentar enviar e-mail de recuperação"
            );
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const resetPasswordConfirm = async (token, newPassword) => {
    try {
        const response = await fetch(`${baseURL}/password-reset/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ new_password: newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao resetar a senha");
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
