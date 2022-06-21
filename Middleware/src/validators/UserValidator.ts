import axios from "axios";

export const userExists = () => {
    return {
        validator: async (userId: string) => {
            try {
                const res = await axios
                    .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/${userId}`);
                return true;
            } catch (err) {
                return false;
            }
        },
        message: "L'utilisateur n'existe pas.",
    };
};
