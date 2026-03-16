export const getLocalUserInfo = () => {
    if (!localStorage.getItem("user-info")) {
        return {
            id: localStorage.getItem("ID"),
            name: localStorage.getItem("NAME"),
            courseId: localStorage.getItem("COURSE_ID"),
            course: localStorage.getItem("COURSE"),
            avatarId: localStorage.getItem("AVATAR_ID"),
            avatarDefault: localStorage.getItem("AVATAR_DEFAULT"),
            avatarMedium: localStorage.getItem("AVATAR_MEDIUM"),
            avatarLow: localStorage.getItem("AVATAR_LOW"),
            maxScore: parseInt(localStorage.getItem("MAX_SCORE")),
            isAdmin: localStorage.getItem("IS_ADMIN") == "true", //depois,
        };
    }

    return JSON.parse(localStorage.getItem("user-info"));
};

export const setLocalUserInfo = (data) => {
    localStorage.setItem("user-info", JSON.stringify(data));
};
